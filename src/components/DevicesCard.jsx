// src/components/DevicesCard.jsx
import React, { useState } from "react";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { Card, Typography, Box, Button, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const inputStyle = {
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #55C923",
  backgroundColor: "#111",
  color: "#fff",
  fontSize: "1rem",
  outline: "none",
  fontFamily: "Quicksand, sans-serif",
};

const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  height: "100%",
  width: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.75)",
  zIndex: 9999,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const DevicesCard = ({ onClose }) => {
  const [deviceName, setDeviceName] = useState("");
  const [energyUsage, setEnergyUsage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Device: ${deviceName}, Usage: ${energyUsage} kWh`);
    setDeviceName("");
    setEnergyUsage("");
  };

  return (
    <Box sx={overlayStyle}>
      <Card
        sx={{
          width: 400,
          p: 3,
          bgcolor: "#111",
          border: "1px solid #55C923",
          borderRadius: 3,
          boxShadow: "0 0 20px #55C923",
          color: "#fff",
          position: "relative",
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            color: "#55C923",
          }}
        >
          <CloseIcon />
        </IconButton>

        <Typography variant="h6" gutterBottom>
          Add New Device
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}
        >
          <input
            type="text"
            placeholder="Device Name"
            value={deviceName}
            onChange={(e) => setDeviceName(e.target.value)}
            style={inputStyle}
            required
          />
          <input
            type="number"
            placeholder="Energy Usage (kWh)"
            value={energyUsage}
            onChange={(e) => setEnergyUsage(e.target.value)}
            style={inputStyle}
            required
          />
          <Button
            type="submit"
            variant="contained"
            sx={{
              bgcolor: "#55C923",
              color: "#000",
              fontWeight: "bold",
              "&:hover": { bgcolor: "#44a91e" },
            }}
          >
            Add Device
          </Button>
        </Box>
      </Card>
    </Box>
  );
};

export default DevicesCard;