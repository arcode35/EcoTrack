import React, { useState } from "react";
import {
  Box,
  Button,
  CssBaseline,
  Typography,
  Grid,
  Card,
  CardContent,
  ThemeProvider,
  createTheme,
  IconButton,
} from "@mui/material";
import DevicesIcon from "@mui/icons-material/Devices";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import SavingsIcon from "@mui/icons-material/Savings";
import AddIcon from "@mui/icons-material/Add";
import LiveEnergyChart from "../components/LiveEnergyChart";
import MonthlyEnergyChart from "../components/MonthlyEnergyChart";
import DevicesCard from "../components/DevicesCard";
import { useNavigate } from "react-router-dom";

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

export const Dashboard = () => {
  const navigate = useNavigate();
  const [openDevicesForm, setOpenDevicesForm] = useState(false);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      
    </ThemeProvider>
  );
};
