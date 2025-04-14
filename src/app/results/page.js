'use client'
import {React, use, useState} from "react";
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

export default function Results() 
{
  const [dataDate, setDate] = useState("")
  const [solarCost, setSolarCost] = useState(0)
  const [geminiResponse, setGeminiResponse] = useState("")
  const [moneySaved, setMoneySaved] = useState("")
  const [estEnergyUse, setEstEnergyUse] = useState("")
  const [monthlyCost, setMonthlyCost] = useState(0)
  const [panels, setPanels] = useState(0)

  
  //gets the data stored in firebase
  const getFirebaseData = async() => {
    const response = await axios.post("http://localhost:5000/users/get_energy_usage", {
      username: localStorage.getItem("username")
    })
    const data = response.data
    setDate(data.date)
    setSolarCost(data.solarCost)
    setGeminiResponse(data.geminiResponse)
    setMoneySaved(data.moneySaved)
    setEstEnergyUse(data.energyUsed)
    setMonthlyCost(data.monthlyCost)
    setPanels(data.panels)
  }

  //to log out the user when they press the according button
  const logoutUser = async() => {
      localStorage.setItem("username", "")
      redirectFunction()
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
            justifyContent: "center",
            alignItems: "center",
            p: 4,
            gap:"8px"
          }}
        >
            <Box sx={{ height: 500, width: 800 }}>
            <LiveEnergyChart />
            </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};