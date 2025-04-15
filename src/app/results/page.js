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

export default function Results() 
{
  const [date, setDate] = useState("")
  const [solarCost, setSolarCost] = useState(0)
  const [geminiResponse, setGeminiResponse] = useState("")
  const [moneySaved, setMoneySaved] = useState(0)
  const [estEnergyUse, setEstEnergyUse] = useState(0)
  const [monthlyCost, setMonthlyCost] = useState(0)
  const [panels, setPanels] = useState(0)

  
  //gets the data stored in firebase
  const getFirebaseData = async() => {
    const response = await axios.post("http://localhost:5000/users/get_energy_usage", {
      username: localStorage.getItem("username")
    })
    const data = response.data
    //if fail, assume for now that the error was just because snapshot fialed, and so user doesn't have resutls yet and has to bgo back to the main page
    if(data.success == false)
    {
      returnToDataInput()
      return
    }
    const formattedDate = data.date
    console.log(formattedDate)
    setDate(formattedDate)
    setSolarCost(data.solarCost)
    setGeminiResponse(data.geminiResponse)
    setMoneySaved(Number(data.moneySaved))
    setEstEnergyUse(Number(data.energyUsed))
    setMonthlyCost(data.monthlyCost)
    setPanels(data.panels)
    // console.log("date: " + data.date + ", solar cost: " + data.solarCost + ", Gemini Response: " + 
    //   data.geminiResponse + ", money saved: " + data.moneySaved + ", energy used: " + data.energyUsed +
    //   ", monthly cost: " + data.monthlyCost + ", panels: " + data.panels)
  }
  getFirebaseData()

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

  getFirebaseData()

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
            <Box sx={{ height: 500, width: 800, alignItems: "center", display: "flex", flexDirection: "column", alignItems: "center"}}>
              <FadeInOnScroll>
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
                  Input New Data
                </Button>
              </FadeInOnScroll>
              <br/>
              <FadeInOnScroll>
                <Typography
                    sx={{
                        fontFamily: "Quicksand, sans-serif",
                        fontSize: 18,
                        color: "#ccc",
                        lineHeight: 1.6,
                    }}
                >
                    Data As Of: {date}
                </Typography>
              </FadeInOnScroll>
              <br/>
              <FadeInOnScroll>
                <Typography
                    sx={{
                        fontFamily: "Quicksand, sans-serif",
                        fontSize: 18,
                        color: "#ccc",
                        lineHeight: 1.6,
                    }}
                >
                    Predicted Energy Usage (for the month): {estEnergyUse.toFixed(0)} KiloWatts
                </Typography>
              </FadeInOnScroll>
              <br/>
              <FadeInOnScroll>
                <Typography
                    sx={{
                        fontFamily: "Quicksand, sans-serif",
                        fontSize: 18,
                        color: "#ccc",
                        lineHeight: 1.6,
                    }}
                >
                    Estimated Cost for the Month: ${monthlyCost.toFixed(2)} 
                </Typography>
              </FadeInOnScroll>
              <br/>
              <FadeInOnScroll>
                <Typography
                    sx={{
                        fontFamily: "Quicksand, sans-serif",
                        fontSize: 18,
                        color: "#ccc",
                        lineHeight: 1.6,
                    }}
                >
                    If Using {panels} Solar Panels, Spend ${solarCost.toFixed(2)} Over 20 Years, Saving ${moneySaved.toFixed(2)} Over That Time!
                </Typography>
              </FadeInOnScroll>
              <br/>
              <FadeInOnScroll>
                <Typography
                    sx={{
                        fontFamily: "Quicksand, sans-serif",
                        fontSize: 18,
                        color: "#ccc",
                        lineHeight: 1.6,
                    }}
                >
                    Suggestions On How To Save Money:
                </Typography>
              </FadeInOnScroll>
              <br/>
              <FadeInOnScroll>
                <Typography
                    sx={{
                        fontFamily: "Quicksand, sans-serif",
                        fontSize: 18,
                        color: "#ccc",
                        lineHeight: 1.6,
                    }}
                >
                        {geminiResponse}
                </Typography>
              </FadeInOnScroll>
            </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};