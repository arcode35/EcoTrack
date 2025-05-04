import React from "react";
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import {
  BarChart as BarChartIcon,
  Insights as InsightsIcon,
  MonetizationOn as MonetizationOnIcon,
  Bolt as BoltIcon,
  Schedule as ScheduleIcon,
  Spa as SpaIcon,
} from "@mui/icons-material";
import logo from "../assets/EcoTrack.svg";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ currentTab, setCurrentTab, hasResultsData }) => {
  const navigate = useNavigate();

  const menuItems = [
    { icon: <BarChartIcon />, label: "Dashboard" },
    { icon: <InsightsIcon />, label: "Reports" },
    { icon: <MonetizationOnIcon />, label: "Cost Estimates" },
    { icon: <BoltIcon />, label: "Usage Tips" },
    { icon: <ScheduleIcon />, label: "Schedule" },
    { icon: <SpaIcon />, label: "Home Page" },
  ];

  return (
    <Box
      sx={{
        width: 240,
        background: "linear-gradient(180deg, #0a0a0a 0%, #111 100%)",
        p: 3,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
        borderRight: "1px solid #222",
        boxShadow: "4px 0 20px rgba(85, 201, 35, 0.2)",
      }}
    >
      <Box
        sx={{
          mb: 2,
          borderRadius: 2,
          px: 2,
          background: "rgba(85, 201, 35, 0.05)",
          boxShadow: "0 0 10px #55c92355",
          height: 90,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <img src={logo} alt="EcoTrack Logo" width="140px" />
      </Box>

      <Divider sx={{ width: "100%", borderColor: "#333", my: 1 }} />

      <List sx={{ width: "100%" }}>
        {menuItems.map((item, index) => (
          <ListItem
            button
            key={index}
            selected={currentTab === index}
            onClick={() => {
              setCurrentTab(index);
              if (item.label === "Dashboard") navigate("/dashboard");
              if (item.label === "Reports") navigate("/results");
            }}
            sx={{
              borderRadius: 2,
              px: 2,
              py: 1.5,
              my: 1,
              position: "relative",
              color: "#fff",
              backgroundColor: currentTab === index ? "#1a1a1a" : "inherit",
              transition: "0.3s ease",
              "&::before": {
                content: '""',
                position: "absolute",
                left: 0,
                top: 0,
                height: "100%",
                width: "5px",
                backgroundColor: "#55C923",
                borderTopRightRadius: 4,
                borderBottomRightRadius: 4,
                opacity: currentTab === index ? 1 : 0,
                transition: "opacity 0.3s ease",
              },
              "&:hover::before": { opacity: 1 },
              "&:hover": { backgroundColor: "#1a1a1a" },
            }}
          >
            <ListItemIcon sx={{ color: "#55C923", minWidth: "36px" }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.label}
              primaryTypographyProps={{ fontWeight: 600 }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Sidebar;