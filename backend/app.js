const express = require("express");
const app = express();
const router = express.Router();
const port = 3000;
const db = require("./firebase");

// figure out how to make this endpoint and create_users work
// look at gemini
// reading from firebase firestore collection
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

// Sample route
app.get("/", (req, res) => {
  res.send("Express server working");
});

// create user
app.post("/create_user", (req, res) => {
  const user = {
    username: req.body.username,
    password: req.body.password,
  };

  res.status(200).json(user);
});

//starting server
app.listen(port, () => {
  const url = `http://localhost:${port}`;
  console.log("Server is running");
  console.log(url);
});

module.exports = router;
