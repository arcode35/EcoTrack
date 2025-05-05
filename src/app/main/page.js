"use client";
import { React, useEffect, useState, useRef } from "react";
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
  Grid,
  Card,
  CardContent,
  IconButton,
} from "@mui/material";
import DevicesIcon from "@mui/icons-material/Devices";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import SavingsIcon from "@mui/icons-material/Savings";
import DevicesCard from "@/components/DevicesCard";
import AddIcon from "@mui/icons-material/Add";
import BarChartIcon from "@mui/icons-material/BarChart";
import InsightsIcon from "@mui/icons-material/Insights";
import ScheduleIcon from "@mui/icons-material/Schedule";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import BoltIcon from "@mui/icons-material/Bolt";
import SpaIcon from "@mui/icons-material/Spa";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import LiveEnergyChart from "../../components/LiveEnergyChart";
import Link from "next/link";
import FadeInOnScroll from "../../components/FadeInOnScroll";
import Sidebar from "@/components/Sidebar";
import MonthlyEnergyChart from "@/components/MonthlyEnergyChart";
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

export default function Main() {
  const [openDevicesForm, setOpenDevicesForm] = useState(false);  
  const [hasResultsData, setHasResultsData] = useState(false);
  const router = useRouter()
  //function that checks if user already has gotten a data snapshot before. If so, sets hasData to true, otherwise remains false
  const checkIfFirebaseData = async() => {
      const response = await axios.post("http://localhost:5002/users/check_if_results", {
        username: localStorage.getItem("username")
      })
      const data = response.data
      //if fail, assume for now that the error was just because snapshot fialed, and so user doesn't have resutls yet and has to bgo back to the main page
      setHasResultsData(data.success)
  }
  checkIfFirebaseData()

  const redirectFunction = async () => {
    //checks if we're actually not logged in, and we need to go back to the main menu
    if (
      localStorage.getItem("username") === null ||
      localStorage.getItem("username") === ""
    ) {
      router.push("/")
    }
  };
  redirectFunction();

  const cardStyle = {
    backdropFilter: "blur(10px)",
    backgroundColor: "rgba(17, 17, 17, 0.6)",
    border: "1px solid rgba(85, 201, 35, 0.3)",
    transition: "transform 0.3s, box-shadow 0.3s",
    "&:hover": {
      transform: "scale(1.015)",
      boxShadow: "0 0 25px #55C923",
    },
    color: "#fff",
    borderRadius: 3,
    boxShadow: "0 0 12px #55C923",
  };

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
        <Sidebar currentTab={"Home Page"} hasResultsData={hasResultsData}/>

        {/* Main Content */}
        <Box
          sx={{
            display: "flex",
            minHeight: "100vh",
            bgcolor: "#000",
            color: "#fff",
            flexDirection: "column",
            p: 4,
          }}
        >
          {/* Background Glow */}
          <Box
            sx={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              zIndex: -1,
              background:
                "radial-gradient(circle at 20% 20%, #55C92322 0%, #000 60%)",
              animation: "pulseBG 10s ease-in-out infinite",
              "@keyframes pulseBG": {
                "0%": { opacity: 1 },
                "50%": { opacity: 0.7 },
                "100%": { opacity: 1 },
              },
            }}
          />

          {/* Page Title */}
          <Typography
            variant="h4"
            mb={3}
            sx={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              borderRight: "2px solid #55C923",
              width: "16.6ch",
              animation: "typing 2.5s steps(24), blink 0.6s step-end infinite",
              "@keyframes typing": {
                from: { width: 0 },
              },
              "@keyframes blink": {
                "50%": { borderColor: "transparent" },
              },
            }}
          >
            Dashboard Overview
          </Typography>

          {/* Responsive Grid */}
          <Grid container spacing={6} md={4}>
            {/* Live Energy Usage */}
            <Grid item xs={12} md={8}>
              <Card sx={{ ...cardStyle, height: 500, width: 1000 }}>
                {" "}
                {/* or any height you prefer */}
                <Typography variant="h6" p={2}>
                  Live Energy Usage
                </Typography>
                <Box sx={{ height: "calc(100% - 60px)", px: 5 }}>
                  <LiveEnergyChart height="100%" />
                </Box>
              </Card>
            </Grid>

            {/* Monthly Energy Usage */}
            <Grid item xs={12} md={4}>
              <Card sx={{ ...cardStyle, height: 500, width: 500 }}>
                <Typography variant="h6" p={2}>
                  Monthly Energy Usage
                </Typography>
                <Box sx={{ height: "calc(100% - 60px)", px: 2 }}>
                  <MonthlyEnergyChart />
                </Box>
              </Card>
            </Grid>
            {/* Estimated Optimization */}
            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ ...cardStyle, height: 300, width: 450 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Estimated Optimization
                  </Typography>
                  <TrendingUpIcon
                    sx={{ fontSize: 36, color: "#55C923", mb: 1 }}
                  />
                  <Typography
                    variant="h4"
                    sx={{
                      background:
                        "linear-gradient(90deg, #3DC787 0%, #55C923 20%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    15%
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    You can reduce your energy consumption by:
                  </Typography>
                  <ul
                    style={{
                      marginTop: 8,
                      paddingLeft: 20,
                      fontSize: "0.9rem",
                    }}
                  >
                    <li>Turning off idle appliances</li>
                    <li>Using LED lighting</li>
                    <li>Running appliances during off-peak hours</li>
                    <li>Setting smart schedules for HVAC</li>
                  </ul>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Grid container spacing={3} mt={5}>
            {/* Real-time Usage */}
            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ ...cardStyle, width: 330 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Real-time Usage
                  </Typography>
                  <FlashOnIcon
                    sx={{
                      fontSize: 36,
                      color: "yellow",
                      animation: "pulse 2s infinite",
                      "@keyframes pulse": {
                        "0%": { transform: "scale(1)" },
                        "50%": { transform: "scale(1.1)", opacity: 0.7 },
                        "100%": { transform: "scale(1)" },
                      },
                    }}
                  />
                  <Typography variant="h4" color="yellow">
                    1.2 kWh
                  </Typography>
                  <Typography variant="body2">Current Power Draw</Typography>
                </CardContent>
              </Card>
            </Grid>
            {/* Estimated Savings */}
            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ ...cardStyle, width: 330 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Estimated Savings
                  </Typography>
                  <SavingsIcon sx={{ fontSize: 36, color: "#55C923" }} />
                  <Typography variant="h4" color="green">
                    $48/mo
                  </Typography>
                  <Typography variant="body2">Based on usage trends</Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Devices Active */}
            <Grid item xs={12} sm={6} md={4}>
              <Box onClick={() => setOpenDevicesForm(true)}>
                <Card sx={{ ...cardStyle, width: 350, height: 185 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Devices Active
                    </Typography>
                    <DevicesIcon sx={{ fontSize: 32, color: "#55C923" }} />
                    <Typography variant="h5">5</Typography>
                    <Typography variant="body2">Connected Devices</Typography>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        mt: -3,
                        mr: 1,
                      }}
                    >
                      <IconButton
                        sx={{
                          bgcolor: "#55C923",
                          color: "#000",
                          "&:hover": {
                            bgcolor: "#44a91e",
                          },
                          boxShadow: "0 0 15px #55C923",
                        }}
                      >
                        <AddIcon />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            </Grid>
          </Grid>

          {/* Devices Form Modal */}
          {openDevicesForm && (
            <DevicesCard onClose={() => setOpenDevicesForm(false)} />
          )}
        </Box>
      </Box>
    </ThemeProvider>
  );
}
