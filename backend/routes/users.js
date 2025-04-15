const express = require("express");
const router = express.Router();
const db = require("../firebase");
const bodyParser = require("body-parser");

//has it parse json automatically.
router.use(bodyParser.json());

// 3/11 Claude
router.get("/users", async (_, res) => {
  try {
    //retrieves the user collection
    const usersCollection = db.collection("users");
    //gets a snapshot of all the things in the collection at the moment
    const snapshot = await usersCollection.get();
    let users = [];
    //puts user data into the user array for each user
    snapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() });
    });
    res.json({
      status: 200,
      message: "Retriving user list successful!",
      userList: users,
    });
  } catch (error) {
    //catching errors when trying to fetch the users.
    console.error("Error getting users: ", error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/users/create_user", async (req, res) => {
  const { username, password } = req.body;

  const user = { username, password };

  //makes sure username/password only accepts letters and numbers
  const regex = /^[a-zA-Z0-9]+$/
  //checks only for numbers
  const numRegex = /^[0-9]+$/
  //checks if username has special characters. If so return error
  if(!regex.test(username))
  {
    return res.json({
      success: false,
      message: "Username can only have letters and numbers!"
    })
  }

  //checks if username starts with number
  if(numRegex.test(username[0]))
  {
    return res.json({
      success: false,
      message: "Username must start with a letter!"
    })
  }

  //checks if password has special characters
  if(!regex.test(password))
  {
    return res.json({
      success: false,
      message: "Password can only have letters and numbers!"
    })
  }

  if(username.length < 8)
  {
    return res.json({
      success: false,
      message: "Username must have at least 8 characters!"
    })
  }

  if(password.length < 8)
    {
      return res.json({
        success: false,
        message: "Password must have at least 8 characters!"
      })
    }

  try 
  {
    const userRef = db.collection("users");
    const snapshot = await userRef
      .where("username", "==", username)
      .get();
    //if trying to register but the username already exists, don't let them register
    if(!snapshot.empty)
    {
      return res.json({
        success: false,
        message: "Username already exists!"
      })
    }

    //getting a reference to the user documents and attempting to add.
    const docRef = await db.collection("users").add(user);

    return res.json({
      success: true,
      message: "Setting user data successful!",
      id: docRef.id,
      ...user,
    });
  } catch (error) {
    //catching the error if unable toadd
    console.error("Error adding user to firebase ", error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/users/login_user", async (req, res) => {
  try {
    const { username, password } = req.body;

    const userRef = db.collection("users");
    const snapshot = await userRef
      .where("username", "==", username)
      .where("password", "==", password)
      .get();

    //when the username is not found
    if (snapshot.empty) {
      return res.json({
        success: false,
        message: "User not found!"        
      })
    }

    const userDoc = snapshot.docs[0];
    const userData = { id: userDoc.id, ...userDoc.data() };

    //REST OF CODE HERE
    return res.json({
      success: true,
      message: "Logging user in successful!",
      userRetrieved: userData,
    });
  } catch (error) {
    //catching the error if unable toadd
    console.error("Error authenticating user with firebase ", error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/users/update_energy_data", async(req, res) => {
  try
  {
    //first get all the inputs
    const {username, gemini, energyUsed, monthlyCost, panelsUsed, solarCost, savedMoney} = req.body
    const userRef = db.collection("users")
    //see if user exists
    const snapshot = await userRef
      .where("username", "==", username)
      .get();
    //if they don't, throw error
    if(snapshot.empty)
    {
      return res.json({
        success: false,
        message: "Could not find username!"
      })
    }
    //can get the user in particular with this
    const userDoc = snapshot.docs[0].ref
    //add new data results. If the collection doesn't already exist, it will be made
    await userDoc.collection("dataResults").add({
      Date: new Date(),
      Gemini_Response: gemini,
      Predicted_Energy_Usage: energyUsed,
      Predicted_Monthly_Cost: monthlyCost, 
      Solar_Panels_Used: panelsUsed,
      Cost_With_Solar: solarCost,
      Money_Saved_With_Solar: savedMoney
    })
    //return that it worked
    return res.json({
      success: true
    })
  }
  catch (error) {
    console.error("Error authenticating user with firebase ", error);
    return res.json({
      success: false,
      message: "Error authenticating with firebase: " + error
    })
  }
})

router.post("/users/get_energy_usage", async(req, res) => {
  const {username} = req.body
  const userRef = db.collection("users")
  try
  {
    const snapshot = await userRef.where("username", "==", username).get();
    //if snapshot with the username failed, assume the username doesn't exist and throw error
    if(snapshot.empty)
    {
      console.error("username not found!")
      return res.json({
        success: false,
        message: "Username not found!"
      })
    }
    const userDoc = snapshot.docs[0].ref
    //try to get dataResutls collection
    const dataResultsSnapshot = await userDoc.collection("dataResults").get()
    //if unable to get this colleciton, return error
    if(dataResultsSnapshot.empty)
    {
      console.error("no data stored!")
      return res.json({
        success: false,
        message: "Data not stored for this user!"
      })
    }

    let mostRecentData = -1;

    //going through all the data in this data results collection to find one with most recent date
    dataResultsSnapshot.forEach((doc) => {
      //get data for current documet
      const docData = doc.data()
      //get date from this
      const date = docData.Date.toDate()
      //then, first of most recent data is still -1 (no docs), mostRecentData becomes docData. Otherwise,
      //check if the date is later, if it is then change mostRecentData
      if(mostRecentData == -1 || date > mostRecentData.Date.toDate())
      {
        mostRecentData = docData
      }
    })
    //getting current time zone for the user
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    // by default assumes the user is in the UTC time zone, so have to specify the real
    //time zone instead
    const formattedDate = mostRecentData.Date.toDate().toLocaleString('en-US', {
      timeZone: timeZone,
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    })

    //now that we have our most recent data in mostRecentdata, return that.
    return res.json({
      success: true,
      date: formattedDate,
      solarCost: mostRecentData.Cost_With_Solar,
      geminiResponse: mostRecentData.Gemini_Response,
      moneySaved: mostRecentData.Money_Saved_With_Solar,
      energyUsed: mostRecentData.Predicted_Energy_Usage,
      monthlyCost: mostRecentData.Predicted_Monthly_Cost,
      panels: mostRecentData.Solar_Panels_Used
    })
  }
  catch (error) 
  {
    console.error("Error authenticating user with firebase ", error);
    return res.json({
      success: false,
      message: "Error getting data from firebase: " + error
    })
  }
})

router.post("/users/check_data_snapshot", async(req, res) => {
  const {username} = req.body
  const userRef = db.collection("users")
  try
  {
    const snapshot = await userRef.where("username", "==", username).get();
    //if snapshot with the username failed, assume the username doesn't exist and throw error
    if(snapshot.empty)
    {
      console.error("username not found!")
      return res.json({
        success: false,
        message: "Username not found!"
      })
    }
    const userDoc = snapshot.docs[0].ref
    //try to get dataResutls collection
    const dataResultsSnapshot = await userDoc.collection("dataResults").get()
    //if unable to get this colleciton, return error
    if(dataResultsSnapshot.empty)
    {
      console.error("no data stored!")
      return res.json({
        success: false,
        message: "Data not stored for this user!"
      })
    }
    return res.json({
      success: true
    })
  }
  catch (error) 
  {
    console.error("Error authenticating user with firebase ", error);
    return res.json({
      success: false,
      message: "Error getting data from firebase: " + error
    })
  }
})

module.exports = router;
