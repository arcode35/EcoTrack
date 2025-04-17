'use client'
import {React, useEffect, useState, useRef} from "react";
import axios from "axios";
import {
  Box,
  CssBaseline,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  ThemeProvider,
  createTheme,
  Button,
  TextField,
} from "@mui/material";
import BarChartIcon from "@mui/icons-material/BarChart";
import InsightsIcon from "@mui/icons-material/Insights";
import ScheduleIcon from "@mui/icons-material/Schedule";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import BoltIcon from "@mui/icons-material/Bolt";
import SpaIcon from "@mui/icons-material/Spa";
import LiveEnergyChart from "../../components/LiveEnergyChart";
import FadeInOnScroll from "../../components/FadeInOnScroll";
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

export default function Main() {
    const [latitude, setLatitude] = useState("")
    const [longitude, setLongitude] = useState("")
    const [solarPanelCount, setPanelCount] = useState("")
    const [hasData, setHasData] = useState(false)
    const [secondsPassed, setSecondsPassed] = useState(0);
    const intervalRef = useRef(null);
    
    //we have this run only once on mount. Basically runs every second
    useEffect(() => {
      //set a function to run every second. 1000 ms = 1 second
      const interval = setInterval(async() => {
        //set the new value of this variable. Because this function only loads on mount, have to tkae in preivous value automatically and draw that to increment
        let theTime = 0
        setSecondsPassed(prev => {
          theTime = prev + 1
          console.log("Seconds Passed: " + theTime);
          return prev + 1;
        });

        const response = await axios.post("http://localhost:5001/python/get_iot_snapshot", {time: theTime})
        const info = response.data
        console.log(info)
      }, 1000);
    
      //now intervalRef.current is equal to the id of this function running every second
      intervalRef.current = interval;
    
      //this is called if for some reason, the useEffect needs to reload again.
      return () => {
        //first, stop the current timer from running
        clearInterval(interval);
        //then, reset our reference ID
        intervalRef.current = null;
      };
    }, []); // the [] makes it only run once on mount
    
    //to log out the user when they press the according button
    const logoutUser = async() => {
        localStorage.setItem("username", "")
        redirectFunction()
    }

    //function that saved the following energy data to firebase
    const saveResultsToFirebase = async(geminiResponse, kwUsed, monthlyCost, numPanels, solarCost, savedMoney) => {
      const response = await axios.post("http://localhost:5002/users/update_energy_data", {
        username: localStorage.getItem("username"),
        gemini: geminiResponse,
        energyUsed: kwUsed,
        monthlyCost: monthlyCost,
        panelsUsed: numPanels,
        solarCost: solarCost,
        savedMoney: savedMoney
      })
      const result = response.data;
      //return if it worked or not
      return result.success
    }

    //gets first the utility rates for their location. Then, sneds it and all the inputs to the python server that uses the models to return predicted data
    const sendUserData = async() => {
      if(latitude === "" || longitude === "")
      {
        alert("Put in latitude and longitude of your location first!")
        return;
      }
      //calling util rates backend server
      const response = await axios.post("http://localhost:5002/utilRates/getData", {
        latitude: latitude,
        longitude: longitude
      })
      const data = await response.data
      //if fail, alert user of it
      if(data.success == false)
      {
          console.log(data.error)
          alert("Failed to get data: " + data.error.message)
      }
      //otherwise FOR NOW, just log the data
      else
      {
        //get the cost accordingly from the json output
        const residentialCostPerKw = data.data.outputs.residential  
        console.log("Cost per kilowatt: " + residentialCostPerKw)
        const response = await axios.post("http://localhost:5001/python/getPredictedUsage", {
          input: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        })
        const result = await response.data
        const kwUsed = result.KwUsed
        const geminiResponse = result.GeminiAnswer
        const monthlyCost = residentialCostPerKw * result.KwUsed

        console.log("Energy used: " + monthlyCost)
        console.log("Live Gemini Reaction: " + result.GeminiAnswer)
        console.log("Total cost is " + monthlyCost)

        const solarResults = await getSolarData(residentialCostPerKw, monthlyCost)
        if(solarResults.Succeed == false)
        {
          alert("Solar API Call failed!")
          return
        }
        
        //now putting the data we got into variables
        const numPanels = solarResults.Panels
        const solarCost = solarResults.Total_Cost
        const savedMoney = solarResults.Saved_Money

        const saveDataStatus = await saveResultsToFirebase(geminiResponse, kwUsed, monthlyCost, numPanels, solarCost, savedMoney)
        if(!saveDataStatus)
        {
          alert(saveDataStatus.message)
        }
        
        //finally, now go to the results page
        window.location.href = "/results"
      }
    }

    //function that checks if user already has gotten a data snapshot before. If so, sets hasData to true, otherwise remains false
    const setIfHasData = async() => {
      const result = await axios.post("http://localhost:5002/users/check_data_snapshot", {
        username: localStorage.getItem("username")
      })
      const theData = result.data
      if(theData.success)
      {
        setHasData(true)
      }
    }
    setIfHasData()

    //function to simply to go results page
    const goToResults = async() => {
      window.location.href = "/results"
    }
  
    const redirectFunction = async() => {
        //checks if we're actually not logged in, and we need to go back to the main menu
        if(localStorage.getItem("username") === null || localStorage.getItem("username") === "")
        {
            window.location.href = "/"
        }
    }
    redirectFunction()

    //gets the solar data using latittude and longitude
    const getSolarData = async(residentialCostPerKw, monthlyCost) => {
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
            onClick={logoutUser}
            variant="contained"
            sx={{
            textTransform: "none",
            background: "linear-gradient(90deg, #3DC787 0%, #55C923 100%)",
            boxShadow: "0 4px 20px rgba(85, 201, 35, 0.3)",
            "&:hover": {
                background:
                "linear-gradient(90deg, #55C923 0%, #3DC787 100%)",
            },
            }}
          >
            LOGOUT
          </Button>
          <img src="EcoTrack.svg" alt="EcoTrack Logo" width="140px" />
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
          {/* If user has already gotten a snapshot before, grant them the ability to review the results from it. */}
          {hasData ? <Button
              onClick={goToResults}
              variant="contained"
              sx={{
              textTransform: "none",
              background: "linear-gradient(90deg, #3DC787 0%, #55C923 100%)",
              boxShadow: "0 4px 20px rgba(85, 201, 35, 0.3)",
              "&:hover": {
                  background:
                  "linear-gradient(90deg, #55C923 0%, #3DC787 100%)",
              },
              }}
              >
                View Previous Data
            </Button> : <div></div>}  
          <Divider sx={{ width: "100%", borderColor: "#333", my: 2 }} />
          <List sx={{ width: "100%" }}>
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

        {/* Main Content */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            p: 4,
            gap:"8px"
          }}
        >
            <Box sx={{ height: 500, width: 800 }}>
            <LiveEnergyChart />
            </Box>
            <Box sx={{display: "flex", alignItems: "center", gap: "8px"}}>
                <FadeInOnScroll>
                  <Typography
                      sx={{
                          fontFamily: "Quicksand, sans-serif",
                          fontSize: 18,
                          color: "#ccc",
                          lineHeight: 1.6,
                      }}
                  >
                      Here, set your latitude:
                  </Typography>
                  <TextField sx={{backgroundColor:"white"}} size="small" placeholder="Latitude Coords" value={latitude} onChange={(e) => setLatitude(e.target.value)}></TextField>
                </FadeInOnScroll>
            </Box>

            <Box sx={{display: "flex", alignItems: "center", gap: "8px"}}>
              <FadeInOnScroll>
                <Typography
                    sx={{
                        fontFamily: "Quicksand, sans-serif",
                        fontSize: 18,
                        color: "#ccc",
                        lineHeight: 1.6,
                    }}
                >
                    Here, set your longitude:
                </Typography>
                <TextField sx={{backgroundColor:"white"}} size="small" placeholder="Longitude Coords" value={longitude} onChange={(e) => setLongitude(e.target.value)}></TextField>
              </FadeInOnScroll>
            </Box>
            <FadeInOnScroll>
              <Box sx={{display: "flex", alignItems: "center", gap: "8px"}}>
                  <Typography
                      sx={{
                          fontFamily: "Quicksand, sans-serif",
                          fontSize: 18,
                          color: "#ccc",
                          lineHeight: 1.6,
                      }}
                  >
                      Set desired # of solar panels (leave blank to get optimal count)
                  </Typography>
                  <TextField sx={{backgroundColor:"white"}} size="small" placeholder="Solar Panel Count" value={solarPanelCount} onChange={(e) => setPanelCount(e.target.value)}></TextField>
              </Box>
            </FadeInOnScroll>
            <FadeInOnScroll>
              <Button 
                  onClick={sendUserData}
                  variant="contained"
                  sx={{
                  textTransform: "none",
                  background: "linear-gradient(90deg, #3DC787 0%, #55C923 100%)",
                  boxShadow: "0 4px 20px rgba(85, 201, 35, 0.3)",
                  "&:hover": {
                      background:
                      "linear-gradient(90deg, #55C923 0%, #3DC787 100%)",
                  },
                  }}
              >
                  Get Results!
              </Button>
            </FadeInOnScroll>
        </Box>
      </Box>
    </ThemeProvider>
  );
};