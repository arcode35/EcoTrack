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

module.exports = router;
