"use client";

import axios from 'axios'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation';
import Link from 'next/link'
import {
  Box,
  CssBaseline,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ThemeProvider,
  createTheme,
  Button,
  TextField,
} from "@mui/material";
import BoltIcon from "@mui/icons-material/Bolt";
import ScheduleIcon from "@mui/icons-material/Schedule";
import SpaIcon from "@mui/icons-material/Spa";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import Sidebar from "@/components/Sidebar";

const theme = createTheme();

export default function Recommendations() {
  const router = useRouter();
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [onFirstMessage, setOnFirstMessage] = useState(true)
  const [messages, addMessages] = useState([])
  const [userMessage, setUserMessage] = useState("")

  const [estEnergyUse, setEstEnergyUse] = useState(0)
  const [monthlyCost, setMonthlyCost] = useState(0)

  let username = ""
  if(typeof window !== "undefined")
  {
    username = localStorage.getItem("username")
  }

    //gets the data stored in firebase
    const getFirebaseData = async() => {
      const response = await axios.post("http://localhost:5002/users/get_energy_usage", {
        username: username
      })
      const data = response.data
      //if fail, assume for now that the error was just because snapshot fialed, and so user doesn't have resutls yet and has to bgo back to the main page
      if(data.success == false)
      {
        router.push("/");
        return
      }
      const formattedDate = data.date
      setEstEnergyUse(Number(data.energyUsed))
      setMonthlyCost(data.monthlyCost)
    }

    if(estEnergyUse == 0)
    {
      getFirebaseData()
    }
    
    const redirectFunction = async() => {
        //checks if we're actually not logged in, and we need to go back to the main menu
        if(username === null || username === "")
        {
          router.push("/");
        }
    } 

    redirectFunction()
    const sendUserMessage = async() => {
      setLoading(true)
      addMessages(prev => {
        return [...prev, {type: "User", content: userMessage + "\n\n"}]
      })
      setUserMessage("")
      const response = await axios.post("http://localhost:5001/python/next_chat", {
        isFirstMessage: false,
        query: userMessage,
      },
    );
    const text = response.data;
    console.log(text.response);
    const recs = text.response
      .replace(/\*\*/g, "") // strip any leftover **
      .split(/\n\s*[\d\-\.\)]*\s*/) // split on numbered or dashed lines
      .map((l) => l.trim()) // trim whitespace
      .filter((l) => l); // drop empties
    setLoading(false);
    setOnFirstMessage(false);
    addMessages((prev) => {
      return [...prev, { type: "Bot", content: recs }];
    });
  };

  const beginChat = async (event) => {
    event.preventDefault(); // Prevents page reload
    setLoading(true);
    const response = await axios.post(
      "http://localhost:5001/python/next_chat",
      {
        isFirstMessage: true,
        energyUse: estEnergyUse,
        cost: monthlyCost,
      },
    );
    const text = response.data;
    console.log(text.response);
    const recs = text.response
      .replace(/\*\*/g, "") // strip any leftover **
      .split(/\n\s*[\d\-\.\)]*\s*/) // split on numbered or dashed lines
      .map((l) => l.trim()) // trim whitespace
      .filter((l) => l); // drop empties
    addMessages([{ type: "Bot", content: recs }]);
    setLoading(false);
    setOnFirstMessage(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          minHeight: "100vh",
          backgroundColor: "#000",
          color: "#fff",
        }}
      >
        <Sidebar currentTab={"Usage Tips"} hasResultsData={true} />

        {/* Main Content */}
        <Box sx={{ flex: 1, p: 4, overflowY: "auto" }}>
          <Box
            sx={{
              backgroundColor: "#111",
              border: "1px solid #55C923",
              borderRadius: 3,
              boxShadow: "0 0 20px #55C923",
              p: 4,
              maxWidth: "900px",
              mx: "auto",
            }}
          >
            <Typography
              variant="h5"
              gutterBottom
              sx={{ fontFamily: "Quicksand, sans-serif", color: "#fff" }}
            >
              Smart Energy Recommendations
            </Typography>

            {/* Initial Form Button */}
            {onFirstMessage && (
              <Button
                onClick={beginChat}
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{
                  mt: 2,
                  textTransform: "none",
                  bgcolor: "#55C923",
                  color: "#000",
                  fontWeight: "bold",
                  "&:hover": { bgcolor: "#44a91e" },
                }}
              >
                {loading ? "Generating..." : "Get Recommendations"}
              </Button>
            )}

            {/* Error Message */}
            {error && (
              <Typography color="error" mt={2}>
                {error}
              </Typography>
            )}

            {/* Message History */}
            {!onFirstMessage &&
              messages.map((message, index) => (
                <Box key={index} sx={{ mt: 4 }}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: message.type === "Bot" ? "#55C923" : "#999",
                      mb: 1,
                      fontWeight: 600,
                    }}
                  >
                    {message.type === "Bot" ? "EnergyBot" : "You"}:
                  </Typography>

                  {message.type === "Bot" ? (
                    <List component="ul" sx={{ pl: 2 }}>
                      {message.content.map((rec, idx) => {
                        const [title, ...rest] = rec.split(":");
                        const body = rest.join(":").trim();
                        return (
                          <ListItem
                            key={idx}
                            sx={{
                              py: 1,
                              px: 0,
                              color: "#ddd",
                              alignItems: "flex-start",
                            }}
                          >
                            <ListItemIcon sx={{ minWidth: 24, mt: "5px" }}>
                              <FiberManualRecordIcon
                                sx={{ fontSize: 8, color: "#55C923" }}
                              />
                            </ListItemIcon>
                            <Typography variant="body2">
                              <strong>{title.trim()}:</strong> {body}
                            </Typography>
                          </ListItem>
                        );
                      })}
                    </List>
                  ) : (
                    <Typography sx={{ color: "#ccc" }}>
                      {message.content}
                    </Typography>
                  )}
                </Box>
              ))}

            {/* User Input */}
            {!onFirstMessage && (
              <Box sx={{ mt: 4, display: "flex", gap: 2 }}>
                <TextField
                  fullWidth
                  multiline
                  placeholder="Ask a follow-up..."
                  value={userMessage}
                  onChange={(e) => setUserMessage(e.target.value)}
                  sx={{
                    backgroundColor: "#222",
                    borderRadius: 1,
                    input: { color: "#fff" },
                    textarea: { color: "#fff" },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "#55C923" },
                      "&:hover fieldset": { borderColor: "#44a91e" },
                    },
                  }}
                />
                <Button
                  onClick={sendUserMessage}
                  disabled={loading || !userMessage.trim()}
                  variant="contained"
                  sx={{
                    px: 4,
                    bgcolor: "#55C923",
                    color: "#000",
                    fontWeight: "bold",
                    "&:hover": {
                      bgcolor: "#44a91e",
                    },
                  }}
                >
                  Send
                </Button>
              </Box>
            )}
          </Box>
        </Box>

        {/* error message */}
        {error && (
          <Typography color="error" mb={2}>
            {error}
          </Typography>
        )}

        {/* nicely formatted list */}
        {!onFirstMessage &&
          messages.map((message, index) => {
            return (
            <div key = {index}>
            <h1 style={{ fontSize: '32px' }} key = {index}>MESSAGE FROM: {message.type}</h1>
            {message.type == "Bot" ? <List component="ul" sx={{ pl: 0 }}>
              {message.content.map((rec, idx) => {
                // split into bold title + body
                const [title, ...rest] = rec.split(':')
                const body = rest.join(':').trim()
                return (
                  <ListItem
                    key={idx}
                    component="li"
                    disableGutters
                    sx={{ alignItems: 'flex-start', mb: 2 }}
                  >
                    <ListItemIcon sx={{ minWidth: 32, mt: '4px' }}>
                      <FiberManualRecordIcon sx={{ fontSize: 8, color: '#55C923' }} />
                    </ListItemIcon>
                    <Box>
                      <Typography
                        component="span"
                        sx={{
                          fontFamily: 'Quicksand, sans-serif',
                          fontSize: 18
                        }}
                      >
                        <strong>{title.trim()}:</strong> {body}
                      </Typography>
                    </Box>
                  </ListItem>
                )
              })}
            </List>:
              <div>
              <p>{message.content}</p>
              <br></br>
              <br></br>
              </div>
              }
            </div>
          )})}
          {(onFirstMessage || loading) ? 
            loading ? <p>LOADING....</p>: <div></div> : 
            <div style={{ display: 'flex', alignItems: 'stretch', width: '100%' }}>
              <TextField
                style={{
                  backgroundColor: 'white',
                  width: '50vw',
                  flexGrow: 1,
                }}
                placeholder="Your Message Here"
                multiline
                onChange={(e) => {
                  setUserMessage(e.target.value);
                }}
                value={userMessage}
              />
              <Button
                onClick={sendUserMessage}
                variant="contained"
                sx={{
                  marginLeft: '1rem',
                  textTransform: 'none',
                  background: 'linear-gradient(90deg, #3DC787 0%, #55C923 100%)',
                  boxShadow: '0 4px 20px rgba(85, 201, 35, 0.3)',
                  height: '5vw', // ensures it matches the TextField height
                  '&:hover': {
                    background: 'linear-gradient(90deg, #55C923 0%, #3DC787 100%)',
                  },
                }}
              >
                SEND
              </Button>
            </div>

          }
        </Box>
    </ThemeProvider>
  );
}
