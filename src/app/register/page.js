'use client'
import {React, useState} from "react";
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
  Toolbar
} from "@mui/material";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function Register() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const router = useRouter()

    if(typeof window !== "undefined")
    {
        //if user is logged in and they somehow get to this page, send them back until they press the logout button
        if(localStorage.getItem("username") !== null && localStorage.getItem("username") !== "")
        {
            router.push("/main")
        }
    }

    //Sends info for registration
    const sendRegisterInfo = async() => {
        console.log("port: " + process.env.NEXT_PUBLIC_PORT)
        const response = await axios.post(process.env.URL + "/users/create_user", {
            username: username,
            password: password,
        })
        //Gets back results of the backend call.
        const result = await response.data
        //if we're able to log them in, put their name in storage (so even if they refresh, username will still be there)
        if(result.success)
        {
            console.log("Registration successful!")
            if(typeof window !== "undefined")
            {
                localStorage.setItem("username", username)
            }
            router.push("/main")
        }
        else
        {
            alert(result.message)   
        }
    }

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
                    background:
                    "linear-gradient(90deg, #55C923 0%, #3DC787 100%)",
                },
                }}
            >
                Back To Home
            </Button>
            <Button
                variant="contained"
                component={Link}
                href="/login"
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
                Login
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
                Register
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
                    onClick={sendRegisterInfo}
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
                    Register
                </Button>
                </Box>
            </Paper>
            </motion.div>
        </Box>
        </>
    );
};