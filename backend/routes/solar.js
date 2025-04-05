const express = require("express");
const router = express.Router();
const db = require("../firebase");
const bodyParser = require("body-parser");
const { default: axios } = require("axios");
require('dotenv').config();

//has it parse json automatically.
router.use(bodyParser.json());

const getFinanceIndex = (financeArr, monthlyCost) => {
    let lowerBound = 0
    //we'll say the upper bound is inclusive
    let upperBound = financeArr.length - 1
    let i = -1
    let financialAnalysisIndex = 0
    //going to do a binary search to find the solar panel config closest in monthly cost to what was passed in
    while(true)
    {
        //get midpoint between bounds first
        i = Math.floor((upperBound + lowerBound) / 2)
        //if we found our target index, set it and break
        if(financeArr[i].monthlyBill.units == monthlyCost)
        {
            financialAnalysisIndex = i
            break
        }
        //if midpoint is more than our monthly cost, limit our upper bound to that and retry
        else if(financeArr[i].monthlyBill.units > monthlyCost)
        {
            upperBound = i - 1
        }
        //if midpoint is less than our monthly cost, limit our lower bound to that and retry
        else if(financeArr[i].monthlyBill.units < monthlyCost)
        {
            lowerBound = i + 1
        }
        //end condition to while loop. Now we need to decide which would be better to take as the index, and take that one
        if(upperBound < lowerBound)
        {
            //check first if one of the bounds is out of bounds; makes it clear we should take the other oen in that case
            if(upperBound < 0)
            {
                financialAnalysisIndex = lowerBound
                break; 
            }
            if(lowerBound > financeArr.length - 1)
            {
                financialAnalysisIndex = upperBound
                break;
            }
            //otherwise, compare disstances to the monthly cost for each bound, take the one closer to the true monthly cost
            let lowerDist = Math.abs(financeArr[lowerBound].monthlyBill.units - monthlyCost)
            let upperDist = Math.abs(financeArr[upperBound].monthlyBill.units - monthlyCost)
            financialAnalysisIndex = (lowerDist < upperDist) ? lowerBound : upperBound
            break
        }
    }
    console.log("final index: " + financialAnalysisIndex)
    return financialAnalysisIndex
}

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
        const financialAnalysisIndex = getFinanceIndex(financialAnalysisArray, monthlyCost)
        //get according to the object structure
        const panelConfigIndex = financialAnalysisArray[financialAnalysisIndex].panelConfigIndex
        //if we got -1, that means that we actually shouldn't use solar panels.
        if(panelConfigIndex == -1)
        {
            return res.json({success: false, error: "We actually don't need solar panels!"})
        }
        const numPanels = dataJson.solarPotential.solarPanelConfigs[panelConfigIndex].panelsCount
        //according to the structure
        const costBesidesSolarPanels = Number(financialAnalysisArray[financialAnalysisIndex].financialDetails.remainingLifetimeUtilityBill.units)
        const solarPanelInstallationCost = Number(financialAnalysisArray[financialAnalysisIndex].cashPurchaseSavings.upfrontCost.units)
        //adding the cost besides solar panels with the solar panel installation cost. Note that this is over 20 years btw.
        return res.json({success: true, data: dataJson, numPanels: numPanels, totalSolarCost: costBesidesSolarPanels + solarPanelInstallationCost})
    }
    catch (error)
    {
        return res.json({success: false, error: error})
    }
})

module.exports = router;