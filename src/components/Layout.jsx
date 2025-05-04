// src/components/Layout.jsx
import React, { useState } from "react";
import { Box, CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

const theme = createTheme({
  typography: { fontFamily: "Quicksand, sans-serif" },
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

const Layout = () => {
  const [currentTab, setCurrentTab] = useState(null);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          minHeight: "100vh",
          bgcolor: "#000",
          color: "#fff",
        }}
      >
        <Sidebar currentTab={currentTab} setCurrentTab={setCurrentTab} />
        <Box sx={{ flex: 1, p: 4, overflow: "auto" }}>
          <Outlet />{" "}
          {/* This renders the child route like Dashboard or Results */}
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Layout;