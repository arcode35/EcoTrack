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
import FadeInOnScroll from "../../components/FadeInOnScroll";
import Sidebar from "@/components/Sidebar";
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
    //function that checks if user already has gotten a data snapshot before. If so, sets hasData to true, otherwise remains false
    const checkIfFirebaseData = async() => {
      const response = await axios.post("http://localhost:5002/users/check_if_results", {
        username: localStorage.getItem("username")
      })
      const data = response.data
      //if fail, assume for now that the error was just because snapshot fialed, and so user doesn't have resutls yet and has to bgo back to the main page
      return data.success
    }

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
        <Sidebar currentTab={"Home Page"} hasResultsData={checkIfFirebaseData}/>

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
        </Box>
      </Box>
    </ThemeProvider>
  );
}
