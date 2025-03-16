const cors = require("cors");
const bodyParser = require("body-parser");
const express = require("express");

const app = express();
//The port we are using.
const PORT = 5000;

// Middleware
app.use(cors()); // Enable CORS for cross-origin requests. Want to protect against such requests primarily.

//gets the routes listed in the file given from the path ./routes/users
const userRoutes = require("./routes/users");
//adds the userRoutes to the app such that they can be called.
app.use("/", userRoutes);

//parses json automatically
app.use(bodyParser.json());

// Sample route
app.get("/", (req, res) => {
  res.send("Express server working");
});

//starting server
app.listen(PORT, () => {
  const url = `http://localhost:${PORT}`;
  console.log("Server is running");
  console.log(url);
});
