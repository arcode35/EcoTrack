const express = require("express");
const router = express.Router();
const db = require("../firebase");
const bodyParser = require("body-parser");

//has it parse json automatically.
router.use(bodyParser.json());

// 3/11 Claude
router.get("/users", async (_, res) => 
{
  try 
  {
    //retrieves the user collection
    const usersCollection = db.collection("users");
    //gets a snapshot of all the things in the collection at the moment
    const snapshot = await usersCollection.get();
    let users = [];
    //puts user data into the user array for each user
    snapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() });
    });
    res.json({status: 200, message: "Retriving user list successful!", userList: users});
  }
  catch (error) 
  {
    //catching errors when trying to fetch the users.
    console.error("Error getting users: ", error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/users/create_user", async (req, res) => 
{
  try {
    const { username, password } = req.body;

    const user = { username, password };

    console.log(username, password);

    //getting a reference to the user documents and attempting to add.
    const docRef = await db.collection("users").add(user);

    res.json({ status: 200, message: "Setting user data successful!", id: docRef.id, ...user });
  } 
  catch (error) 
  {
    //catching the error if unable toadd
    console.error("Error adding user to firebase ", error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/users/login_user", async (req, res) => 
  {
    try {
      const { username, password } = req.body;
  
      const user = { username, password };
  
      console.log(username, password);
  
      //getting a reference to the user documents and attempting to add.

      //REST OF CODE HERE
      res.json({status: 200, message: "Logging user in successful!"});
    } 
    catch (error) 
    {
      //catching the error if unable toadd
      console.error("Error authenticating user with firebase ", error);
      res.status(500).send("Internal Server Error");
    }
  });

module.exports = router;
