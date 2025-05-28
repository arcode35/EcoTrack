"use client";
import { React, useState } from "react";
import Link from "next/link";
import axios from "axios";
import {
  Box,
  CssBaseline,
  TextField,
  Button,
  Typography,
  Paper,
  AppBar,
  Toolbar,
} from "@mui/material";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter()

  //if user is logged in and they somehow get to this page, send them back until they press the logout button
  if(typeof window !== "undefined")
  {
    if (localStorage.getItem("username") !== null && localStorage.getItem("username") !== "") 
    {
      router.push("/main")
    }  
  }

  // This is the function sending the username and passwrod to the backend.
  // 3/16 line 23 is undefined
  const sendLoginInfo = async () => {
    try {
      const response = await axios.post(
        process.env.URL + "/users/login_user",
        {
          username,
          password,
        }
      );
      //This will be a button directing users to the login.
      const responseData = await response.data;
      //if we're able to log them in, put their name in storage (so even if they refresh, username will still be there)
      if (response.data.success) {
        console.log("Login succeded!");
        if(typeof window !== "undefined")
        {
          localStorage.setItem("username", username);
        }

        router.push("/main")
      } else {
        alert(responseData.message);
      }
    } catch (error) {
      console.log("error communciating with backend!");
    }
  };

  return (
    <>
      <CssBaseline />
      {/* Toolbar with Back & Sign Up buttons */}
      <AppBar position="static" sx={{ background: "black" }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Button
            variant="contained"
            component={Link}
            href="/"
            sx={{
              textTransform: "none",
              background: "linear-gradient(90deg, #3DC787 0%, #55C923 100%)",
              boxShadow: "0 4px 20px rgba(85, 201, 35, 0.3)",
              "&:hover": {
                background: "linear-gradient(90deg, #55C923 0%, #3DC787 100%)",
              },
            }}
          >
            Back To Home
          </Button>
          <Button
            variant="contained"
            component={Link}
            href="/register"
            sx={{
              textTransform: "none",
              background: "linear-gradient(90deg, #3DC787 0%, #55C923 100%)",
              boxShadow: "0 4px 20px rgba(85, 201, 35, 0.3)",
              "&:hover": {
                background: "linear-gradient(90deg, #55C923 0%, #3DC787 100%)",
              },
            }}
          >
            Create Account
          </Button>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          backgroundColor: "rgb(0, 0, 0)",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: 2,
        }}
      >
        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Paper
            elevation={4}
            sx={{
              padding: 5,
              borderRadius: 4,
              background: "rgba(255, 255, 255, 0.03)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              color: "#fff",
              width: 400,
              textAlign: "center",
            }}
          >
            <Box mb={3}>
              <img src="EcoTrack.svg" alt="EcoTrack Logo" width="100px" />
            </Box>
            <Typography
              variant="h5"
              sx={{
                fontFamily: "Quicksand, sans-serif",
                fontWeight: 500,
                mb: 3,
              }}
            >
              Log In
            </Typography>
            <Box component="form" noValidate autoComplete="off" sx={{ mt: -2 }}>
              <TextField
                fullWidth
                placeholder="Username here"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                variant="outlined"
                margin="normal"
                InputLabelProps={{
                  style: { color: "#aaa", fontFamily: "Quicksand, sans-serif" },
                }}
                InputProps={{ style: { fontFamily: "Quicksand, sans-serif" } }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    color: "#fff",
                    "& fieldset": {
                      borderColor: "#808080", // default
                    },
                    "&:hover fieldset": {
                      borderColor: "#55C923", // on hover
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#55C923", // on focus
                    },
                  },
                }}
              />

              <TextField
                fullWidth
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                variant="outlined"
                margin="normal"
                InputLabelProps={{
                  style: { color: "#aaa", fontFamily: "Quicksand, sans-serif" },
                }}
                InputProps={{ style: { fontFamily: "Quicksand, sans-serif" } }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    color: "#fff",
                    "& fieldset": {
                      borderColor: "#808080", // default
                    },
                    "&:hover fieldset": {
                      borderColor: "#55C923", // on hover
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#55C923", // on focus
                    },
                  },
                }}
              />
              <Button
                fullWidth
                variant="contained"
                onClick={sendLoginInfo}
                sx={{
                  mt: 3,
                  fontFamily: "Quicksand, sans-serif",
                  textTransform: "none",
                  fontWeight: 500,
                  background:
                    "linear-gradient(90deg, #3DC787 0%, #55C923 100%)",
                  boxShadow: "0 4px 20px rgba(85, 201, 35, 0.3)",
                  "&:hover": {
                    background:
                      "linear-gradient(90deg, #55C923 0%, #3DC787 100%)",
                  },
                }}
              >
                Log In
              </Button>
            </Box>
          </Paper>
        </motion.div>
      </Box>
    </>
  );
}
