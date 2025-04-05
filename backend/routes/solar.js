const express = require("express");
const router = express.Router();
const db = require("../firebase");
const bodyParser = require("body-parser");
const { default: axios } = require("axios");
require('dotenv').config();

//has it parse json automatically.
router.use(bodyParser.json());

const getValue = (object, comparedPath) => {
    if(comparedPath == "monthlyBill")
    {
        return object.monthlyBill.units
    }
    if(comparedPath == "panelConfigIndex")
    {
        return object.panelConfigIndex
    }
    if(comparedPath == "panelsCount")
    {
        return object.panelsCount
    }
}

const binarySearch = (arr, comparedVal, comparedPath) => {
    let lowerBound = 0
    //we'll say the upper bound is inclusive
    let upperBound = arr.length - 1
    let i = -1
    let returnIndex = 0
    //going to do a binary search to find the solar panel config closest in monthly cost to what was passed in
    while(true)
    {
        //get midpoint between bounds first
        i = Math.floor((upperBound + lowerBound) / 2)
        //if we found our target index, set it and break
        if(getValue(arr[i], comparedPath) == comparedVal)
        {
            returnIndex = i
            break
        }
        //if midpoint is more than our monthly cost, limit our upper bound to that and retry
        else if(getValue(arr[i], comparedPath) > comparedVal)
        {
            upperBound = i - 1
        }
        //if midpoint is less than our monthly cost, limit our lower bound to that and retry
        else if(getValue(arr[i], comparedPath) < comparedVal)
        {
            lowerBound = i + 1
        }
        //end condition to while loop. Now we need to decide which would be better to take as the index, and take that one
        if(upperBound < lowerBound)
        {
            //check first if one of the bounds is out of bounds; makes it clear we should take the other oen in that case
            if(upperBound < 0)
            {
                returnIndex = lowerBound
                break; 
            }
            if(lowerBound > arr.length - 1)
            {
                returnIndex = upperBound
                break;
            }
            //otherwise, compare disstances to the monthly cost for each bound, take the one closer to the true monthly cost
            let lowerDist = Math.abs(getValue(arr[lowerBound], comparedPath) - comparedVal)
            let upperDist = Math.abs(getValue(arr[upperBound], comparedPath) - comparedVal)
            returnIndex = (lowerDist < upperDist) ? lowerBound : upperBound
            break
        }
    }
    console.log("final index: " + returnIndex)
    return returnIndex
}

const getSolarCost = (panelsCount, yearlyEnergyDcKwh, monthlyAverageEnergyBill, energyCostPerKwh, panelCapacityWatts, solarIncentives) => {
    const installationCostPerWatt = 4
    const installationLifeSpan = 20
    // Advanced settings
    let dcToAcDerate = 0.85;
    let efficiencyDepreciationFactor = 0.995;
    let costIncreaseFactor = 1.022;
    let discountRate = 1.04;

    // Solar installation
    let installationSizeKw = (panelsCount * panelCapacityWatts) / 1000;
    let installationCostTotal = installationCostPerWatt * installationSizeKw * 1000;

    // Energy consumption
    let monthlyKwhEnergyConsumption = monthlyAverageEnergyBill / energyCostPerKwh;
    let yearlyKwhEnergyConsumption = monthlyKwhEnergyConsumption * 12;

    // Energy produced for installation life span
    let initialAcKwhPerYear = yearlyEnergyDcKwh * dcToAcDerate;
    let yearlyProductionAcKwh = [...Array(installationLifeSpan).keys()].map(
    (year) => initialAcKwhPerYear * efficiencyDepreciationFactor ** year,
    );

    // Cost with solar for installation life span
    let yearlyUtilityBillEstimates = yearlyProductionAcKwh.map(
    (yearlyKwhEnergyProduced, year) => {
        const billEnergyKwh = yearlyKwhEnergyConsumption - yearlyKwhEnergyProduced;
        const billEstimate = (billEnergyKwh * energyCostPerKwh * costIncreaseFactor ** year) / discountRate ** year;
        return Math.max(billEstimate, 0); // bill cannot be negative
    },
    );

    let remainingLifetimeUtilityBill  = yearlyUtilityBillEstimates.reduce((x, y) => x + y, 0);
    let totalCostWithSolar = installationCostTotal + remainingLifetimeUtilityBill - solarIncentives;
    console.log(`Cost with solar: $${totalCostWithSolar.toFixed(2)}`);
    return totalCostWithSolar
}

//gets solar data
router.post("/solar/getData", async (req, res) => {
    const { latitude, longitude, monthlyCost, panelCount, costPerKw } = req.body;
    //url consists of lattitude, longitude, and api key values changing. We just do that.
    const url = 'https://solar.googleapis.com/v1/buildingInsights:findClosest?location.latitude=' + latitude + '&location.longitude=' + longitude + '&requiredQuality=HIGH&key=' + process.env.SOLAR_API_KEY
    try
    {
        const solarData = await axios.get(url)
        //wait for data, then return it
        const dataJson = solarData.data
        const financialAnalysisArray = dataJson.solarPotential.financialAnalyses
        if(panelCount == "")
        {
            //getting panel count closest in monthly cost to what was passed in
            const financialAnalysisIndex = binarySearch(financialAnalysisArray, monthlyCost, "monthlyBill")
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
        else
        {
            if(panelCount < 4)
            {
                return res.json({success: false, error: "Too few solar panels, need at least 4!"})
            }
            //obvious stuff going on here
            const maxPanelCount = dataJson.solarPotential.maxArrayPanelsCount
            if(panelCount > maxPanelCount)
            {
                return res.json({success: false, error: "Too many solar panels, max for your house is " + maxPanelCount + "!"})
            }
            const panelConfigIndex = binarySearch(dataJson.solarPotential.solarPanelConfigs, panelCount, "panelsCount")
            console.log(panelConfigIndex)
            const yearlyEnergyDcKwh = dataJson.solarPotential.solarPanelConfigs[panelConfigIndex].yearlyEnergyDcKwh
            console.log("yearly energy output: " + yearlyEnergyDcKwh)

            const panelPower = dataJson.solarPotential.panelCapacityWatts
            console.log("panel power: " + panelPower)

            //now that we have the index from panel config, we find the index in "financialAnalysis", which is used to get incentive money
            const financialAnalysisIndex = binarySearch(financialAnalysisArray, panelConfigIndex, "panelConfigIndex")
            const totalIncentiveMoney = financialAnalysisArray[financialAnalysisIndex].cashPurchaseSavings.rebateValue.units
            console.log("incentive money: " + totalIncentiveMoney)
            return res.json({success: true, data: dataJson, numPanels: panelCount, 
                totalSolarCost: getSolarCost(Number(panelCount), Number(yearlyEnergyDcKwh), Number(monthlyCost), Number(costPerKw), Number(panelPower), Number(totalIncentiveMoney))})
        }
    }
    catch (error)
    {
        return res.json({success: false, error: error})
    }
})

module.exports = router;