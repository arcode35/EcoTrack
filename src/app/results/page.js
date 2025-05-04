'use client'
import {React, use, useState, useRef} from "react";
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
  CardContent
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
  const [moneySaved, setMoneySaved] = useState(0)
  const [estEnergyUse, setEstEnergyUse] = useState(0)
  const [monthlyCost, setMonthlyCost] = useState(0)
  const [panels, setPanels] = useState(0)
  const reportRef = useRef();

  const handleDownloadPDF = async () => {
    const canvas = await html2canvas(reportRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: [canvas.width, canvas.height],
    });

    pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
    pdf.save("EcoTrack_Energy_Report.pdf");
  };

  
  //gets the data stored in firebase
  const getFirebaseData = async() => {
    console.log("how many times this running again?")
    const response = await axios.post("http://localhost:5002/users/get_energy_usage", {
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
        <Box sx={{ p: 4, bgcolor: "#000", color: "#fff", minHeight: "100vh" }}>
          <Typography variant="h4" gutterBottom>
            Energy Report Summary
          </Typography>
          <Typography variant="body2" sx={{ mb: 3, color: "#aaa" }}>
            Date Generated: {date}
          </Typography>

          <Box
            ref={reportRef}
            sx={{
              p: 3,
              backgroundColor: "#111",
              borderRadius: 2,
              boxShadow: "0 0 15px #55C92344",
            }}
          >
            <Typography variant="h6" sx={{ mb: 2 }}>
              Overview
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Card sx={{ bgcolor: "#1e1e1e", color: "#fff" }}>
                  <CardContent>
                    <Typography variant="subtitle2" color="#aaa">
                      Total Energy Usage
                    </Typography>
                    <Typography variant="h4" color="limegreen">
                      ${(estEnergyUse).toFixed(2)}
                    </Typography>
                    <Typography variant="body2">
                      Based on predicted data with machine learning this month.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card sx={{ bgcolor: "#1e1e1e", color: "#fff" }}>
                  <CardContent>
                    <Typography variant="subtitle2" color="#aaa">
                      Monthly Cost
                    </Typography>
                    <Typography variant="h4" color="orange">
                      ${(monthlyCost).toFixed(2)}
                    </Typography>
                    <Typography variant="body2">
                      Calculated at ${estEnergyUse / monthlyCost} kWh.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card sx={{ bgcolor: "#1e1e1e", color: "#fff" }}>
                  <CardContent>
                    <Typography variant="subtitle2" color="#aaa">
                      Solar Panels Used
                    </Typography>
                    <ul style={{ paddingLeft: "1.2rem", marginTop: 8 }}>
                      <li>Used {panels} Solar Panels</li>
                      <li>Solar Panel Cost Over 20 Years Was ${(solarCost).toFixed(2)}</li>
                      <li>Your Non-Solar Cost Over 20 Years Was ${(monthlyCost *12 * 20).toFixed(2)}</li>
                    </ul>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card sx={{ bgcolor: "#1e1e1e", color: "#fff" }}>
                  <CardContent>
                    <Typography variant="subtitle2" color="#aaa">
                      Estimated Savings
                    </Typography>
                    <Typography variant="h4" color="green">
                      ${(moneySaved).toFixed(2)}
                    </Typography>
                    <Typography variant="body2">
                      You would save this much over 20 years by using solar energy.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Divider sx={{ my: 3, borderColor: "#333" }} />

            <Typography variant="caption" sx={{ color: "#777" }}>
              This report was generated automatically by EcoTrack. For more details,
              visit your Dashboard.
            </Typography>
          </Box>

          <Button
            variant="contained"
            sx={{
              mt: 4,
              bgcolor: "#55C923",
              color: "#000",
              fontWeight: 600,
              "&:hover": { bgcolor: "#44a91e" },
            }}
            onClick={handleDownloadPDF}
          >
            Download PDF Report
          </Button>
      </Box>
      </Box>
    </ThemeProvider>
  );
};