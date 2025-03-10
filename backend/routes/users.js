const express = require("express");
const router = express.Router();
const db = require("../firebase");

router.get("/", async (req, res) => {
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

router.post("/create_user", async (req, res) => {
  try {
    const user = {
      username: req.body.username,
      password: req.body.password,
    };

    const docRef = await db.collection("users").add(user);
    res.json({ id: docRef.id, ...user });
  } catch (error) {
    console.error("Error adding user to firebase ", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
