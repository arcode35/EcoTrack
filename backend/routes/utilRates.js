const express = require("express");
const router = express.Router();
const db = require("../firebase");
const bodyParser = require("body-parser");
const { default: axios } = require("axios");
require('dotenv').config({path: "../.env"});

//has it parse json automatically.
router.use(bodyParser.json());



//gets solar data
router.post("/utilRates/getData", async (req, res) => {

    const { latitude, longitude } = req.body;
    //url consists of lattitude, longitude, and api key values changing. We just do that.
    const url = "https://developer.nrel.gov/api/utility_rates/v3.json?api_key=" + process.env.UTILITY_RATES_API_KEY + "&lat=" + latitude + "&lon=" + longitude
    try
    {
        const rateData = await axios.get(url)
        //wait for data, then return it
        const dataJson = await rateData.data
        return res.json({success: true, data: dataJson})        
    }
    catch (error)
    {
        res.json({success: false, error: error})
    }
})

module.exports = router;