'use client'
import React from "react";
import Link from 'next/link';  // Use Next.js Link
import LiveEnergyChart from "../components/LiveEnergyChart";
import FadeInOnScroll from "../components/FadeInOnScroll";
import { Button, CssBaseline, Box, Typography, Grid } from "@mui/material";

export default function LandingPage () {
  let username = ""
  if (typeof window !== 'undefined') {
    username = localStorage.getItem("username");
  }
  return (
    <>
      <CssBaseline />
      <Box
        sx={{
          backgroundColor: "rgb(0, 0, 0)",
          minHeight: "100vh",
          position: "relative",
          paddingX: 6,
          paddingY: 8,
        }}
      >
        {/* Fixed Logo */}
        <Box sx={{ position: "absolute", top: 20, left: 100 }}>
          <img src="EcoTrack.svg" alt="EcoTrack Logo" width="180px" />
        </Box>

        {/* Sign In Button */}
        {
          //check if they have a username, display certain elements accordingly
          (username === null || username === "") ? 
          //when they're not signed in
          <Box sx={{ position: "absolute", top: 90, right: 170 }} display="flex" gap={2}>
            <Button
              variant="contained"
              sx={{
                fontFamily: "Quicksand, sans-serif",
                fontWeight: 500,
                textTransform: "none",
                borderRadius: 2.5,
                paddingX: 2.5,
                paddingY: 1,
                background: "linear-gradient(90deg, #3DC787 0%, #55C923 100%)",
                boxShadow: "0 4px 20px rgba(85, 201, 35, 0.4)",
                "&:hover": {
                  background: "linear-gradient(90deg, #55C923 0%, #3DC787 100%)",
                  boxShadow: "0 6px 24px rgba(85, 201, 35, 0.6)",
                },
              }}
              component = {Link} 
              href = "/login"
            >
              Sign In
            </Button>
            <Button
              variant="contained"
              sx={{
                fontFamily: "Quicksand, sans-serif",
                fontWeight: 500,
                textTransform: "none",
                borderRadius: 2.5,
                paddingX: 2.5,
                paddingY: 1,
                background: "linear-gradient(90deg, #3DC787 0%, #55C923 100%)",
                boxShadow: "0 4px 20px rgba(85, 201, 35, 0.4)",
                "&:hover": {
                  background: "linear-gradient(90deg, #55C923 0%, #3DC787 100%)",
                  boxShadow: "0 6px 24px rgba(85, 201, 35, 0.6)",
                },
              }}
              component = {Link} 
              href = "/register"
            >
              Register
            </Button>
         </Box>
         //when they are signed in
        : 
        <Box sx={{ position: "absolute", top: 90, right: 170 }}>
         <Button
            variant="contained"
            sx={{
              fontFamily: "Quicksand, sans-serif",
              fontWeight: 500,
              textTransform: "none",
              borderRadius: 2.5,
              paddingX: 2.5,
              paddingY: 1,
              background: "linear-gradient(90deg, #3DC787 0%, #55C923 100%)",
              boxShadow: "0 4px 20px rgba(85, 201, 35, 0.4)",
              "&:hover": {
                background: "linear-gradient(90deg, #55C923 0%, #3DC787 100%)",
                boxShadow: "0 6px 24px rgba(85, 201, 35, 0.6)",
              },
            }}
            component = {Link} 
            href = "/main"
          >
            Dashboard
          </Button>
        </Box>
       }

        {/* Centered Content */}
        <Box sx={{ mt: 16 }}>
          {/* Fade-in Heading */}
          <FadeInOnScroll>
            <Typography
              variant="h2"
              sx={{
                fontFamily: "Quicksand, sans-serif",
                fontSize: 44,
                textAlign: "center",
                background:
                  "linear-gradient(90deg, #3DC787 0%, #55C923 35%, #3DC787 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontWeight: 300,
                mb: 10,
              }}
            >
              Optimize Your Grid
            </Typography>
          </FadeInOnScroll>

          {/* Chart + Text Row */}
          <FadeInOnScroll>
            <Grid
              container
              spacing={6}
              alignItems="center"
              justifyContent="center"
              sx={{ mb: 10 }}
            >
              <Grid item xs={12} md={6}>
                <Box sx={{ height: 500 }}>
                  <LiveEnergyChart />
                </Box>
              </Grid>
              <Grid item xs={12} md={5}>
                <Typography
                  sx={{
                    fontFamily: "Quicksand, sans-serif",
                    fontSize: 18,
                    color: "#ccc",
                    lineHeight: 1.6,
                  }}
                >
                  Track real-time energy usage across your systems, helping you
                  identify trends and reduce power waste instantly — making your
                  grid smarter and greener.
                </Typography>
              </Grid>
            </Grid>
          </FadeInOnScroll>

          {/* Analytics + Text Row */}
          <FadeInOnScroll delay={0.5}>
            <Grid
              container
              spacing={6}
              alignItems="center"
              justifyContent="center"
              direction={{ xs: "column-reverse", md: "row" }}
            >
              <Grid item xs={12} md={5}>
                <Typography
                  sx={{
                    fontFamily: "Quicksand, sans-serif",
                    fontSize: 18,
                    color: "#ccc",
                    lineHeight: 1.6,
                  }}
                >
                  Dive into historical analytics to find usage patterns, spot
                  inefficiencies, and make informed decisions backed by data.
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <img
                    src="analytics.svg"
                    alt="analytics visual"
                    width="100%"
                    style={{ maxWidth: 500 }}
                  />
                </Box>
              </Grid>
            </Grid>
          </FadeInOnScroll>
        </Box>
      </Box>
    </>
  );
};
