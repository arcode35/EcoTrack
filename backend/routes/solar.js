const express = require("express");
const router = express.Router();
const db = require("../firebase");
const bodyParser = require("body-parser");
const { default: axios } = require("axios");
require('dotenv').config();

//has it parse json automatically.
router.use(bodyParser.json());

//gets solar data
router.post("/solar/getData", async (req, res) => {
    const { latitude, longitude } = req.body;
    //url consists of lattitude, longitude, and api key values changing. We just do that.
    const url = 'https://solar.googleapis.com/v1/buildingInsights:findClosest?location.latitude=' + latitude + '&location.longitude=' + longitude + '&requiredQuality=HIGH&key=' + process.env.SOLAR_API_KEY
    try
    {
        const solarData = await axios.get(url)
        //wait for data, then return it
        const dataJson = await solarData.data
        return res.json({success: true, data: dataJson})
    }
    catch (error)
    {
        res.json({success: false, error: error})
    }
})

module.exports = router;