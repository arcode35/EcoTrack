'use client'
import {React, use, useState, useRef, useEffect} from "react";
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
import LiveIOTChart from "../../components/LiveIOTChart";
import FadeInOnScroll from "@/components/FadeInOnScroll";
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

export default function IOT() 
{
    const [secondsPassed, setSecondsPassed] = useState(-1);
    const [displayPredictPrompt, setPredictPrompt] = useState(false)
    const [beginPredictions, setPredictions] = useState(false)
    const [sensorData, addSensorData] = useState([])
    const intervalRef = useRef(null);

    //initially set this to be empty, we define the reference in a bit
    const chartRef = useRef();
  
    //we have this run only once on mount. Basically runs every second
    useEffect(() => {
        //set a function to run every second. 1000 ms = 1 second
        const interval = setInterval(async() => {
            //set the new value of this variable. Because this function only loads on mount, have to tkae in preivous value automatically and draw that to increment
            let theTime = -1
            setSecondsPassed(prev => {
            theTime = prev + 1
            console.log("Seconds Passed: " + theTime);
            return prev + 1;
            });

            if(!beginPredictions)
            {
              const response = await axios.get("http://localhost:5001/python/get_iot_snapshot")
              const iot_data = response.data
              let energyAvg = 0
              for(let iot of iot_data)
              {
                if(iot.id == 0)
                {
                  iot.id = theTime
                  addSensorData((prev) => {
                    return [...prev, iot]
                  })
                }
                energyAvg += iot.power_use / iot_data.length
              }
              console.log(iot_data)
              console.log(energyAvg)
              //use our reference to call the function in teh child component
              chartRef.current?.plotNewPoint(energyAvg, theTime, false)  
            }
            else
            {
              const response = await axios.post("http://localhost:5001/python/next_iot_data",  {
                theData: sensorData
                
              })
              const resultData = response.data
              if(resultData.success)
              {
                console.log("Predicted usage: " + resultData.result)
                chartRef.current?.plotNewPoint(resultData.result, theTime, true)  
              }
            }
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
    }, [beginPredictions, sensorData]); // the [] makes it only run once on mount     
    
    const startPredictions = async() => {
        setPredictions(true)
    }

    //when secondsPassed changes, check if it's over 30, if it is then we can display button asking to predict data
    useEffect(() => {
        if(secondsPassed >= 30)
        {
            setPredictPrompt(true)
        }
    }, [secondsPassed])

    //to log out the user when they press the according button
    const logoutUser = async() => {
        localStorage.setItem("username", "")
        redirectFunction()
    }

    //return to data input, either if we dont' actually have all the data or if user presses the button
    const returnToDataInput = async() => {
        window.location.href = "/main"
    }

    const redirectFunction = async() => {
        //checks if we're actually not logged in, and we need to go back to the main menu
        if(localStorage.getItem("username") === null || localStorage.getItem("username") === "")
        {
            window.location.href = "/"
        }
    }
    
    redirectFunction()

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
          minHeight: "100vh",
          overflowY: "auto"
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

          <Button 
            onClick={returnToDataInput}
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
            Return To Data Input
          </Button>
          <p></p>
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
            alignItems: "center",
            p: 4,
            gap:"8px"
          }}
        >
            <Box sx={{ height: 500, width: 800 }}>
              {/* Setting ref this way so that we can access the iot chart component from chartRef */}
              <LiveIOTChart ref={chartRef}/>
            </Box>

            {(displayPredictPrompt) ? 
                <Button 
                    onClick={startPredictions}
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
                    Start Predicting Future Usage!
                </Button>
                : 
                <p>Wait for more data...</p>}
        </Box>
      </Box>
    </ThemeProvider>
    );
};