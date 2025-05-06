import React from "react";
import {
  Box,
  CssBaseline,
  TextField,
  Button,
  Typography,
  Paper,
} from "@mui/material";
import logo from "../assets/EcoTrack.svg";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export const LoginPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <CssBaseline />
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
              <img src={logo} alt="EcoTrack Logo" width="100px" />
            </Box>
            <Typography
              variant="h5"
              sx={{
                fontFamily: "Quicksand, sans-serif",
                fontWeight: 500,
                mb: 3,
              }}
            >
              Sign In
            </Typography>
            <Box component="form" noValidate autoComplete="off" sx={{ mt: -2 }}>
              <TextField
                fullWidth
                label="Email"
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
                label="Password"
                type="password"
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
                onClick={() => navigate("/dashboard")}
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
};
