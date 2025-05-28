"use client";
import { React, use, useState, useRef, useEffect } from "react";
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
import Sidebar from "@/components/Sidebar";
import BarChartIcon from "@mui/icons-material/BarChart";
import InsightsIcon from "@mui/icons-material/Insights";
import ScheduleIcon from "@mui/icons-material/Schedule";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import BoltIcon from "@mui/icons-material/Bolt";
import SpaIcon from "@mui/icons-material/Spa";
import LiveIOTChart from "../../components/LiveIOTChart";
import FadeInOnScroll from "@/components/FadeInOnScroll";
import { useRouter } from "next/navigation";
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
    const router = useRouter()
    const [secondsPassed, setSecondsPassed] = useState(-1);
    const [displayPredictPrompt, setPredictPrompt] = useState(false)
    const [beginPredictions, setPredictions] = useState(false)
    //this will be a 2D array where the outer array will be each iot, and then the inner array will be for that iot,
    //for each day what its temp, pressure, and data was
    const [sensorData, addSensorData] = useState([[]])
    const intervalRef = useRef(null);
    const [hasResultsData, setHasResultsData] = useState(false);

    let username = ""
    if(typeof window !== "undefined")
    {
      username = localStorage.getItem("username")
    }

  //initially set this to be empty, we define the reference in a bit
  const chartRef = useRef();

  const predictFunct = async () => {
    while (true) {
      const response = await axios.post(
        "http://localhost:5001/python/next_iot_data",
        {
          theData: sensorData,
        },
      );
      const data = response.data;
      if (data.success) {
        const totalUse = data.result;
        console.log("Predicted usage: " + totalUse);
        let theTime = -1;
        setSecondsPassed((prev) => {
          theTime = prev + 1;
          console.log("Seconds Passed: " + theTime);
          return prev + 1;
        });
        chartRef.current?.plotNewPoint(totalUse, theTime, true);
      }
    }
  };

  //we have this run only once on mount. Basically runs every second
  useEffect(() => {
    //set a function to run every second. 1000 ms = 1 second
    const interval = setInterval(async () => {
      if (beginPredictions) {
        clearInterval(interval);
        intervalRef.current = null;
        return;
      }

      //set the new value of this variable. Because this function only loads on mount, have to tkae in preivous value automatically and draw that to increment
      let theTime = -1;
      setSecondsPassed((prev) => {
        theTime = prev + 1;
        console.log("Seconds Passed: " + theTime);
        return prev + 1;
      });

      const response = await axios.get(
        "http://localhost:5001/python/get_iot_snapshot",
      );
      const iot_data = response.data;
      let totalEnergy = 0;
      for (let iot of iot_data) {
        addSensorData((prev) => {
          prev[iot.id] = [...(prev[iot.id] || []), iot];
          console.log(prev);
          return prev;
        });
        totalEnergy += iot.power_use;
      }
      console.log(iot_data);
      console.log(totalEnergy);
      //use our reference to call the function in teh child component
      chartRef.current?.plotNewPoint(totalEnergy, theTime, false);
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

  const startPredictions = async () => {
    setPredictions(true);
    predictFunct();
  };

  //when secondsPassed changes, check if it's over 30, if it is then we can display button asking to predict data
  useEffect(() => {
    if (secondsPassed >= 30) {
      setPredictPrompt(true);
    }
  }, [secondsPassed]);

    const redirectFunction = async() => {
        //checks if we're actually not logged in, and we need to go back to the main menu
        if(username === null || username === "")
        {
            router.push("/")
        }
    }
    
    redirectFunction()

    const checkIfFirebaseData = async() => {
      const response = await axios.post(process.env.NEXT_PUBLIC_URL + "/users/check_if_results", {
        username: username
      })
      const data = response.data
      //if fail, assume for now that the error was just because snapshot fialed, and so user doesn't have resutls yet and has to bgo back to the main page
      setHasResultsData(data.success)
    }
    checkIfFirebaseData()
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
          overflowY: "auto",
        }}
      >
        {/* Sidebar */}
        <Sidebar currentTab={"Estimates"} hasResultsData={hasResultsData} />
        {/* Main Content */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            p: 4,
            gap: "8px",
          }}
        >
          <Box sx={{ height: 500, width: 800 }}>
            {/* Setting ref this way so that we can access the iot chart component from chartRef */}
            <LiveIOTChart ref={chartRef} />
          </Box>

          {displayPredictPrompt ? (
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
          ) : (
            <p>Wait for more data...</p>
          )}
        </Box>
      </Box>
    </ThemeProvider>
  );
}
