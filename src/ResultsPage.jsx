import React, { useRef } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Divider,
} from "@mui/material";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

const ResultsPage = () => {
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

  const currentDate = new Date().toLocaleDateString();

  return (
    <Box sx={{ p: 4, bgcolor: "#000", color: "#fff", minHeight: "100vh" }}>
      <Typography variant="h4" gutterBottom>
        Energy Report Summary
      </Typography>
      <Typography variant="body2" sx={{ mb: 3, color: "#aaa" }}>
        Date Generated: {currentDate}
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
                  320 kWh
                </Typography>
                <Typography variant="body2">
                  Based on data tracked from smart meters this month.
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
                  $96.00
                </Typography>
                <Typography variant="body2">
                  Calculated at $0.30 per kWh.
                </Typography>
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
                  $48.00
                </Typography>
                <Typography variant="body2">
                  You saved about 15% this month by applying optimizations.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ bgcolor: "#1e1e1e", color: "#fff" }}>
              <CardContent>
                <Typography variant="subtitle2" color="#aaa">
                  Optimization Tips Applied
                </Typography>
                <ul style={{ paddingLeft: "1.2rem", marginTop: 8 }}>
                  <li>Turned off idle appliances</li>
                  <li>Used LED lighting</li>
                  <li>Scheduled heavy loads during off-peak hours</li>
                  <li>Smart thermostat optimization</li>
                </ul>
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
  );
};

export default ResultsPage;
