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
    const { latitude, longitude, monthlyCost } = req.body;
    //url consists of lattitude, longitude, and api key values changing. We just do that.
    const url = 'https://solar.googleapis.com/v1/buildingInsights:findClosest?location.latitude=' + latitude + '&location.longitude=' + longitude + '&requiredQuality=HIGH&key=' + process.env.SOLAR_API_KEY
    try
    {
        const solarData = await axios.get(url)
        //wait for data, then return it
        const dataJson = solarData.data
        const financialAnalysisArray = dataJson.solarPotential.financialAnalyses
        let lowerBound = 0
        //we'll say the upper bound is inclusive
        let upperBound = financialAnalysisArray.length - 1
        let i = -1
        let financialAnalysisIndex = 0
        //going to do a binary search to find the solar panel config closest in monthly cost to what was passed in
        while(true)
        {
            i = Math.floor((upperBound + lowerBound) / 2)
            if(i < 0 || i > financialAnalysisArray.length - 1)
            {
                console.log("AAAA")
                break
            }
            console.log(financialAnalysisArray[i].monthlyBill.units)
            console.log("i: " + i)
            console.log("upper bound: " + upperBound)
            console.log("lower bound: " + lowerBound)
            if(financialAnalysisArray[i].monthlyBill.units == monthlyCost)
            {
                financialAnalysisIndex = i
                break
            }
            else if(financialAnalysisArray[i].monthlyBill.units > monthlyCost)
            {
                console.log("go down")
                upperBound = i - 1
            }
            else if(financialAnalysisArray[i].monthlyBill.units < monthlyCost)
            {
                console.log("go up")
                lowerBound = i + 1
            }
            if(upperBound < lowerBound)
            {
                if(upperBound < 0)
                {
                    financialAnalysisIndex = lowerBound
                    break; 
                }
                if(lowerBound > financialAnalysisArray.length - 1)
                {
                    financialAnalysisIndex = upperBound
                    break;
                }
                let lowerDist = Math.abs(financialAnalysisArray[lowerBound].monthlyBill.units - monthlyCost)
                let upperDist = Math.abs(financialAnalysisArray[upperBound].monthlyBill.units - monthlyCost)
                financialAnalysisIndex = (lowerDist < upperDist) ? lowerBound : upperBound
                break
            }
        }
        console.log("final index: " + financialAnalysisIndex)
        const panelConfigIndex = financialAnalysisArray[financialAnalysisIndex].panelConfigIndex
        if(panelConfigIndex == -1)
        {
            return res.json({success: false, error: "No solar panels would help actually!"})
        }
        console.log("config index: " + panelConfigIndex)
        const numPanels = dataJson.solarPotential.solarPanelConfigs[panelConfigIndex].panelsCount
        return res.json({success: true, data: dataJson, numPanels: numPanels})
    }
    catch (error)
    {
        res.json({success: false, error: error})
    }
})

module.exports = router;