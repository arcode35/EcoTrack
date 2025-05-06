import React from "react";
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Button,
  Typography,
} from "@mui/material";
import {
  BarChart as BarChartIcon,
  Insights as InsightsIcon,
  MonetizationOn as MonetizationOnIcon,
  Bolt as BoltIcon,
  Schedule as ScheduleIcon,
  Spa as SpaIcon,
  AssesmentIcon as Ass,
} from "@mui/icons-material";

import AssessmentIcon from "@mui/icons-material/Assessment";

const Sidebar = ({ currentTab, hasResultsData }) => {
  const menuItems = [
    { icon: <BarChartIcon />, label: "Dashboard", link: "/main" },
    { icon: <SpaIcon />, label: "Energy Profile", link: "/input" },
    { icon: <InsightsIcon />, label: "Estimates", link: "/iot" },
  ];
  //if they have the results and its not already pushed, push it
  if (hasResultsData && menuItems.length != 6) {
    menuItems.push({
      icon: <AssessmentIcon />,
      label: "Reports",
      link: "results",
    });
    menuItems.push({
      icon: <BoltIcon />,
      label: "Usage Tips",
      link: "/recommendations",
    });
  }

  return (
    <Box
      sx={{
        width: 240,
        background: "linear-gradient(180deg, #0a0a0a 0%, #111 100%)",
        p: 3,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
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
        <img src={"EcoTrack.svg"} alt="EcoTrack Logo" width="140px" />
      </Box>

      <Divider sx={{ my: 2, width: "100%", borderColor: "#333" }} />

      <Box
        sx={{
          px: 2,
          py: 1.5,
          borderRadius: 2,
          background: "rgba(85, 201, 35, 0.08)",
          boxShadow: "inset 0 0 6px #55C92333",
          width: "100%",
          textAlign: "center",
        }}
      >
        <Typography
          sx={{
            fontFamily: "Quicksand, sans-serif",
            fontSize: 18,
            fontWeight: 600,
            color: "#55C923",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {localStorage.getItem("username") || "Guest"}
        </Typography>
      </Box>
      <Divider sx={{ mt: 2, width: "100%", borderColor: "#333" }} />

      <List sx={{ width: "100%", mb: 4 }}>
        {menuItems.map((item, index) => (
          <ListItem
            button
            key={index}
            selected={currentTab === item.label}
            onClick={() => {
              console.log(item.label);
              if (currentTab != item.label) {
                window.location.href = item.link;
              }
            }}
            sx={{
              cursor: "pointer",
              borderRadius: 2,
              px: 2,
              py: 1.5,
              my: 1,
              position: "relative",
              color: "#fff",
              backgroundColor:
                currentTab === item.label ? "#1a1a1a" : "inherit",
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
                opacity: currentTab === item.label ? 1 : 0,
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
      <Button
        onClick={() => {
          localStorage.setItem("username", "");
          window.location.href = "/";
        }}
        variant="contained"
        sx={{
          mb: 1,
          px: 3,
          py: 1.5,
          borderRadius: 4,
          bgcolor: "#55C923",
          color: "#000",
          fontWeight: 800,
          fontSize: 14,
          width: "75%",
          textAlign: "center",
          boxShadow: "0 4px 20px rgba(85, 201, 35, 0.3)",
          fontFamily: "Quicksand, sans-serif",
        }}
      >
        Sign Out
      </Button>
    </Box>
  );
};

export default Sidebar;
