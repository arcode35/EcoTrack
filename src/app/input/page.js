"use client";
import React from "react";
import { useRouter } from 'next/navigation';
import Link from "next/link"; // Use Next.js Link
import {
  Button,
  CssBaseline,
  Box,
  Typography,
  Grid,
  ThemeProvider,
  Divider,
  List,
  ListItem,
  createTheme,
  ListItemIcon,
  ListItemText,
  TextField,
  Fade,
} from "@mui/material";
import BarChartIcon from "@mui/icons-material/BarChart";
import InsightsIcon from "@mui/icons-material/Insights";
import ScheduleIcon from "@mui/icons-material/Schedule";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import BoltIcon from "@mui/icons-material/Bolt";
import SpaIcon from "@mui/icons-material/Spa";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import FadeInOnScroll from "@/components/FadeInOnScroll";
import Checkbox from "@mui/material/Checkbox";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import axios from "axios";
import Sidebar from "@/components/Sidebar";
import { useState, useEffect } from "react";
import { color } from "framer-motion";

const theme = createTheme({
  typography: {
    fontFamily: "Quicksand, sans-serif",
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
        },
      },
    },
  },
});

const PlaceHolder = ({ editButtonCallback, sendUserData }) => {
  return (
    <FadeInOnScroll>
      <Typography
        variant="h2"
        sx={{
          textAlign: "center",
          color: "#55C923",
          fontSize: 50,
        }}
      >
        You have an existing energy profile.
      </Typography>

      <Typography
        variant="h3"
        sx={{
          mt: 10,
          textAlign: "center",
          color: "#55C923",
          pt: 5,
          fontSize: 40,
        }}
      >
        Want to make changes?
      </Typography>

      <Typography
        variant="h3"
        sx={{
          mt: 8,

          textAlign: "center",
          color: "#55c923",
          pt: 4,
          fontSize: 30,
        }}
      >
        Update your energy profile below
      </Typography>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          mt: 0,
        }}
      >
        <Button
          onClick={editButtonCallback}
          variant="contained"
          sx={neonButton}
        >
          Edit
        </Button>

        <Button onClick={sendUserData} variant="contained" sx={neonButton}>
          Get Results!
        </Button>
      </Box>
    </FadeInOnScroll>
  );
};
const inputStyle = {
  backgroundColor: "#111",
  input: {
    color: "#fff",
    fontFamily: "Quicksand, sans-serif",
  },
  "& fieldset": {
    borderColor: "#55C923",
  },
  "&:hover fieldset": {
    borderColor: "#44a91e",
  },
  "&.Mui-focused fieldset": {
    borderColor: "#55C923",
  },
};

const sectionBoxStyle = {
  bgcolor: "#1a1a1a",
  border: "1px solid #55C923",
  boxShadow: "0 0 12px #55C923",
  p: 4,
  borderRadius: 3,
  mb: 6,
  width: "100%",
  maxWidth: "900px",
};

const labelStyle = {
  fontFamily: "Quicksand, sans-serif",
  fontSize: 18,
  color: "#fff",
  lineHeight: 1.6,
};

const sectionTitle = {
  fontFamily: "Quicksand, sans-serif",
  fontWeight: 650,
  fontSize: 28,
  pt: 5,
  color: "#55C923",
};

const neonButton = {
  bgcolor: "#55C923",
  color: "#000",
  fontWeight: "bold",
  fontSize: 24,
  px: 5,
  py: 1.5,
  borderRadius: 2,
  mt: 4,
  "&:hover": {
    bgcolor: "#44a91e",
  },
};

// 4/23 clean and merge with main
// then send to python endpoint to convert the usage inputs into an array
export default function InputsPage() {
  let username = ""
  if(typeof window !== 'undefined')
  {
    username = localStorage.getItem("username"); // this field will never be empty
  }
  const [userHasInputs, setUserHasInputs] = useState(false);
  const router = useRouter();
  const [displayInputForm, setDisplayInputForm] = useState(true); // decides whether to display the input form
  const [coordinatesEntered, setCoordinatesEntered] = useState(false);

  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [solarPanelCount, setPanelCount] = useState(0);

  // initial values if they aren't entered
  const initialValues = {
    selectedHomeTypeInit: 2,
    numFloorsInit: 2,
    squareFootInit: 2430,
    numPeopleOccupyInit: 4,
    numChildrenInit: 2,
    annualIncomeRangeInit: 12,
    heatingEquipmentTypeInit: 3,
    coolingEquipmentTypeInit: 1,
    numCeilingFansInit: 3,
    numFloorFansInit: 0,
    /*SECTION 2*/
    numBedroomsInit: 2,
    numBathroomsInit: 3,
    numOtherRoomsInit: 2,
    numWindowsInit: 8,
    insulationLevelInit: 1,
    numFridgesInit: 1,
    cookingFrequencyInit: 5,
    ovenFrequencyInit: 1,
    numLaundryInit: 1,
    numDishwashInit: 5,
    numTVInit: 1,
    numDevicesInit: 5,
    numHumidifiersInit: 1,
    numPortableAcInit: 1,
    numPortableHeatInit: 1,
    numHotMealsCookedDailyInit: 1,
    ceilingFanUsageInit: 4,
    numLightBulbsOnInit: 67,
    userAgeInit: 18,
    numDaysAtHomeInit: 3,
  };
  // 4/24 set the initial values if not entered by the user
  /*
   * SECTION 1 BASIC INFORMATION
   */
  // the selected home type [TYPE]
  const [selectedHomeType, setSelectedHomeType] = useState("");
  // number of floors
  const [numFloors, setNumFloors] = useState("");
  // total square feet of home
  const [squareFoot, setSquareFoot] = useState("");
  // construction year of home
  const [constructionYear, setConstructionYear] = useState("");
  // number of people living in the house
  const [numPeopleOccupy, setNumPeopleOccupy] = useState("");
  // number of children
  const [numChildren, setNumChildren] = useState("");
  // annual household income range [TYPE]
  const [annualIncomeRange, setAnnualIncomeRange] = useState("");
  // primary heating equipment type [TYPE
  const [heatingEquipmentType, setHeatingEquipmentType] = useState("");
  // cooling equipment [TYPE
  const [coolingEquipmentType, setCoolingEquipmentType] = useState("");
  // num ceiling fans
  const [numCeilingFans, setNumCeilingFans] = useState("");
  // num floor fans
  const [numFloorFans, setNumFloorFans] = useState("");

  /*
   * SECTION 2 ENERGY USAGE & APPLIANCES
   */
  // number of bedrooms
  const [numBedrooms, setNumBedrooms] = useState("");
  // number of bathrooms
  const [numBathrooms, setNumBathrooms] = useState("");
  // number of other rooms
  const [numOtherRooms, setNumOtherRooms] = useState("");
  // number of windows
  const [numWindows, setNumWindows] = useState("");
  // Insulation Level (if known) [TYPE]
  const [insulationLevel, setInsulationLevel] = useState("");
  // number of fridges
  const [numFridges, setNumFridges] = useState("");
  // Cooking frequency per week [TYPE]
  const [cookingFrequency, setCookingFrequency] = useState("");
  // oven usage per week [TYPE]
  const [ovenFrequency, setOvenFrequency] = useState("");
  // laundry (WASHER & DRYER) loads per week
  const [numLaundry, setNumLaundry] = useState("");
  // dishwasher usage [TYPE]
  const [numDishwash, setNumDishwash] = useState("");
  // number of TVs
  const [numTV, setNumTV] = useState("");
  // Number of small electric devices (laptop, tablets, etc)
  const [numDevices, setNumDevices] = useState("");
  // Number of portabl humidifiers
  const [numHumidifiers, setNumHumidifiers] = useState("");
  // number of portable AC
  const [numPortableAc, setNumPortableAc] = useState("");
  // number of portable heaters
  const [numPortableHeat, setNumPortableHeat] = useState("");
  // number of hot meals cooked per day
  const [numHotMealsCookedDaily, setNumHotMealsCookedDaily] = useState("");
  // ceiling fan usage frequency [TYPE]
  const [ceilingFanUsage, setCeilingFanUsage] = useState("");
  // number of light bulbs turned on in the night
  const [numLightBulbsOn, setNumLightBulbsOn] = useState("");
  // respondent age
  const [userAge, setUserAge] = useState("");
  // number of weekdays someone is at home for most of the day
  const [numDaysAtHome, setNumDaysAtHome] = useState("");
  //

  useEffect(() => {
    if (!username) {
      //but just in case
      return;
    }

    // to check if the user is logging in for the first time
    const checkLoggedIn = async () => {
      if (!username) {
        // the user is logging in for the first time
        if(typeof window !== "undefined")
        {
          localStorage.setItem(username, new Date());
        }
        setFirstTimeUser(true); // based on this value display the form content
      }
    };

    // to check whether there is a location field with the associated user
    const checkCoordinates = async () => {
      try {
        const response = await axios.post(
          "http://localhost:5002/users/get_coordinates",
          {
            username: username,
          },
        );

        if (!response.data.success) {
          console.error("User does not have a location field");
        } else {
          // setLatitude & longitude
          const location = response.data.data;

          setLatitude(location.latitude);
          setLongitude(location.longitude);
          setCoordinatesEntered(true);
        }
      } catch (error) {
        console.error(
          "There was an error sending a request to the backend - location",
        );
      }
    };

    // check if the manual inputs of the user has been stored already
    const checkInputs = async () => {
      try {
        const response = await axios.post(
          "http://localhost:5002/users/get_usage",
          {
            username: username,
          },
        );

        if (!response.data.success) {
          console.error("User does not have manual inputs");
          setUserHasInputs(false);
        } else {
          // then user has inputs stored, but check if they are empty
          if (response.data.data) {
            const usage = response.data.data;
            // setting the inputs
            setSelectedHomeType(usage.TYPEHUQ.toString());
            setNumFloors(usage.STORIES.toString());
            setSquareFoot(usage.TOTSQFT_EN.toString());
            setConstructionYear("2024");
            setNumPeopleOccupy(usage.NHSLDMEM.toString());
            setNumChildren(usage.NUMCHILD.toString());
            setAnnualIncomeRange(usage.MONEYPY.toString());
            setHeatingEquipmentType(usage.EQUIPM.toString());
            setCoolingEquipmentType(usage.ACEQUIPM_PUB.toString());
            setNumCeilingFans(usage.NUMCFAN.toString());
            setNumFloorFans(usage.NUMFLOORFAN.toString());
            setNumBedrooms(usage.BEDROOMS.toString());
            setNumBathrooms(usage.NCOMBATH.toString());
            setNumOtherRooms(usage.OTHROOMS.toString());
            setNumWindows(usage.WINDOWS.toString());
            setInsulationLevel(usage.ADQINSUL.toString());
            setNumFridges(usage.NUMFRIG.toString());
            setCookingFrequency(usage.RCOOKUSE.toString());
            setOvenFrequency(usage.ROVENUSE.toString());
            setNumLaundry(usage.WASHLOAD.toString());
            setNumDishwash(usage.DWASHUSE.toString());
            setNumTV("1");
            setNumDevices("5");
            setNumHumidifiers(usage.NUMPORTHUM.toString());
            setNumPortableAc(usage.NUMPORTAC.toString());
            setNumPortableHeat(usage.NUMPORTEL.toString());
            setNumHotMealsCookedDaily(usage.NUMMEAL.toString());
            setCeilingFanUsage(usage.USECFAN.toString());
            setNumLightBulbsOn(usage.LGTIN1TO4.toString());
            setUserAge(usage.HHAGE.toString());
            setNumDaysAtHome(usage.ATHOME.toString());
            setPanelCount(Number(usage.PANELCOUNT));
            console.log("set the data associated with the user from firebase");
            console.log(usage);
            setDisplayInputForm(false); // if the user has inputs stored, then don't display the input form
            setUserHasInputs(true);
          }
        }
      } catch (error) {
        console.error(
          "There was an error sending a request to the backend - manual input",
        );
      }
    };

    checkLoggedIn();
    checkCoordinates();
    checkInputs();
  }, []);

  const redirectFunction = async () => {
    //checks if we're actually not logged in, and we need to go back to the main menu
    if(username === null || username === "")
    {
      router.push("/")
    }
  };
  redirectFunction();

  const handleHousingChange = (event) => {
    setSelectedHomeType(event.target.value);
    console.log("Selected:", event.target.value);
  };

  const handleIncomeChange = (event) => {
    setAnnualIncomeRange(event.target.value);
    console.log("Selected:", annualIncomeRange);
  };

  const handleHeatingChange = (event) => {
    setHeatingEquipmentType(event.target.value);
    console.log("Selected:", heatingEquipmentType);
  };

  const handleCoolingChange = (event) => {
    setCoolingEquipmentType(event.target.value);
    console.log("Selected:", coolingEquipmentType);
  };

  function calcHDD65(maxTemps, minTemps) {
    // maxTemps & minTemps should be the same length
    const base = 65; // fahrenheit
    let HDD65 = 0; // return value

    for (let i = 0; i < maxTemps.length; i++) {
      let average = (maxTemps[i] + minTemps[i]) / 2;
      HDD65 = HDD65 + (base - average <= 0 ? 0 : base - average);
    }

    return HDD65;
  }

  function calcCDD65(maxTemps, minTemps) {
    const base = 65;
    let CDD65 = 0;

    for (let i = 0; i < maxTemps.length; i++) {
      let average = (maxTemps[i] + minTemps[i]) / 2;
      CDD65 = CDD65 + (average - base <= 0 ? 0 : average - base);
    }

    return CDD65;
  }

  async function HDD30YR_PUB(latitude, longitude) {
    let HDD65 = 0; // at the end divide by 29 to get 30 year average HDD30YR

    // returns min & max temperatures for 10,585 days or 29 years
    let url = `https://archive-api.open-meteo.com/v1/archive?latitude=${latitude}&longitude=${longitude}&start_date=1981-04-07&end_date=2010-03-30&daily=weather_code,temperature_2m_max,temperature_2m_min&temperature_unit=fahrenheit`;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        alert("There was an error fetching data for 29 years");
        return -1;
      } else {
        const data = await response.json();
        //console.log(data);
        for (let i = 0; i < 10585; i += 365) {
          HDD65 += calcHDD65(
            data.daily.temperature_2m_max.slice(i, i + 365),
            data.daily.temperature_2m_min.slice(i, i + 365),
          );
        }
      }
    } catch (error) {
      console.error(error);
      alert("There was an error fetching data for 29 years");
      return -1;
    }

    return HDD65 / 29;
  }

  async function CDD30YR_PUB(latitude, longitude) {
    let CDD65 = 0;

    let url = `https://archive-api.open-meteo.com/v1/archive?latitude=${latitude}&longitude=${longitude}&start_date=1981-04-07&end_date=2010-03-30&daily=weather_code,temperature_2m_max,temperature_2m_min&temperature_unit=fahrenheit`;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        alert("An error occurred while fetching the url");
        return -1;
      } else {
        const data = await response.json();

        for (let i = 0; i < 10585; i += 365) {
          CDD65 += calcCDD65(
            data.daily.temperature_2m_max.slice(i, i + 365),
            data.daily.temperature_2m_min.slice(i, i + 365),
          );
        }
      }
    } catch (error) {
      alert("An error occurred while fetching the url");
      return -1;
    }

    return CDD65 / 29;
  }

  const storeCoordinates = async (event) => {
    event.preventDefault();

    if (!(latitude && longitude)) {
      // fields must not be empty
      alert("Latitude and Longitude must be entered!");
      return;
    }

    if (isNaN(latitude) || isNaN(longitude)) {
      alert("Latitude and Longitude must be numbers!");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5002/users/store_coordinates",
        {
          username: username,
          latitude: Number(latitude),
          longitude: Number(longitude),
        },
      );

      if (response.data.success) {
        console.log(response.data.message);
        setCoordinatesEntered(true);
      } else {
        console.error("An error occurred with the request");
      }
    } catch (error) {
      console.error("An error occurred with the request");
    }
  };

  const editInputForms = (event) => {
    // when the edit button is clicked, display the input form again
    event.preventDefault();
    setDisplayInputForm(true);
  };

  const saveResultsToFirebase = async (
    kwUsed,
    monthlyCost,
    numPanels,
    solarCost,
    savedMoney,
  ) => {
    const response = await axios.post(
      "http://localhost:5002/users/update_energy_data",
      {
        username: username,
        energyUsed: kwUsed,
        monthlyCost: monthlyCost,
        panelsUsed: numPanels,
        solarCost: solarCost,
        savedMoney: savedMoney,
      },
    );
    const result = response.data;
    //return if it worked or not
    return result.success;
  };

  //gets the solar data using latittude and longitude
  const getSolarData = async (residentialCostPerKw, monthlyCost) => {
    const response = await axios.post("http://localhost:5002/solar/getData", {
      latitude: latitude,
      longitude: longitude,
      monthlyCost: monthlyCost,
      panelCount: solarPanelCount,
      costPerKw: residentialCostPerKw,
    });
    const data = await response.data;
    //if fail, alert user of it
    if (data.success == false) {
      alert("Failed to get data: " + data.error);
      return { Succeed: false };
    }
    //otherwise FOR NOW, just log the data
    else {
      console.log(data.data);
      console.log("Number of panels: " + data.numPanels);
      console.log(
        "Total solar panel cost over 20 years: " + data.totalSolarCost,
      );
      //obvious as 12 months in a year, and we calculating for 20 years
      const twentyYearCost = Number(monthlyCost) * 12 * 20;
      console.log(
        "Over 20 years, without solar panels it costs " + twentyYearCost,
      );
      const savedMoney = twentyYearCost - data.totalSolarCost;
      console.log(
        "So, you are saving " +
          savedMoney +
          " dollars if you use solar instead with " +
          data.numPanels +
          " panels!",
      );
      return {
        Succeed: true,
        Panels: data.numPanels,
        Total_Cost: data.totalSolarCost,
        Saved_Money: savedMoney,
      };
    }
  };

  const sendUserData = async () => {
    console.log("sending data!");
    let userUsage;

    // get the usage
    try {
      const response = await axios.post(
        "http://localhost:5002/users/get_usage",
        {
          username: username,
        },
      );

      if (response.data.success) {
        const usage = response.data.data;
        userUsage = usage;
      }
    } catch (error) {
      console.error(error);
    }
    let finalArr = [
      userUsage.BA_climate,
      userUsage.IECC_climate_code,
      userUsage.HDD65,
      userUsage.CDD65,
      userUsage.HDD30YR,
      userUsage.CDD30YR,
      userUsage.TYPEHUQ,
      userUsage.STORIES,
      userUsage.BEDROOMS,
      userUsage.NCOMBATH,
      userUsage.OTHROOMS,
      userUsage.TOTROOMS,
      userUsage.WINDOWS,
      userUsage.ADQINSUL,
      userUsage.NUMFRIG,
      userUsage.RCOOKUSE,
      userUsage.ROVENUSE,
      userUsage.NUMMEAL,
      userUsage.DWASHUSE,
      userUsage.WASHLOAD,
      userUsage.DRYRUSE,
      userUsage.EQUIPM,
      userUsage.NUMPORTEL,
      userUsage.NUMPORTHUM,
      userUsage.ACEQUIPM_PUB,
      userUsage.NUMPORTAC,
      userUsage.NUMCFAN,
      userUsage.NUMFLOORFAN,
      userUsage.USECFAN,
      userUsage.LGTIN1TO4,
      userUsage.LGTIN4TO8,
      userUsage.LGTINMORE8,
      userUsage.HHAGE,
      userUsage.NHSLDMEM,
      userUsage.NUMCHILD,
      userUsage.ATHOME,
      userUsage.MONEYPY,
      userUsage.SQFTRANGE,
      userUsage.TOTSQFT_EN,
      userUsage.TOTHSQFT,
      userUsage.TOTCSQFT,
    ]
    console.log([
      "Ba climate: " + userUsage.BA_climate,
      "Climate code: " + userUsage.IECC_climate_code,
      "HDD65: " + userUsage.HDD65,
      "CDD65: " + userUsage.CDD65,
      "HEE30YR: " + userUsage.HDD30YR,
      "CDD30YR: " + userUsage.CDD30YR,
      "TYPEHUQ: " + userUsage.TYPEHUQ,
      "STOREIS: " + userUsage.STORIES,
      "BEDROOMS: " + userUsage.BEDROOMS,
      "NCOMBATH: " + userUsage.NCOMBATH,
      "OTHROOMS: " + userUsage.OTHROOMS,
      "TOTROOMS: " + userUsage.TOTROOMS,
      "WINDOWS: " + userUsage.WINDOWS,
      "ADQINSUL: " + userUsage.ADQINSUL,
      "NUMFRIG: " + userUsage.NUMFRIG,
      "RCOOKUSE: " + userUsage.RCOOKUSE,
      "ROVENUSE: " + userUsage.ROVENUSE,
      "NUMMEAL: " + userUsage.NUMMEAL,
      "DWASHUSE: " + userUsage.DWASHUSE,
      "WASHLOAD: " + userUsage.WASHLOAD,
      "DRYRUSE: " + userUsage.DRYRUSE,
      "EQUIPM: " + userUsage.EQUIPM,
      "NUMPORTEL: " + userUsage.NUMPORTEL,
      "NUMPORTHUM: " + userUsage.NUMPORTHUM,
      "ACEQUIPM_PUB: " + userUsage.ACEQUIPM_PUB,
      "NUMPORTAC: " + userUsage.NUMPORTAC,
      "NUMCFAN: " + userUsage.NUMCFAN,
      "NUMFLOORFAN: " + userUsage.NUMFLOORFAN,
      "USECFAN: " + userUsage.USECFAN,
      "LGTIN1TO4: " + userUsage.LGTIN1TO4,
      "LGTIN4TO8: " + userUsage.LGTIN4TO8,
      "LGTINMORE8: " + userUsage.LGTINMORE8,
      "HHAGE: " + userUsage.HHAGE,
      "NHSLDMEM: " + userUsage.NHSLDMEM,
      "NUMCHILD: " + userUsage.NUMCHILD,
      "ATHOME: " + userUsage.ATHOME,
      "MONEYPY: " + userUsage.MONEYPY,
      "SQFTRANGE: " + userUsage.SQFTRANGE,
      "TOTSQFT_EN: " + userUsage.TOTSQFT_EN,
      "TOTHSQFT: " + userUsage.TOTHSQFT,
      "TOTCSQFT: " + userUsage.TOTCSQFT,
    ]);

    if (latitude === "" || longitude === "") {
      alert("Put in latitude and longitude of your location first!");
      return;
    }
    const response = await axios.post(
      "http://localhost:5002/utilRates/getData",
      {
        latitude: latitude,
        longitude: longitude,
      },
    );
    const data = await response.data;
    //if fail, alert user of it
    if (data.success == false) {
      console.log(data.error);
      alert("Failed to get data: " + data.error.message);
    }
    //otherwise FOR NOW, just log the data
    else {
      //get the cost accordingly from the json output
      const residentialCostPerKw = data.data.outputs.residential;
      console.log("Cost per kilowatt: " + residentialCostPerKw);
      console.log(
        "ok bruh so the two 0 vals are actually: " +
          userUsage.HDD30YR +
          " and " +
          userUsage.CDD30YR,
      );
      const response = await axios.post(
        "http://localhost:5001/python/getPredictedUsage",
        {
          input: [ finalArr ],
        }
      );
      const result = await response.data;
      //Technically kilowatts used is for year, we are getting it for month now
      const kwUsed = result.KwUsed / 12;
      const monthlyCost = residentialCostPerKw * kwUsed;

      console.log("Energy used: " + kwUsed);
      console.log("Total cost is " + monthlyCost);

      const solarResults = await getSolarData(
        residentialCostPerKw,
        monthlyCost,
      );
      if (solarResults.Succeed == false) {
        alert("Solar API Call failed!");
        return;
      }

      //now putting the data we got into variables
      const numPanels = solarResults.Panels;
      const solarCost = solarResults.Total_Cost;
      const savedMoney = solarResults.Saved_Money;
      console.log("saved money is: " + savedMoney);

      const saveDataStatus = await saveResultsToFirebase(
        kwUsed,
        monthlyCost,
        numPanels,
        solarCost,
        savedMoney,
      );
      if (!saveDataStatus) {
        alert(saveDataStatus.message);
      }

      //finally, now go to the results page
      router.push("/results")
    }
  };
  const [hasResultsData, setHasResultsData] = useState(false);
  const checkIfFirebaseData = async() => {
    const response = await axios.post("http://localhost:5002/users/check_if_results", {
      username: username
    })
    const data = response.data
    //if fail, assume for now that the error was just because snapshot fialed, and so user doesn't have resutls yet and has to bgo back to the main page
    setHasResultsData(data.success);
  };

  checkIfFirebaseData();

  const handleFormsSubmit = async (event) => {
    event.preventDefault();

    // if the submit button was clicked then don't display the form
    setDisplayInputForm(false);

    let userLatitude;
    let userLongitude;

    let CDD65;
    let HDD65;

    try {
      const response = await axios.post(
        "http://localhost:5002/users/get_coordinates",
        {
          username: username,
        },
      );

      console.log(response);
      if (!response.data.success) {
        console.error(response.data.message);
      } else {
        userLatitude = response.data.data.latitude;
        userLongitude = response.data.data.longitude;
      }
    } catch (error) {
      console.error("An error occurred with the request");
    }

    console.log("we do this too");
    const HDD30YR = await HDD30YR_PUB(userLatitude, userLongitude);
    const CDD30YR = await CDD30YR_PUB(userLatitude, userLongitude);
    // fetch the min and max arrays for CDD65 and HDD65, using the past year as the time range
    const date = new Date();

    const year = date.getFullYear(); // 2025
    const month = date.getMonth(); // if single digit then add leading 0
    const day = date.getDate(); // if single digit then add leading 0

    const startDate = `${year - 1}-${
      String(month).length === 1 ? "0" + String(month + 1) : month
    }-${String(day).length === 1 ? "0" + String(day) : day}`;

    const endDate = `${year}-${
      String(month).length === 1 ? "0" + String(month + 1) : month
    }-${String(day).length === 1 ? "0" + String(day) : day}`;

    let url = `https://archive-api.open-meteo.com/v1/archive?latitude=${latitude}&longitude=${longitude}&start_date=${startDate}&end_date=${endDate}&daily=weather_code,temperature_2m_max,temperature_2m_min&temperature_unit=fahrenheit`;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        console.error(
          "There was an error fetching weather data for the past year - else block",
        );
      } else {
        const data = await response.json();

        CDD65 = calcCDD65(
          data.daily.temperature_2m_max,
          data.daily.temperature_2m_min,
        );
        HDD65 = calcHDD65(
          data.daily.temperature_2m_max,
          data.daily.temperature_2m_min,
        );
      }
    } catch (error) {
      console.error(
        "There was an error fetching weather data for the past year - catch block",
      );
    }

    //so apparently SQFTRANGE correspond TO A CODE. BRUH.
    /* 
      1 Less than 600 square feet
      2 600 to 799 square feet
      3 800 to 999 square feet
      4 1,000 to 1,499 square feet
      5 1,500 to 1,999 square feet
      6 2,000 to 2,499 square feet
      7 2,500 to 2,999 square feet
      8 3,000 square feet or more"
    */
    let sqftrange_var = 0
    if(squareFoot < 600)
    {
      sqftrange_var = 1
    }
    else if(squareFoot < 800)
    {
      sqftrange_var = 2
    }
    else if(squareFoot < 1000)
    {
      sqftrange_var = 3
    }
    else if(squareFoot < 1500)
    {
      sqftrange_var = 4
    }
    else if(squareFoot < 2000)
    {
      sqftrange_var = 5
    }
    else if(squareFoot < 2500)
    {
      sqftrange_var = 6
    }
    else if(squareFoot < 3000)
    {
      sqftrange_var = 7
    }
    else
    {
      sqftrange_var = 8
    }
    

    let customerInputs = {
      BA_climate: 4,
      IECC_climate_code: 7,
      HDD65: HDD65,
      CDD65: CDD65,
      HDD30YR: HDD30YR,
      CDD30YR: CDD30YR,
      TYPEHUQ:
        selectedHomeType === ""
          ? initialValues.selectedHomeTypeInit
          : Number(selectedHomeType),
      STORIES:
        numFloors === "" ? initialValues.numFloorsInit : Number(numFloors),
      BEDROOMS:
        numBedrooms === ""
          ? initialValues.numBedroomsInit
          : Number(numBedrooms),
      NCOMBATH:
        numBathrooms === ""
          ? initialValues.numBathroomsInit
          : Number(numBathrooms),
      OTHROOMS:
        numOtherRooms === ""
          ? initialValues.numOtherRoomsInit
          : Number(numOtherRooms),
      TOTROOMS:
        !numBedrooms && !numOtherRooms
          ? 5
          : Number(numBedrooms || initialValues.numBedroomsInit) +
            Number(numOtherRooms || initialValues.numBathroomsInit),
      WINDOWS:
        numWindows === "" ? initialValues.numWindowsInit : Number(numWindows),
      ADQINSUL:
        insulationLevel === ""
          ? initialValues.insulationLevelInit
          : Number(insulationLevel),
      NUMFRIG:
        numFridges === "" ? initialValues.numFridgesInit : Number(numFridges),
      RCOOKUSE:
        cookingFrequency === ""
          ? initialValues.cookingFrequencyInit
          : Number(cookingFrequency),
      ROVENUSE:
        ovenFrequency === ""
          ? initialValues.ovenFrequencyInit
          : Number(ovenFrequency),
      NUMMEAL:
        numHotMealsCookedDaily === ""
          ? initialValues.numHotMealsCookedDailyInit
          : Number(numHotMealsCookedDaily), // implement
      DWASHUSE:
        numDishwash === ""
          ? initialValues.numDishwashInit
          : Number(numDishwash),
      WASHLOAD:
        numLaundry === "" ? initialValues.numLaundryInit : Number(numLaundry),
      DRYRUSE:
        numLaundry === "" ? initialValues.numLaundryInit : Number(numLaundry),
      EQUIPM:
        heatingEquipmentType === ""
          ? initialValues.heatingEquipmentTypeInit
          : Number(heatingEquipmentType),
      NUMPORTEL:
        numPortableHeat === ""
          ? initialValues.numPortableHeatInit
          : Number(numPortableHeat), // implement
      NUMPORTHUM:
        numHumidifiers === ""
          ? initialValues.numHumidifiersInit
          : Number(numHumidifiers),
      ACEQUIPM_PUB:
        coolingEquipmentType === ""
          ? initialValues.coolingEquipmentTypeInit
          : Number(coolingEquipmentType),
      NUMPORTAC:
        numPortableAc === ""
          ? initialValues.numPortableAcInit
          : Number(numPortableAc),
      NUMCFAN:
        numCeilingFans === ""
          ? initialValues.numCeilingFansInit
          : Number(numCeilingFans),
      NUMFLOORFAN:
        numFloorFans === ""
          ? initialValues.numFloorFansInit
          : Number(numFloorFans),
      USECFAN:
        ceilingFanUsage === ""
          ? initialValues.ceilingFanUsageInit
          : Number(ceilingFanUsage), // implement
      LGTIN1TO4:
        numLightBulbsOn === ""
          ? initialValues.numLightBulbsOnInit
          : Number(numLightBulbsOn), // implement
      LGTIN4TO8:
        numLightBulbsOn === ""
          ? initialValues.numLightBulbsOnInit
          : Number(numLightBulbsOn), // implement
      LGTINMORE8:
        numLightBulbsOn === ""
          ? initialValues.numLightBulbsOnInit
          : Number(numLightBulbsOn), // implement
      HHAGE: userAge === "" ? initialValues.userAgeInit : Number(userAge), // implement
      NHSLDMEM:
        numPeopleOccupy === ""
          ? initialValues.numPeopleOccupyInit
          : Number(numPeopleOccupy),
      NUMCHILD:
        numChildren === ""
          ? initialValues.numChildrenInit
          : Number(numChildren),
      ATHOME:
        numDaysAtHome === ""
          ? initialValues.numDaysAtHomeInit
          : Number(numDaysAtHome), // implement
      MONEYPY:
        annualIncomeRange === ""
          ? initialValues.annualIncomeRangeInit
          : Number(annualIncomeRange),
      SQFTRANGE:
        squareFoot === "" ? initialValues.squareFootInit : Number(sqftrange_var),
      TOTSQFT_EN:
        squareFoot === "" ? initialValues.squareFootInit : Number(squareFoot),
      TOTHSQFT:
        (squareFoot === ""
          ? initialValues.squareFootInit
          : Number(squareFoot)) * 0.8,
      TOTCSQFT:
        (squareFoot === ""
          ? initialValues.squareFootInit
          : Number(squareFoot)) * 0.8,
      PANELCOUNT: Number(solarPanelCount),
    };

    // now store it in firebase

    try {
      const response = await axios.post(
        "http://localhost:5002/users/user_usage",
        {
          username: username,
          energyUsage: customerInputs,
        },
      );

      if (!response.data.success) {
        console.error(response.data.message);
      } else {
        console.log("Stored usage.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (!displayInputForm) {
    // display PlaceHolder
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          sx={{
            display: "flex",
            minHeight: "100vh",
            backgroundColor: "#000",
            color: "#fff",
            fontFamily: "Quicksand, sans-serif",
          }}
        >
          {/*SideBar */}
          <Sidebar
            currentTab={"Input New Data"}
            hasResultsData={hasResultsData}
          />
          {/*Main Content*/}
          <FadeInOnScroll>
            <Box
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",

                p: 14,
                gap: "8px",
              }}
            >
              <PlaceHolder
                editButtonCallback={editInputForms}
                sendUserData={sendUserData}
              />
            </Box>
          </FadeInOnScroll>
        </Box>
      </ThemeProvider>
    );
  }
  const inputStyle = {
    backgroundColor: "#111",
    input: {
      color: "#fff",
      fontFamily: "Quicksand, sans-serif",
    },
    "& fieldset": {
      borderColor: "#55C923",
    },
    "&:hover fieldset": {
      borderColor: "#44a91e",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#55C923",
    },
  };

  const sectionBoxStyle = {
    bgcolor: "#1a1a1a",
    border: "1px solid #55C923",
    boxShadow: "0 0 12px #55C923",
    p: 4,
    borderRadius: 3,
    mb: 6,
    width: "100%",
    maxWidth: "900px",
    ml: 4,
  };

  const labelStyle = {
    fontFamily: "Quicksand, sans-serif",
    fontSize: 18,
    color: "#fff",
    lineHeight: 1.6,
  };

  const sectionTitle = {
    fontFamily: "Quicksand, sans-serif",
    fontWeight: 650,
    fontSize: 28,
    pt: 5,
    color: "#55C923",
  };

  const neonButton = {
    bgcolor: "#55C923",
    color: "#000",
    fontWeight: "bold",
    fontSize: 20,
    px: 5,
    py: 1.5,
    borderRadius: 2,
    mt: 4,
    "&:hover": {
      bgcolor: "#44a91e",
    },
  };

  // Example usage in a section:

  <Button sx={neonButton} onClick={handleFormsSubmit}>
    Submit
  </Button>;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          minHeight: "100vh",
          backgroundColor: "#000",
          color: "#fff",
        }}
      >
        <Sidebar
          currentTab={"Energy Profile"}
          hasResultsData={hasResultsData}
        />
        <FadeInOnScroll>
          <Typography
            variant="h2"
            sx={{ ...sectionTitle, fontSize: 50, textAlign: "center" }}
          >
            Energy Profile
          </Typography>

          <FadeInOnScroll>
            <Box sx={{ ...sectionBoxStyle, mt: 6 }}>
              <Typography sx={{ ...sectionTitle, mt: -4 }}>
                Coordinates
              </Typography>
              <Box
                sx={{
                  mt: 3,
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  mb: 2,
                }}
              >
                <TextField
                  label="Latitude"
                  InputLabelProps={{
                    style: {
                      color: "#55C923",
                      fontFamily: "Quicksand, sans-serif",
                    },
                  }}
                  size="medium"
                  placeholder="00.0000"
                  sx={inputStyle}
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                />
                <TextField
                  label="Longitude"
                  InputLabelProps={{
                    style: {
                      color: "#55C923",
                      fontFamily: "Quicksand, sans-serif",
                    },
                  }}
                  size="medium"
                  placeholder="00.0000"
                  sx={inputStyle}
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                />
                <Button
                  onClick={storeCoordinates}
                  sx={{ ...neonButton, mt: 6 }}
                >
                  Save
                </Button>
              </Box>
            </Box>
            <Divider sx={{ mb: 4, my: 8, backgroundColor: "#555" }} />

            <Box sx={{ ...sectionBoxStyle, mt: -4 }}>
              <Typography
                variant="h2"
                sx={{ ...sectionTitle, fontSize: 35, mt: -4 }}
              >
                Section 1: Basic Information
              </Typography>

              {[
                {
                  label: "Enter number of floors",
                  value: numFloors,
                  setter: setNumFloors,
                  placeholder: "e.g. 2",
                },
                {
                  label: "Enter square footage",
                  value: squareFoot,
                  setter: setSquareFoot,
                  placeholder: "e.g. 2000",
                },
                {
                  label: "Number of people in house",
                  value: numPeopleOccupy,
                  setter: setNumPeopleOccupy,
                  placeholder: "e.g. 4",
                },
                {
                  label: "Number of children",
                  value: numChildren,
                  setter: setNumChildren,
                  placeholder: "e.g. 1",
                },
                {
                  label: "Number of ceiling fans",
                  value: numCeilingFans,
                  setter: setNumCeilingFans,
                  placeholder: "e.g. 3",
                },
                {
                  label: "Number of floor fans",
                  value: numFloorFans,
                  setter: setNumFloorFans,
                  placeholder: "e.g. 2",
                },
              ].map((field, i) => (
                <Box
                  key={i}
                  sx={{ display: "flex", alignItems: "center", gap: 2, mt: 3 }}
                >
                  <Typography sx={labelStyle}>{field.label}</Typography>
                  <TextField
                    size="small"
                    placeholder={field.placeholder}
                    sx={inputStyle}
                    value={field.value}
                    onChange={(e) => field.setter(e.target.value)}
                  />
                </Box>
              ))}
            </Box>
            <Divider sx={{ my: 9, backgroundColor: "#555" }} />

            {/*Section 2 Questions */}

            <Box sx={{ ...sectionBoxStyle, mt: -4 }}>
              <Typography
                variant="h2"
                sx={{ ...sectionTitle, fontSize: 35, mt: -4 }}
              >
                Section 2: Energy Usage & Appliances
              </Typography>

              {[
                {
                  label: "Number of Bedrooms",
                  value: numBedrooms,
                  setter: setNumBedrooms,
                  placeholder: "e.g. 3",
                },
                {
                  label: "Number of Bathrooms",
                  value: numBathrooms,
                  setter: setNumBathrooms,
                  placeholder: "e.g. 2",
                },
                {
                  label: "Number of Other Rooms",
                  value: numOtherRooms,
                  setter: setNumOtherRooms,
                  placeholder: "e.g. 4",
                },
                {
                  label: "Number of Windows",
                  value: numWindows,
                  setter: setNumWindows,
                  placeholder: "e.g. 10",
                },
                {
                  label: "Number of Refrigerators",
                  value: numFridges,
                  setter: setNumFridges,
                  placeholder: "e.g. 1",
                },
                {
                  label: "Number of Hot Meals Cooked Daily",
                  value: numHotMealsCookedDaily,
                  setter: setNumHotMealsCookedDaily,
                  placeholder: "e.g. 2",
                },
                {
                  label: "Number of Laundry Loads per Week",
                  value: numLaundry,
                  setter: setNumLaundry,
                  placeholder: "e.g. 5",
                },
                {
                  label: "Number of TVs",
                  value: numTV,
                  setter: setNumTV,
                  placeholder: "e.g. 2",
                },
                {
                  label: "Number of Portable Devices",
                  value: numDevices,
                  setter: setNumDevices,
                  placeholder: "e.g. 4",
                },
                {
                  label: "Number of Humidifiers",
                  value: numHumidifiers,
                  setter: setNumHumidifiers,
                  placeholder: "e.g. 1",
                },
                {
                  label: "Number of Portable ACs",
                  value: numPortableAc,
                  setter: setNumPortableAc,
                  placeholder: "e.g. 1",
                },
                {
                  label: "Number of Portable Heaters",
                  value: numPortableHeat,
                  setter: setNumPortableHeat,
                  placeholder: "e.g. 1",
                },
                {
                  label: "Number of Light Bulbs Used",
                  value: numLightBulbsOn,
                  setter: setNumLightBulbsOn,
                  placeholder: "e.g. 12",
                },
                {
                  label: "Number of Days Spent at Home",
                  value: numDaysAtHome,
                  setter: setNumDaysAtHome,
                  placeholder: "e.g. 4",
                },
                {
                  label: "Enter your Age",
                  value: userAge,
                  setter: setUserAge,
                  placeholder: "e.g. 25",
                },
                {
                  label: "Ideal Solar Panel Count",
                  value: solarPanelCount,
                  setter: setPanelCount,
                  placeholder: "Leave blank for optimal",
                },
              ].map((field, i) => (
                <Box
                  key={i}
                  sx={{ display: "flex", alignItems: "center", gap: 2, mt: 3 }}
                >
                  <Typography sx={labelStyle}>{field.label}</Typography>
                  <TextField
                    size="small"
                    placeholder={field.placeholder}
                    sx={inputStyle}
                    value={field.value}
                    onChange={(e) => field.setter(e.target.value)}
                  />
                </Box>
              ))}

              <Button onClick={handleFormsSubmit} sx={{ ...neonButton, mt: 6 }}>
                Save
              </Button>

              <Typography
                variant="h1"
                sx={{
                  fontFamily: "Quicksand, sans-serif",
                  fontSize: 18,
                  color: "red",
                  lineHeight: 1.6,
                  pt: "20px",
                }}
              >
                {!coordinatesEntered
                  ? "Before you submit, please enter your coordinates"
                  : ""}
              </Typography>
            </Box>
          </FadeInOnScroll>
        </FadeInOnScroll>
      </Box>
    </ThemeProvider>
  );
}
