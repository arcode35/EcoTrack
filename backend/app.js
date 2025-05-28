const cors = require("cors");
const bodyParser = require("body-parser");
const express = require("express");
const next = require("next")
require("dotenv").config();

const backend = express();
const dev = false;
const frontend = next({dev})
//The port we are using.

const handle = frontend.getRequestHandler();


// Middleware
backend.use(cors()); // Enable CORS for cross-origin requests. Want to protect against such requests primarily.

//gets the routes listed in the file given from the path ./routes/users
const userRoutes = require("./routes/users");
const solarRoutes = require("./routes/solar");
const weatherRoutes = require("./routes/weather");
const utilRateRoutes = require("./routes/utilRates");

//parses json automatically
backend.use(bodyParser.json());

//adds the userRoutes and solarRoutes to the app such that they can be called.
backend.use("/", userRoutes);
backend.use("/", solarRoutes);
backend.use("/", weatherRoutes);
backend.use("/", utilRateRoutes);

// Sample route
// backend.get("/", (req, res) => {
//   res.send("Express server working");
// });


// Let Next.js handle everything else
frontend.prepare().then(() => {
  backend.all("*", (req, res) => {
    return handle(req, res);
  });

  //starting server
  backend.listen(process.env.NEXT_PUBLIC_PORT, () => {
    const url =  + process.env.NEXT_PUBLIC_PORT;
    console.log("Server is running");
    console.log(url);
  });
})
