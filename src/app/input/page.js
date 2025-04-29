"use client";
import React from "react";
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
import { useState, useEffect } from "react";

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
          fontFamily: "Quicksand, sans-serif",
          textAlign: "center",
          color: "#55C923",
          fontSize: 50,
        }}
      >
        We have collected information about your usage
      </Typography>

      <Typography
        variant="h3"
        sx={{
          fontFamily: "Quicksand, sans-serif",
          textAlign: "center",
          color: "#55C923",
          pt: 5,
          fontSize: 40,
        }}
      >
        If you would like to change your answers
      </Typography>
      <Typography
        variant="h3"
        sx={{
          fontFamily: "Quicksand, sans-serif",
          textAlign: "center",
          color: "#55c923",
          pt: 4,
          fontSize: 30,
        }}
      >
        please enter your new answer under the desired question
      </Typography>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          mt: 15,
        }}
      >
        <Button
          onClick={editButtonCallback}
          variant="contained"
          sx={{
            mt: 2,
            width: 150,
            height: 38,
            borderRadius: "15px",
            fontSize: 20,
            textTransform: "none",
            background: "linear-gradient(90deg, #3DC787 0%, #55C923 100%)",
            boxShadow: "0 4px 20px rgba(85, 201, 35, 0.3)",
            "&:hover": {
              background: "linear-gradient(90deg, #55C923 0%, #3DC787 100%)",
            },
          }}
        >
          Edit
        </Button>

        <Button
          onClick={sendUserData}
          variant="contained"
          sx={{
            mt: 2,
            width: 150,
            height: 38,
            borderRadius: "15px",
            fontSize: 20,
            textTransform: "none",
            background: "linear-gradient(90deg, #3DC787 0%, #55C923 100%)",
            boxShadow: "0 4px 20px rgba(85, 201, 35, 0.3)",
            "&:hover": {
              background: "linear-gradient(90deg, #55C923 0%, #3DC787 100%)",
            },
          }}
        >
          Get Results!
        </Button>
      </Box>
    </FadeInOnScroll>
  );
};

const SideBar = () => {
  const logOutUser = async () => {
    localStorage.setItem("username", "");
    redirectFunction();
  };

  const redirectFunction = async () => {
    //checks if we're actually not logged in, and we need to go back to the main menu
    if (
      localStorage.getItem("username") === null ||
      localStorage.getItem("username") === ""
    ) {
      window.location.href = "/";
    }
  };
  return (
    <Box
      sx={{
        width: 240,
        backgroundColor: "#111",
        padding: 3,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
        borderRight: "1px solid #222",
      }}
    >
      <Button
        onClick={logOutUser}
        variant="contained"
        sx={{
          textTransform: "none",
          background: "linear-gradient(90deg, #3DC787 0%, #55C923 100%)",
          boxShadow: "0 4px 20px rgba(85, 201, 35, 0.3)",
          "&:hover": {
            background: "linear-gradient(90deg, #55C923 0%, #3DC787 100%)",
          },
        }}
      >
        LOGOUT
      </Button>
      <Link href="/main" passHref>
        <img src="EcoTrack.svg" alt="EcoTrack Logo" width="140px" />
      </Link>

      <Typography
        sx={{
          fontFamily: "Quicksand, sans-serif",
          fontSize: 18,
          color: "#ccc",
          lineHeight: 1.6,
        }}
      >
        {localStorage.getItem("username")}
      </Typography>
      <p></p>
      <Divider sx={{ width: "100%", borderColor: "#333", my: 2 }} />
      <List sx={{ width: "100%" }}>
        <ListItem button>
          <ListItemIcon sx={{ color: "#55c923" }}>
            <LightbulbIcon />
          </ListItemIcon>
          <ListItemText
            primary="Assess your usage"
            primaryTypographyProps={{ fontWeight: 600 }}
          />
        </ListItem>
        <ListItem button>
          <ListItemIcon sx={{ color: "#55C923" }}>
            <BarChartIcon />
          </ListItemIcon>
          <ListItemText
            primary="Live Monitoring"
            primaryTypographyProps={{ fontWeight: 600 }}
          />
        </ListItem>
        <ListItem button>
          <ListItemIcon sx={{ color: "#55C923" }}>
            <InsightsIcon />
          </ListItemIcon>
          <ListItemText
            primary="Reports"
            primaryTypographyProps={{ fontWeight: 600 }}
          />
        </ListItem>
        <ListItem button>
          <ListItemIcon sx={{ color: "#55C923" }}>
            <MonetizationOnIcon />
          </ListItemIcon>
          <ListItemText
            primary="Cost Estimates"
            primaryTypographyProps={{ fontWeight: 600 }}
          />
        </ListItem>
        <ListItem button>
          <ListItemIcon sx={{ color: "#55C923" }}>
            <BoltIcon />
          </ListItemIcon>
          <ListItemText
            primary="Usage Tips"
            primaryTypographyProps={{ fontWeight: 600 }}
          />
        </ListItem>
        <ListItem button>
          <ListItemIcon sx={{ color: "#55C923" }}>
            <ScheduleIcon />
          </ListItemIcon>
          <ListItemText
            primary="Schedule"
            primaryTypographyProps={{ fontWeight: 600 }}
          />
        </ListItem>
        <ListItem button>
          <ListItemIcon sx={{ color: "#55C923" }}>
            <SpaIcon />
          </ListItemIcon>
          <ListItemText
            primary="Green Savings"
            primaryTypographyProps={{ fontWeight: 600 }}
          />
        </ListItem>
      </List>
    </Box>
  );
};

// 4/23 clean and merge with main
// then send to python endpoint to convert the usage inputs into an array
export default function InputsPage() {
  const [userHasInputs, setUserHasInputs] = useState(false);

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
    const username = localStorage.getItem("username"); // this field will never be empty

    if (!username) {
      //but just in case
      return;
    }

    // to check if the user is logging in for the first time
    const checkLoggedIn = async () => {
      if (!localStorage.getItem(username)) {
        // the user is logging in for the first time
        localStorage.setItem(username, new Date());
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
          }
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
          "There was an error sending a request to the backend - location"
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
          }
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
            setSquareFoot(usage.SQFTRANGE.toString());
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
            console.log("set the data associated with the user from firebase");
            console.log(usage);
            setDisplayInputForm(false); // if the user has inputs stored, then don't display the input form
            setUserHasInputs(true);
          }
        }
      } catch (error) {
        console.error(
          "There was an error sending a request to the backend - manual input"
        );
      }
    };

    checkLoggedIn();
    checkCoordinates();
    checkInputs();
  }, []);

  //to log out the user when they press the according button
  const logOutUser = async () => {
    localStorage.setItem("username", "");
    redirectFunction();
  };

  const redirectFunction = async () => {
    //checks if we're actually not logged in, and we need to go back to the main menu
    if (
      localStorage.getItem("username") === null ||
      localStorage.getItem("username") === ""
    ) {
      window.location.href = "/";
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
            data.daily.temperature_2m_min.slice(i, i + 365)
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
            data.daily.temperature_2m_min.slice(i, i + 365)
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

    const username = localStorage.getItem("username");

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
        }
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

  const saveResultsToFirebase = async(kwUsed, monthlyCost, numPanels, solarCost, savedMoney) => {
    
    const response = await axios.post("http://localhost:5002/users/update_energy_data", {
      username: localStorage.getItem("username"),
      energyUsed: kwUsed,
      monthlyCost: monthlyCost,
      panelsUsed: numPanels,
      solarCost: solarCost,
      savedMoney: savedMoney,
    });
    const result = response.data;
    //return if it worked or not
    return result.success;
  };
  
  //gets the solar data using latittude and longitude
  const getSolarData = async(residentialCostPerKw, monthlyCost) => 
  {
    const response = await axios.post("http://localhost:5002/solar/getData", {
        latitude: latitude,
        longitude: longitude,
        monthlyCost: monthlyCost,
        panelCount: solarPanelCount,
        costPerKw: residentialCostPerKw
    })
    const data = await response.data
    //if fail, alert user of it
    if(data.success == false)
    {
        alert("Failed to get data: " + data.error)
        return {"Succeed": false};
    }
    //otherwise FOR NOW, just log the data
    else
    {
        console.log(data.data)
        console.log("Number of panels: " + data.numPanels)
        console.log("Total solar panel cost over 20 years: " + data.totalSolarCost)
        //obvious as 12 months in a year, and we calculating for 20 years
        const twentyYearCost = Number(monthlyCost) * 12 * 20
        console.log("Over 20 years, without solar panels it costs " + twentyYearCost)
        const savedMoney = twentyYearCost - data.totalSolarCost
        console.log("So, you are saving " + savedMoney + " dollars if you use solar instead with " + data.numPanels + " panels!")
        return {"Succeed": true, "Panels": data.numPanels, "Total_Cost": data.totalSolarCost, "Saved_Money": savedMoney}
    }
  }

  const sendUserData = async() => {
    console.log("sending data!")
    if(latitude === "" || longitude === "")
    {
      alert("Put in latitude and longitude of your location first!")
      return;
    }
    const response = await axios.post("http://localhost:5002/utilRates/getData", {
      latitude: latitude,
      longitude: longitude,
    });
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
      const response = await axios.post(
        "http://localhost:5001/python/getPredictedUsage",
        {
          input: [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          ],
        }
      );
      const result = await response.data;
      const kwUsed = result.KwUsed;
      const monthlyCost = residentialCostPerKw * result.KwUsed;

      console.log("Energy used: " + monthlyCost);
      console.log("Total cost is " + monthlyCost);

      const solarResults = await getSolarData(
        residentialCostPerKw,
        monthlyCost
      );
      if (solarResults.Succeed == false) {
        alert("Solar API Call failed!");
        return;
      }

      //now putting the data we got into variables
      const numPanels = solarResults.Panels;
      const solarCost = solarResults.Total_Cost;
      const savedMoney = solarResults.Saved_Money;
      console.log("saved money is: " + savedMoney)

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
      window.location.href = "/results";
    }
  }

  const handleFormsSubmit = async (event) => {
    event.preventDefault();

    // if the submit button was clicked then don't display the form
    setDisplayInputForm(false);

    const username = localStorage.getItem("username");
    let userLatitude;
    let userLongitude;

    let CDD65;
    let HDD65;

    try {
      const response = await axios.post(
        "http://localhost:5002/users/get_coordinates",
        {
          username: username,
        }
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
          "There was an error fetching weather data for the past year - else block"
        );
      } else {
        const data = await response.json();

        CDD65 = calcCDD65(
          data.daily.temperature_2m_max,
          data.daily.temperature_2m_min
        );
        HDD65 = calcHDD65(
          data.daily.temperature_2m_max,
          data.daily.temperature_2m_min
        );
      }
    } catch (error) {
      console.error(
        "There was an error fetching weather data for the past year - catch block"
      );
    }

    let customerInputs = {
      BA_climate: "Hot-Humid",
      IECC_climate_code: "4A",
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
        squareFoot === "" ? initialValues.squareFootInit : Number(squareFoot),
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
      PANELCOUNT:
        Number(solarPanelCount),
    };

    // now store it in firebase

    try {
      const response = await axios.post(
        "http://localhost:5002/users/user_usage",
        {
          username: username,
          energyUsage: customerInputs,
        }
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
          <SideBar />
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
                <PlaceHolder editButtonCallback={editInputForms} sendUserData ={sendUserData} />
            </Box>
          </FadeInOnScroll>
        </Box>
      </ThemeProvider>
    );
  }

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
        {/* Sidebar */}
        <SideBar />
        {/*main content*/}
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
            <Typography
              variant="h2"
              sx={{
                fontFamily: "Quicksand, sans-serif",
                textAlign: "center",
                color: "#55C923",
                fontSize: 50,
              }}
            >
              In order to assess your usage,
            </Typography>

            <FadeInOnScroll>
              <Typography
                variant="h3"
                sx={{
                  fontFamily: "Quicksand, sans-serif",
                  textAlign: "center",
                  color: "#55C923",
                  pt: 5,
                  fontSize: 40,
                }}
              >
                We would like to collect some information from you
              </Typography>
              <Typography
                variant="h3"
                sx={{
                  fontFamily: "Quicksand, sans-serif",
                  textAlign: "center",
                  color: "#55c923",
                  pt: 4,
                  fontSize: 30,
                }}
              >
                If you don't know the answer to any of these fields, leave them
                blank
              </Typography>

              <Typography
                variant="h3"
                sx={{
                  fontFamily: "Quicksand, sans-serif",
                  textAlign: "center",
                  color: "#55c923",
                  pt: 4,
                  fontSize: 30,
                }}
              >
                Before we start, please enter your coordinates
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    pt: "35px",
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: "Quicksand, sans-serif",
                      fontSize: 18,
                      color: "#fff",
                      lineHeight: 1.6,
                    }}
                  >
                    Enter latitude
                  </Typography>
                  <TextField
                    sx={{ backgroundColor: "white" }}
                    size="small"
                    placeholder="00.0000"
                    onChange={(e) => {
                      setLatitude(e.target.value);
                    }}
                    value={latitude}
                  ></TextField>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    pt: "25px",
                    position: "relative",
                    right: "7px",
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: "Quicksand, sans-serif",
                      fontSize: 18,
                      color: "#fff",
                      lineHeight: 1.6,
                    }}
                  >
                    Enter longitude
                  </Typography>
                  <TextField
                    sx={{ backgroundColor: "white" }}
                    size="small"
                    placeholder="00.0000"
                    onChange={(e) => {
                      setLongitude(e.target.value);
                    }}
                    value={longitude}
                  ></TextField>
                </Box>

                <Button
                  onClick={storeCoordinates}
                  variant="contained"
                  sx={{
                    pt: "2px",
                    textTransform: "none",
                    background:
                      "linear-gradient(90deg, #3DC787 0%, #55C923 100%)",
                    boxShadow: "0 4px 20px rgba(85, 201, 35, 0.3)",
                    "&:hover": {
                      background:
                        "linear-gradient(90deg, #55C923 0%, #3DC787 100%)",
                    },
                  }}
                >
                  Submit
                </Button>
              </Box>
            </FadeInOnScroll>
            {/*4/9 Now implement the questions displayed per section */}
            <br />
            <hr />
            <Box
              sx={{
                pt: 8,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography
                variant="h2"
                sx={{
                  fontFamily: "Quicksand, sans-serif",
                  fontWeight: 650,
                  fontSize: 35,
                }}
              >
                Section 1: Basic Information
              </Typography>

              <Typography
                variant="h3"
                sx={{
                  fontFamily: "Quicksand, sans-serif",
                  fontWeight: 650,
                  fontSize: 28,
                  pt: 5,
                }}
              >
                Home Type (select one)
              </Typography>
              <FormControl>
                <RadioGroup
                  value={selectedHomeType}
                  onChange={handleHousingChange}
                >
                  <FormControlLabel
                    value="2"
                    control={<Radio sx={{ color: "white" }} />}
                    label="Single Family Detached"
                  />
                  <FormControlLabel
                    value="3"
                    control={<Radio sx={{ color: "white" }} />}
                    label="Single Family Attached"
                  />
                  <FormControlLabel
                    value="4"
                    control={<Radio sx={{ color: "white" }} />}
                    label="Apartment (2-4) Units"
                  />
                  <FormControlLabel
                    value="5"
                    control={<Radio sx={{ color: "white" }} />}
                    label="Apartment (5+) Units"
                  />
                  <FormControlLabel
                    value="1"
                    control={<Radio sx={{ color: "white" }} />}
                    label="Mobile Home"
                  />
                </RadioGroup>
              </FormControl>

              <Typography
                sx={{
                  fontFamily: "Quicksand, sans-serif",
                  fontWeight: 650,
                  fontSize: 28,
                  pt: 5,
                }}
              >
                Number of Stories
              </Typography>

              <br />
              <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Typography
                  sx={{
                    fontFamily: "Quicksand, sans-serif",
                    fontSize: 18,
                    color: "#fff",
                    lineHeight: 1.6,
                  }}
                >
                  Enter the number of floors in your home
                </Typography>
                <TextField
                  sx={{ backgroundColor: "white" }}
                  size="small"
                  placeholder="Number of floors"
                  onKeyDown={(e) => {
                    const digits = "1234567890";
                    const key = e.key;
                    if (
                      !digits.includes(key) &&
                      key !== "Backspace" &&
                      key !== "Tab"
                    ) {
                      e.preventDefault();
                    }
                  }}
                  onChange={(e) => {
                    setNumFloors(e.target.value);
                  }}
                  value={numFloors}
                ></TextField>
              </Box>

              <Typography
                sx={{
                  fontFamily: "Quicksand, sans-serif",
                  fontWeight: 650,
                  fontSize: 28,
                  pt: 5,
                }}
              >
                Total Square Footage of Home
              </Typography>

              <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Typography
                  sx={{
                    fontFamily: "Quicksand, sans-serif",
                    fontSize: 18,
                    color: "#fff",
                    lineHeight: 1.6,
                  }}
                >
                  Approximate size in square feet
                </Typography>
                <TextField
                  sx={{ backgroundColor: "white" }}
                  size="small"
                  placeholder="Square Feet"
                  onKeyDown={(e) => {
                    const digits = "1234567890";
                    const key = e.key;
                    if (
                      !digits.includes(key) &&
                      key !== "Backspace" &&
                      key !== "Tab"
                    ) {
                      e.preventDefault();
                    }
                  }}
                  onChange={(e) => {
                    setSquareFoot(e.target.value);
                  }}
                  value={squareFoot}
                ></TextField>
              </Box>

              <Typography
                sx={{
                  fontFamily: "Quicksand, sans-serif",
                  fontWeight: 650,
                  fontSize: 28,
                  pt: 5,
                }}
              >
                Number of People Living in the House
              </Typography>

              <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Typography
                  sx={{
                    fontFamily: "Quicksand, sans-serif",
                    fontSize: 18,
                    color: "#fff",
                    lineHeight: 1.6,
                  }}
                >
                  Include all household members
                </Typography>
                <TextField
                  sx={{ backgroundColor: "white" }}
                  size="small"
                  placeholder="Number of people"
                  onKeyDown={(e) => {
                    const digits = "1234567890";
                    const key = e.key;
                    if (
                      !digits.includes(key) &&
                      key !== "Backspace" &&
                      key !== "Tab"
                    ) {
                      e.preventDefault();
                    }
                  }}
                  onChange={(e) => {
                    setNumPeopleOccupy(e.target.value);
                  }}
                  value={numPeopleOccupy}
                ></TextField>
              </Box>

              <Typography
                sx={{
                  fontFamily: "Quicksand, sans-serif",
                  fontWeight: 650,
                  fontSize: 28,
                  pt: 5,
                }}
              >
                Number of Children (under 18)
              </Typography>

              <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Typography
                  sx={{
                    fontFamily: "Quicksand, sans-serif",
                    fontSize: 18,
                    color: "#fff",
                    lineHeight: 1.6,
                  }}
                >
                  Enter the number of children
                </Typography>
                <TextField
                  sx={{ backgroundColor: "white" }}
                  size="small"
                  placeholder="Number of children"
                  onKeyDown={(e) => {
                    const digits = "1234567890";
                    const key = e.key;
                    if (
                      !digits.includes(key) &&
                      key !== "Backspace" &&
                      key !== "Tab"
                    ) {
                      e.preventDefault();
                    }
                  }}
                  onChange={(e) => {
                    setNumChildren(e.target.value);
                  }}
                  value={numChildren}
                ></TextField>
              </Box>

              <Typography
                variant="h3"
                sx={{
                  fontFamily: "Quicksand, sans-serif",
                  fontWeight: 650,
                  fontSize: 28,
                  pt: 5,
                }}
              >
                Annual Household Income Range
              </Typography>
              <FormControl>
                <RadioGroup
                  value={annualIncomeRange}
                  onChange={handleIncomeChange}
                >
                  <FormControlLabel
                    value="3"
                    control={<Radio sx={{ color: "white" }} />}
                    label="Less than $20,000"
                  />
                  <FormControlLabel
                    value="8"
                    control={<Radio sx={{ color: "white" }} />}
                    label="$20,000-$50,000"
                  />
                  <FormControlLabel
                    value="13"
                    control={<Radio sx={{ color: "white" }} />}
                    label="$50,000-$100,000"
                  />
                  <FormControlLabel
                    value="16"
                    control={<Radio sx={{ color: "white" }} />}
                    label="Over $100,000"
                  />
                </RadioGroup>
              </FormControl>

              <Typography
                variant="h3"
                sx={{
                  fontFamily: "Quicksand, sans-serif",
                  fontWeight: 650,
                  fontSize: 28,
                  pt: 5,
                }}
              >
                Primary Heating Equipment Type
              </Typography>
              <FormControl>
                <RadioGroup
                  value={heatingEquipmentType}
                  onChange={handleHeatingChange}
                >
                  <FormControlLabel
                    value="3"
                    control={<Radio sx={{ color: "white" }} />}
                    label="Central Furnace"
                    sx={{ minWidth: 5 }}
                  />
                  <FormControlLabel
                    value="4"
                    control={<Radio sx={{ color: "white" }} />}
                    label="Heat Pump"
                    sx={{ minWidth: 5 }}
                  />
                  <FormControlLabel
                    value="5"
                    control={<Radio sx={{ color: "white" }} />}
                    label="Electric Baseboard"
                    sx={{ minWidth: 5 }}
                  />
                  <FormControlLabel
                    value="8"
                    control={<Radio sx={{ color: "white" }} />}
                    label="Wood Stove"
                    sx={{ minWidth: 5 }}
                  />
                  <FormControlLabel
                    value="-2"
                    control={<Radio sx={{ color: "white" }} />}
                    label="No Heating"
                    sx={{ minWidth: 5 }}
                  />
                </RadioGroup>
              </FormControl>

              <Typography
                variant="h3"
                sx={{
                  fontFamily: "Quicksand, sans-serif",
                  fontWeight: 650,
                  fontSize: 28,
                  pt: 5,
                }}
              >
                Primary Cooling Equipment
              </Typography>

              <FormControl>
                <RadioGroup
                  value={coolingEquipmentType}
                  onChange={handleCoolingChange}
                >
                  <FormControlLabel
                    value="1"
                    control={<Radio sx={{ color: "white" }} />}
                    label="Central AC"
                    sx={{ minWidth: 5, position: "relative", right: 26 }}
                  />
                  <FormControlLabel
                    value="4"
                    control={<Radio sx={{ color: "white" }} />}
                    label="Window AC"
                    sx={{ minWidth: 5, position: "relative", right: 26 }}
                  />
                  <FormControlLabel
                    value="-2"
                    control={<Radio sx={{ color: "white" }} />}
                    label="No Cooling"
                    sx={{ minWidth: 5, position: "relative", right: 26 }}
                  />
                </RadioGroup>
              </FormControl>

              <Typography
                variant="h3"
                sx={{
                  fontFamily: "Quicksand, sans-serif",
                  fontWeight: 650,
                  fontSize: 28,
                  pt: 5,
                }}
              >
                Number of Ceiling Fans
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Typography
                  sx={{
                    fontFamily: "Quicksand, sans-serif",
                    fontSize: 18,
                    color: "#fff",
                    lineHeight: 1.6,
                  }}
                >
                  Enter the number of ceiling fans
                </Typography>
                <TextField
                  sx={{ backgroundColor: "white" }}
                  size="small"
                  placeholder="Number of ceiling fans"
                  onKeyDown={(e) => {
                    const digits = "1234567890";
                    const key = e.key;
                    if (
                      !digits.includes(key) &&
                      key !== "Backspace" &&
                      key !== "Tab"
                    ) {
                      e.preventDefault();
                    }
                  }}
                  onChange={(e) => {
                    setNumCeilingFans(e.target.value);
                  }}
                  value={numCeilingFans}
                ></TextField>
              </Box>

              <Typography
                variant="h3"
                sx={{
                  fontFamily: "Quicksand, sans-serif",
                  fontWeight: 650,
                  fontSize: 28,
                  pt: 5,
                }}
              >
                Number of Floor Fans
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Typography
                  sx={{
                    fontFamily: "Quicksand, sans-serif",
                    fontSize: 18,
                    color: "#fff",
                    lineHeight: 1.6,
                  }}
                >
                  Enter the number of floor fans
                </Typography>
                <TextField
                  sx={{ backgroundColor: "white" }}
                  size="small"
                  placeholder="Number of floor fans"
                  onKeyDown={(e) => {
                    const digits = "1234567890";
                    const key = e.key;
                    if (
                      !digits.includes(key) &&
                      key !== "Backspace" &&
                      key !== "Tab"
                    ) {
                      e.preventDefault();
                    }
                  }}
                  onChange={(e) => {
                    setNumFloorFans(e.target.value);
                  }}
                  value={numFloorFans}
                ></TextField>
              </Box>
            </Box>
            <br />
            <br />
            <br />
            <hr />
            <br />
            {/*Section 2 Questions */}
            <Box
              sx={{
                pt: 8,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography
                variant="h2"
                sx={{
                  fontFamily: "Quicksand, sans-serif",
                  fontWeight: 650,
                  fontSize: 35,
                }}
              >
                Section 2: Energy Usage & Appliances
              </Typography>

              <Typography
                variant="h3"
                sx={{
                  fontFamily: "Quicksand, sans-serif",
                  fontWeight: 650,
                  fontSize: 28,
                  pt: 5,
                }}
              >
                Number of Bedrooms
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Typography
                  sx={{
                    fontFamily: "Quicksand, sans-serif",
                    fontSize: 18,
                    color: "#fff",
                    lineHeight: 1.6,
                  }}
                >
                  Enter the number of bedrooms
                </Typography>
                <TextField
                  sx={{ backgroundColor: "white" }}
                  size="small"
                  placeholder="Number of bedrooms"
                  onKeyDown={(e) => {
                    const digits = "1234567890";
                    const key = e.key;
                    if (
                      !digits.includes(key) &&
                      key !== "Backspace" &&
                      key !== "Tab"
                    ) {
                      e.preventDefault();
                    }
                  }}
                  onChange={(e) => {
                    setNumBedrooms(e.target.value);
                  }}
                  value={numBedrooms}
                ></TextField>
              </Box>

              <Typography
                variant="h3"
                sx={{
                  fontFamily: "Quicksand, sans-serif",
                  fontWeight: 650,
                  fontSize: 28,
                  pt: 5,
                }}
              >
                Number of Bathrooms
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Typography
                  sx={{
                    fontFamily: "Quicksand, sans-serif",
                    fontSize: 18,
                    color: "#fff",
                    lineHeight: 1.6,
                  }}
                >
                  Enter the number of bathrooms
                </Typography>
                <TextField
                  sx={{ backgroundColor: "white" }}
                  size="small"
                  placeholder="Number of bathrooms"
                  onKeyDown={(e) => {
                    const digits = "1234567890";
                    const key = e.key;
                    if (
                      !digits.includes(key) &&
                      key !== "Backspace" &&
                      key !== "Tab"
                    ) {
                      e.preventDefault();
                    }
                  }}
                  onChange={(e) => {
                    setNumBathrooms(e.target.value);
                  }}
                  value={numBathrooms}
                ></TextField>
              </Box>

              <Typography
                variant="h3"
                sx={{
                  fontFamily: "Quicksand, sans-serif",
                  fontWeight: 650,
                  fontSize: 28,
                  pt: 5,
                }}
              >
                Number of Other Rooms (excluding bathrooms & bedrooms)
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Typography
                  sx={{
                    fontFamily: "Quicksand, sans-serif",
                    fontSize: 18,
                    color: "#fff",
                    lineHeight: 1.6,
                  }}
                >
                  These include living rooms, dining rooms, offices, etc.
                </Typography>
                <TextField
                  sx={{ backgroundColor: "white" }}
                  size="small"
                  placeholder="Number of other rooms"
                  onKeyDown={(e) => {
                    const digits = "1234567890";
                    const key = e.key;
                    if (
                      !digits.includes(key) &&
                      key !== "Backspace" &&
                      key !== "Tab"
                    ) {
                      e.preventDefault();
                    }
                  }}
                  onChange={(e) => {
                    setNumOtherRooms(e.target.value);
                  }}
                  value={numOtherRooms}
                ></TextField>
              </Box>

              <Typography
                variant="h3"
                sx={{
                  fontFamily: "Quicksand, sans-serif",
                  fontWeight: 650,
                  fontSize: 28,
                  pt: 5,
                }}
              >
                Number of Windows
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Typography
                  sx={{
                    fontFamily: "Quicksand, sans-serif",
                    fontSize: 18,
                    color: "#fff",
                    lineHeight: 1.6,
                  }}
                >
                  Enter the approximate number of windows in your home
                </Typography>
                <TextField
                  sx={{ backgroundColor: "white" }}
                  size="small"
                  placeholder="Number of windows"
                  onKeyDown={(e) => {
                    const digits = "1234567890";
                    const key = e.key;
                    if (
                      !digits.includes(key) &&
                      key !== "Backspace" &&
                      key !== "Tab"
                    ) {
                      e.preventDefault();
                    }
                  }}
                  onChange={(e) => {
                    setNumWindows(e.target.value);
                  }}
                  value={numWindows}
                ></TextField>
              </Box>

              <Typography
                variant="h3"
                sx={{
                  fontFamily: "Quicksand, sans-serif",
                  fontWeight: 650,
                  fontSize: 28,
                  pt: 5,
                }}
              >
                Insulation Level (if known)
              </Typography>
              <FormControl>
                <RadioGroup
                  value={insulationLevel}
                  onChange={(e) => setInsulationLevel(e.target.value)}
                >
                  <FormControlLabel
                    value="1"
                    control={<Radio sx={{ color: "white" }} />}
                    label="Well Insulated"
                    sx={{ minWidth: 5 }}
                  />
                  <FormControlLabel
                    value="2"
                    control={<Radio sx={{ color: "white" }} />}
                    label="Poorly Insulated"
                    sx={{ minWidth: 5 }}
                  />
                  <FormControlLabel
                    value="3"
                    control={<Radio sx={{ color: "white" }} />}
                    label="Unknown"
                    sx={{ minWidth: 5 }}
                  />
                </RadioGroup>
              </FormControl>

              <Typography
                variant="h3"
                sx={{
                  fontFamily: "Quicksand, sans-serif",
                  fontWeight: 650,
                  fontSize: 28,
                  pt: 5,
                }}
              >
                Number of Refrigerators
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Typography
                  sx={{
                    fontFamily: "Quicksand, sans-serif",
                    fontSize: 18,
                    color: "#fff",
                    lineHeight: 1.6,
                  }}
                >
                  Enter the number of fridges
                </Typography>
                <TextField
                  sx={{ backgroundColor: "white" }}
                  size="small"
                  placeholder="Number of fridges"
                  onKeyDown={(e) => {
                    const digits = "1234567890";
                    const key = e.key;
                    if (
                      !digits.includes(key) &&
                      key !== "Backspace" &&
                      key !== "Tab"
                    ) {
                      e.preventDefault();
                    }
                  }}
                  onChange={(e) => {
                    setNumFridges(e.target.value);
                  }}
                  value={numFridges}
                ></TextField>
              </Box>

              <Typography
                variant="h3"
                sx={{
                  fontFamily: "Quicksand, sans-serif",
                  fontWeight: 650,
                  fontSize: 28,
                  pt: 5,
                }}
              >
                Cooking Frequency per Week
              </Typography>
              <FormControl>
                <RadioGroup
                  value={cookingFrequency}
                  onChange={(e) => {
                    setCookingFrequency(e.target.value);
                  }}
                >
                  <FormControlLabel
                    value="1"
                    control={<Radio sx={{ color: "white" }} />}
                    label="Rarely"
                    sx={{ minWidth: 5 }}
                  />
                  <FormControlLabel
                    value="3"
                    control={<Radio sx={{ color: "white" }} />}
                    label="1-3 times"
                    sx={{ minWidth: 5 }}
                  />
                  <FormControlLabel
                    value="7"
                    control={<Radio sx={{ color: "white" }} />}
                    label="4-7 times"
                    sx={{ minWidth: 5 }}
                  />
                  <FormControlLabel
                    value="15"
                    control={<Radio sx={{ color: "white" }} />}
                    label="More than 7 times"
                    sx={{ minWidth: 5 }}
                  />
                </RadioGroup>
              </FormControl>

              <Typography
                variant="h3"
                sx={{
                  fontFamily: "Quicksand, sans-serif",
                  fontWeight: 650,
                  fontSize: 28,
                  pt: 5,
                }}
              >
                Daily Meals Cooked
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Typography
                  sx={{
                    fontFamily: "Quicksand, sans-serif",
                    fontSize: 18,
                    color: "#fff",
                    lineHeight: 1.6,
                  }}
                >
                  Enter the number of hot meals cooked daily
                </Typography>
                <TextField
                  sx={{ backgroundColor: "white" }}
                  size="small"
                  placeholder="Number of hot meals"
                  onKeyDown={(e) => {
                    const digits = "1234567890";
                    const key = e.key;
                    if (
                      !digits.includes(key) &&
                      key !== "Backspace" &&
                      key !== "Tab"
                    ) {
                      e.preventDefault();
                    }
                  }}
                  onChange={(e) => {
                    setNumHotMealsCookedDaily(e.target.value);
                  }}
                  value={numHotMealsCookedDaily}
                ></TextField>
              </Box>

              <Typography
                variant="h3"
                sx={{
                  fontFamily: "Quicksand, sans-serif",
                  fontWeight: 650,
                  fontSize: 28,
                  pt: 5,
                }}
              >
                Oven Usage per Week
              </Typography>
              <FormControl>
                <RadioGroup
                  value={ovenFrequency}
                  onChange={(e) => setOvenFrequency(e.target.value)}
                >
                  <FormControlLabel
                    value="1"
                    control={<Radio sx={{ color: "white" }} />}
                    label="Rarely"
                    sx={{ minWidth: 5 }}
                  />
                  <FormControlLabel
                    value="3"
                    control={<Radio sx={{ color: "white" }} />}
                    label="1-3 times"
                    sx={{ minWidth: 5 }}
                  />
                  <FormControlLabel
                    value="7"
                    control={<Radio sx={{ color: "white" }} />}
                    label="4-7 times"
                    sx={{ minWidth: 5 }}
                  />
                  <FormControlLabel
                    value="12"
                    control={<Radio sx={{ color: "white" }} />}
                    label="More than 7 times"
                    sx={{ minWidth: 5 }}
                  />
                </RadioGroup>
              </FormControl>

              <Typography
                variant="h3"
                sx={{
                  fontFamily: "Quicksand, sans-serif",
                  fontWeight: 650,
                  fontSize: 28,
                  pt: 5,
                }}
              >
                Number of Laundry Loads per Week
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Typography
                  sx={{
                    fontFamily: "Quicksand, sans-serif",
                    fontSize: 18,
                    color: "#fff",
                    lineHeight: 1.6,
                  }}
                >
                  Enter the number of laundry loads per week
                </Typography>
                <TextField
                  sx={{ backgroundColor: "white" }}
                  size="small"
                  placeholder="Number of laundry loads"
                  onKeyDown={(e) => {
                    const digits = "1234567890";
                    const key = e.key;
                    if (
                      !digits.includes(key) &&
                      key !== "Backspace" &&
                      key !== "Tab"
                    ) {
                      e.preventDefault();
                    }
                  }}
                  onChange={(e) => {
                    setNumLaundry(e.target.value);
                  }}
                  value={numLaundry}
                ></TextField>
              </Box>

              <Typography
                variant="h3"
                sx={{
                  fontFamily: "Quicksand, sans-serif",
                  fontWeight: 650,
                  fontSize: 28,
                  pt: 5,
                }}
              >
                Dishwasher Usage per Week
              </Typography>
              <FormControl>
                <RadioGroup
                  value={numDishwash}
                  onChange={(e) => setNumDishwash(e.target.value)}
                >
                  <FormControlLabel
                    value="1"
                    control={<Radio sx={{ color: "white" }} />}
                    label="Rarely"
                    sx={{ minWidth: 5 }}
                  />
                  <FormControlLabel
                    value="3"
                    control={<Radio sx={{ color: "white" }} />}
                    label="1-3 times"
                    sx={{ minWidth: 5 }}
                  />
                  <FormControlLabel
                    value="7"
                    control={<Radio sx={{ color: "white" }} />}
                    label="4-7 times"
                    sx={{ minWidth: 5 }}
                  />
                  <FormControlLabel
                    value="18"
                    control={<Radio sx={{ color: "white" }} />}
                    label="More than 7 times"
                    sx={{ minWidth: 5 }}
                  />
                </RadioGroup>
              </FormControl>

              <Typography
                variant="h3"
                sx={{
                  fontFamily: "Quicksand, sans-serif",
                  fontWeight: 650,
                  fontSize: 28,
                  pt: 5,
                }}
              >
                Number of TVs
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Typography
                  sx={{
                    fontFamily: "Quicksand, sans-serif",
                    fontSize: 18,
                    color: "#fff",
                    lineHeight: 1.6,
                  }}
                >
                  Enter the number of TV's in your home
                </Typography>
                <TextField
                  sx={{ backgroundColor: "white" }}
                  size="small"
                  placeholder="Number of TVs"
                  onKeyDown={(e) => {
                    const digits = "1234567890";
                    const key = e.key;
                    if (
                      !digits.includes(key) &&
                      key !== "Backspace" &&
                      key !== "Tab"
                    ) {
                      e.preventDefault();
                    }
                  }}
                  onChange={(e) => {
                    setNumTV(e.target.value);
                  }}
                  value={numTV}
                ></TextField>
              </Box>

              <Typography
                variant="h3"
                sx={{
                  fontFamily: "Quicksand, sans-serif",
                  fontWeight: 650,
                  fontSize: 28,
                  pt: 5,
                }}
              >
                Number of Portable Electric Devices
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Typography
                  sx={{
                    fontFamily: "Quicksand, sans-serif",
                    fontSize: 18,
                    color: "#fff",
                    lineHeight: 1.6,
                  }}
                >
                  This includes laptops, tablets, smartphones, etc.
                </Typography>
                <TextField
                  sx={{ backgroundColor: "white" }}
                  size="small"
                  placeholder="Number of devices"
                  onKeyDown={(e) => {
                    const digits = "1234567890";
                    const key = e.key;
                    if (
                      !digits.includes(key) &&
                      key !== "Backspace" &&
                      key !== "Tab"
                    ) {
                      e.preventDefault();
                    }
                  }}
                  onChange={(e) => {
                    setNumDevices(e.target.value);
                  }}
                  value={numDevices}
                ></TextField>
              </Box>

              <Typography
                variant="h3"
                sx={{
                  fontFamily: "Quicksand, sans-serif",
                  fontWeight: 650,
                  fontSize: 28,
                  pt: 5,
                }}
              >
                Number of Humidifiers
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Typography
                  sx={{
                    fontFamily: "Quicksand, sans-serif",
                    fontSize: 18,
                    color: "#fff",
                    lineHeight: 1.6,
                  }}
                >
                  Enter the number of humidifiers in your home
                </Typography>
                <TextField
                  sx={{ backgroundColor: "white" }}
                  size="small"
                  placeholder="Number of humidifiers"
                  onKeyDown={(e) => {
                    const digits = "1234567890";
                    const key = e.key;
                    if (
                      !digits.includes(key) &&
                      key !== "Backspace" &&
                      key !== "Tab"
                    ) {
                      e.preventDefault();
                    }
                  }}
                  onChange={(e) => {
                    setNumHumidifiers(e.target.value);
                  }}
                  value={numHumidifiers}
                ></TextField>
              </Box>

              <Typography
                variant="h3"
                sx={{
                  fontFamily: "Quicksand, sans-serif",
                  fontWeight: 650,
                  fontSize: 28,
                  pt: 5,
                }}
              >
                Number of Portable Air Conditioners
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Typography
                  sx={{
                    fontFamily: "Quicksand, sans-serif",
                    fontSize: 18,
                    color: "#fff",
                    lineHeight: 1.6,
                  }}
                >
                  Enter the number of portable ACs
                </Typography>
                <TextField
                  sx={{ backgroundColor: "white" }}
                  size="small"
                  placeholder="Number of ACs"
                  onKeyDown={(e) => {
                    const digits = "1234567890";
                    const key = e.key;
                    if (
                      !digits.includes(key) &&
                      key !== "Backspace" &&
                      key !== "Tab"
                    ) {
                      e.preventDefault();
                    }
                  }}
                  onChange={(e) => {
                    setNumPortableAc(e.target.value);
                  }}
                  value={numPortableAc}
                ></TextField>
              </Box>

              <Typography
                variant="h3"
                sx={{
                  fontFamily: "Quicksand, sans-serif",
                  fontWeight: 650,
                  fontSize: 28,
                  pt: 5,
                }}
              >
                Number of Portable Heaters
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Typography
                  sx={{
                    fontFamily: "Quicksand, sans-serif",
                    fontSize: 18,
                    color: "#fff",
                    lineHeight: 1.6,
                  }}
                >
                  Enter the number of portable heaters
                </Typography>
                <TextField
                  sx={{ backgroundColor: "white" }}
                  size="small"
                  placeholder="Number of portable heaters"
                  onKeyDown={(e) => {
                    const digits = "1234567890";
                    const key = e.key;
                    if (
                      !digits.includes(key) &&
                      key !== "Backspace" &&
                      key !== "Tab"
                    ) {
                      e.preventDefault();
                    }
                  }}
                  onChange={(e) => {
                    setNumPortableHeat(e.target.value);
                  }}
                  value={numPortableHeat}
                ></TextField>
              </Box>

              <Typography
                variant="h3"
                sx={{
                  fontFamily: "Quicksand, sans-serif",
                  fontWeight: 650,
                  fontSize: 28,
                  pt: 5,
                }}
              >
                Ceiling Fan Usage
              </Typography>
              <FormControl>
                <RadioGroup
                  value={ceilingFanUsage}
                  onChange={(e) => setCeilingFanUsage(e.target.value)}
                >
                  <FormControlLabel
                    value="1"
                    control={<Radio sx={{ color: "white" }} />}
                    label="Use occasionally, such as when it is hot or when guests are over"
                    sx={{ minWidth: 5 }}
                  />
                  <FormControlLabel
                    value="2"
                    control={<Radio sx={{ color: "white" }} />}
                    label="Use only during summer months to stay cool"
                    sx={{ minWidth: 5 }}
                  />
                  <FormControlLabel
                    value="3"
                    control={<Radio sx={{ color: "white" }} />}
                    label="Use about half of the year"
                    sx={{ minWidth: 5 }}
                  />
                  <FormControlLabel
                    value="4"
                    control={<Radio sx={{ color: "white" }} />}
                    label="Use all or almost all of the year"
                    sx={{ minWidth: 5 }}
                  />
                </RadioGroup>
              </FormControl>

              <Typography
                variant="h3"
                sx={{
                  fontFamily: "Quicksand, sans-serif",
                  fontWeight: 650,
                  fontSize: 28,
                  pt: 5,
                }}
              >
                Number of Lights Bulbs Used
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Typography
                  sx={{
                    fontFamily: "Quicksand, sans-serif",
                    fontSize: 18,
                    color: "#fff",
                    lineHeight: 1.6,
                  }}
                >
                  Enter the number of light bulbs turned on every night
                </Typography>
                <TextField
                  sx={{ backgroundColor: "white" }}
                  size="small"
                  placeholder="Number of light bulbs"
                  onKeyDown={(e) => {
                    const digits = "1234567890";
                    const key = e.key;
                    if (
                      !digits.includes(key) &&
                      key !== "Backspace" &&
                      key !== "Tab"
                    ) {
                      e.preventDefault();
                    }
                  }}
                  onChange={(e) => {
                    setNumLightBulbsOn(e.target.value);
                  }}
                  value={numLightBulbsOn}
                ></TextField>
              </Box>

              <Typography
                variant="h3"
                sx={{
                  fontFamily: "Quicksand, sans-serif",
                  fontWeight: 650,
                  fontSize: 28,
                  pt: 5,
                }}
              >
                Number of Days Spent at Home
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Typography
                  sx={{
                    fontFamily: "Quicksand, sans-serif",
                    fontSize: 18,
                    color: "#fff",
                    lineHeight: 1.6,
                  }}
                >
                  Enter the number of days per week that someone spends entirely
                  at home
                </Typography>
                <TextField
                  sx={{ backgroundColor: "white" }}
                  size="small"
                  placeholder="Number of days"
                  onKeyDown={(e) => {
                    const digits = "1234567890";
                    const key = e.key;
                    if (
                      !digits.includes(key) &&
                      key !== "Backspace" &&
                      key !== "Tab"
                    ) {
                      e.preventDefault();
                    }
                  }}
                  onChange={(e) => {
                    setNumDaysAtHome(e.target.value);
                  }}
                  value={numDaysAtHome}
                ></TextField>
              </Box>

              <Typography
                variant="h3"
                sx={{
                  fontFamily: "Quicksand, sans-serif",
                  fontWeight: 650,
                  fontSize: 28,
                  pt: 5,
                }}
              >
                Enter your Age
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Typography
                  sx={{
                    fontFamily: "Quicksand, sans-serif",
                    fontSize: 18,
                    color: "#fff",
                    lineHeight: 1.6,
                  }}
                >
                  In order for us to identify patterns among different age
                  groups, please enter your age
                </Typography>
                <TextField
                  sx={{ backgroundColor: "white" }}
                  size="small"
                  placeholder="Age"
                  onKeyDown={(e) => {
                    const digits = "1234567890";
                    const key = e.key;
                    if (
                      !digits.includes(key) &&
                      key !== "Backspace" &&
                      key !== "Tab"
                    ) {
                      e.preventDefault();
                    }
                  }}
                  onChange={(e) => {
                    setUserAge(e.target.value);
                  }}
                  value={userAge}
                ></TextField>
              </Box>

              <br />

              <Typography
                variant="h3"
                sx={{
                  fontFamily: "Quicksand, sans-serif",
                  fontWeight: 650,
                  fontSize: 28,
                  pt: 5,
                }}
              >
                Lastly, Enter The Ideal Solar Panel Count
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Typography
                  sx={{
                    fontFamily: "Quicksand, sans-serif",
                    fontSize: 18,
                    color: "#fff",
                    lineHeight: 1.6,
                  }}
                >
                  Set desired # of solar 0 (leave blank to get optimal count)
                </Typography>
                <TextField
                  sx={{ backgroundColor: "white" }}
                  size="small"
                  placeholder="Solar Panel Count"
                  onKeyDown={(e) => {
                    const digits = "1234567890";
                    const key = e.key;
                    if (
                      !digits.includes(key) &&
                      key !== "Backspace" &&
                      key !== "Tab"
                    ) {
                      e.preventDefault();
                    }
                  }}
                  onChange={(e) => {
                    setPanelCount(e.target.value);
                  }}
                  value={solarPanelCount}
                ></TextField>
              </Box>

              <Button
                onClick={handleFormsSubmit}
                variant="contained"
                sx={{
                  mt: 10,
                  width: 170,
                  height: 55,
                  borderRadius: "15px",
                  fontSize: 35,
                  textTransform: "none",
                  background:
                    "linear-gradient(90deg, #3DC787 0%, #55C923 100%)",
                  boxShadow: "0 4px 20px rgba(85, 201, 35, 0.3)",
                  "&:hover": {
                    background:
                      "linear-gradient(90deg, #55C923 0%, #3DC787 100%)",
                  },
                }}
              >
                Submit
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
          </Box>
        </FadeInOnScroll>
      </Box>
    </ThemeProvider>
  );
}
