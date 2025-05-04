import React from "react";
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Button,
  Typography
} from "@mui/material";
import {
  BarChart as BarChartIcon,
  Insights as InsightsIcon,
  MonetizationOn as MonetizationOnIcon,
  Bolt as BoltIcon,
  Schedule as ScheduleIcon,
  Spa as SpaIcon,
} from "@mui/icons-material";

const Sidebar = ({ currentTab, hasResultsData }) => {
  const menuItems = [
    { icon: <SpaIcon />, label: "Home Page", link: "/main" },
    { icon: <MonetizationOnIcon />, label: "Input New Data", link: "/input" },
    { icon: <BarChartIcon />, label: "Check Devices", link: "/iot"},
    { icon: <BoltIcon />, label: "Usage Tips", link: "/recommendations"},
  ];
  //if they have the results and its not already pushed, push it
  if(hasResultsData && menuItems.length != 6)
  {
    menuItems.push({ icon: <InsightsIcon />, label: "Reports", link: "results"})
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
      <Button
        onClick={() => {
            localStorage.setItem("username", "")
            window.location.href = "/"
        }}
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

      <Divider sx={{ width: "100%", borderColor: "#333", my: 1 }} />

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

      <Divider sx={{ width: "100%", borderColor: "#333", my: 1 }} />

      <List sx={{ width: "100%" }}>
        {menuItems.map((item, index) => (
          <ListItem
            button
            key={index}
            selected={currentTab === index}
            onClick={() => {
              console.log(item.label)
              if(currentTab != item.label)
              {
                window.location.href = item.link
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