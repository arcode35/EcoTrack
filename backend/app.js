const cors = require("cors");
const bodyParser = require("body-parser");
const express = require("express");
require('dotenv').config();

const app = express();
//The port we are using.
const PORT = 5002;

// Middleware
app.use(cors()); // Enable CORS for cross-origin requests. Want to protect against such requests primarily.

//gets the routes listed in the file given from the path ./routes/users
const userRoutes = require("./routes/users");
const solarRoutes = require("./routes/solar");
const utilRateRoutes = require("./routes/utilRates");

//parses json automatically
app.use(bodyParser.json());

//adds the userRoutes and solarRoutes to the app such that they can be called.
app.use("/", userRoutes);
app.use("/", solarRoutes)
app.use("/", utilRateRoutes)


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
