const express = require("express");
const router = express.Router();
const db = require("../firebase");
const bodyParser = require("body-parser");
const { default: axios } = require("axios");
require("dotenv").config();

//has it parse json automatically.
router.use(bodyParser.json());

router.post("/weather/getData", async (req, res) => {
  const { latitude, longitude } = req.body;

  //url
  const url =
    "https://api.weatherstack.com/current?access_key=" +
    process.env.WEATHERSTACK_API_KEY;

  console.log(`${latitude}, ${longitude}`);

  const options = {
    method: "GET",
    url: url,
    params: {
      query: latitude && longitude ? `${latitude}, ${longitude}` : "New Delhi",
      historical_date: "2015-01-21",
    },
  };

  try {
    const response = await axios.request(options);
    return res.json({ success: true, data: response.data });
  } catch (error) {
    console.error(error); // 404 Not Found in console
    return res.json({ success: false, data: "An error occurred" });
  }
});

module.exports = router;
