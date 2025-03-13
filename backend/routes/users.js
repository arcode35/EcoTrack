const express = require("express");
const router = express.Router();
const db = require("../firebase");
const bodyParser = require("body-parser");

router.use(bodyParser.json());

// 3/11 Claude
router.get("/users", async (req, res) => {
  try {
    const usersCollection = db.collection("users");
    const snapshot = await usersCollection.get();
    const users = [];
    snapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() });
    });
    res.json(users);
  } catch (error) {
    console.error("Error getting users: ", error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/users/create_user", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = {
      username,
      password,
    };

    console.log(username, password);

    const docRef = await db.collection("users").add(user);
    res.json({ id: docRef.id, ...user });
  } catch (error) {
    console.error("Error adding user to firebase ", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
