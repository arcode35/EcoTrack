"use client";
import { React, useState } from "react";
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
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import LiveEnergyChart from "../../components/LiveEnergyChart";
import Link from "next/link";
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
  const [latitude, setLatitude] = useState();
  const [longitude, setLongitude] = useState();

  const [disabled, setDisabled] = useState(false);
  const [fetchingText, setFetchingText] = useState("");

  const testPythonCall = async () => {
    const response = await axios.get(
      "http://localhost:5001/python/message",
      {}
    );
    const result = await response.data;
    console.log(result);
  };

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

  //gets the solar data using latittude and longitude
  const getSolarData = async () => {
    const response = await axios.post("http://localhost:5000/solar/getData", {
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
      console.log(data.data);
    }
  };

  // resume here 4/2 link this async method to the button click and see what is printed out
  const getTemperatureData = async () => {
    const response = await axios.post("http://localhost:5000/weather/getData", {
      latitude,
      longitude,
    });

    const data = await response.data;

    if (data.success === false) {
      console.log(data.error);
      alert("Failed to get data: " + data.error.message);
    } else {
      console.log(data);
    }
  };

  // 26.43073184806582, 0.30785369196363715
  // 4/6 implement CDD65, HDD30YR_PUB, and CDD30YR_PUB
  // with the temperature we can calculate HDD65, CDD65, HDD30YR_PUB, and CDD30YR_PUB
  const getMeteoData = async () => {
    // get the date that this button was pressed to generate the time range for the api call

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

    const url = `https://archive-api.open-meteo.com/v1/archive?latitude=64.50&longitude=-50.07&start_date=${startDate}&end_date=${endDate}&daily=weather_code,temperature_2m_max,temperature_2m_min&temperature_unit=fahrenheit`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        console.log(response);
        alert(response.status);
      } else {
        const data = await response.json();
        console.log(data);
        console.log(
          calcHDD65(
            data.daily.temperature_2m_max,
            data.daily.temperature_2m_min
          ),
          " - HDD65 for the past year"
        );
        console.log(
          calcCDD65(
            data.daily.temperature_2m_max,
            data.daily.temperature_2m_min
          ),
          " - CDD65 for the past year"
        );
      }
    } catch (error) {
      alert(error);
    }
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

  // 4/7 fetch once between 4/7/1981 to 3/31/2010 => 10585 days = 29 years
  // then calculate each HDD65 for each year 29 times
  // divide by 29 to get this parameter
  async function HDD30YR_PUB(maxTemps, minTemps) {
    setDisabled(true);
    setFetchingText("Fetching...");
    let HDD65 = 0; // at the end divide by 29 to get 30 year average HDD30YR

    // returns min & max temperatures for 10,585 days or 29 years
    let url =
      "https://archive-api.open-meteo.com/v1/archive?latitude=32.23&longitude=-96.712&start_date=1981-04-07&end_date=2010-03-30&daily=weather_code,temperature_2m_max,temperature_2m_min&temperature_unit=fahrenheit";

    try {
      const response = await fetch(url);

      if (!response.ok) {
        alert("There was an error fetching data for 29 years");
        return -1;
      } else {
        const data = await response.json();
        console.log(data);
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

    console.log(HDD65 / 29);
    setDisabled(false);
    setFetchingText("");
    return HDD65 / 29;
  }

  async function CDD30YR_PUB() {
    let CDD65 = 0;

    let url =
      "https://archive-api.open-meteo.com/v1/archive?latitude=32.23&longitude=-96.712&start_date=1981-04-07&end_date=2010-03-30&daily=weather_code,temperature_2m_max,temperature_2m_min&temperature_unit=fahrenheit";

    try {
      const response = await fetch(url);

      if (!response.ok) {
        alert("An error occurred while fetching the url");
        return -1;
      } else {
        const data = await response.json();

        for (let i = 0; i < 10585; i++) {
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

    console.log(CDD65 / 29);

    return CDD65 / 29;
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
          <p></p>
          <Divider sx={{ width: "100%", borderColor: "#333", my: 2 }} />
          <List sx={{ width: "100%" }}>
            <Link href="/input" passHref>
              <ListItem button>
                <ListItemIcon sx={{ color: "#55c923" }}>
                  <LightbulbIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Assess your usage"
                  primaryTypographyProps={{ fontWeight: 600 }}
                />
              </ListItem>
            </Link>
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
            gap: "8px",
          }}
        >
          <Box sx={{ height: 500, width: 800 }}>
            <LiveEnergyChart />
          </Box>
          <Button
            onClick={testPythonCall}
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
            Send Python Data
          </Button>

          <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
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
            <TextField
              sx={{ backgroundColor: "white" }}
              size="small"
              placeholder="Latitude Coords"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
            ></TextField>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
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
            <TextField
              sx={{ backgroundColor: "white" }}
              size="small"
              placeholder="Longitude Coords"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
            ></TextField>
          </Box>

          <Button
            onClick={getSolarData}
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
            Get Solar Data (input lattitude and longitude first)
          </Button>

          <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
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
            <TextField
              sx={{ backgroundColor: "white" }}
              size="small"
              placeholder="Latitude Coords"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
            ></TextField>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
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
            <TextField
              sx={{ backgroundColor: "white" }}
              size="small"
              placeholder="Longitude Coords"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
            ></TextField>
          </Box>

          <Button
            onClick={getTemperatureData}
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
            Grab Weather Data
          </Button>

          <Button
            onClick={HDD30YR_PUB}
            variant="contained"
            sx={{
              textTransform: "none",
              background: "linear-gradient(90deg, #3DC787 0%, #55C923 100%)",
              boxShadow: "0 4px 20px rgba(85, 201, 35, 0.3)",
              "&:hover": {
                background: "linear-gradient(90deg, #55C923 0%, #3DC787 100%)",
              },
              width: 175,
            }}
            disabled={disabled}
          >
            {fetchingText ? fetchingText : "Grab open meteo data"}
          </Button>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
