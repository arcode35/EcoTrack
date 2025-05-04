'use client'

import axios from 'axios'
import React, { useState } from 'react'
import generateContent from '@/lib/gemini'
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
  TextField
} from '@mui/material'
import BoltIcon from '@mui/icons-material/Bolt'
import ScheduleIcon from '@mui/icons-material/Schedule'
import SpaIcon from '@mui/icons-material/Spa'
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord'

const theme = createTheme()

export default function Recommendations() {
  const [consumption, setConsumption] = useState('')
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [date, setDate] = useState("")
  const [solarCost, setSolarCost] = useState(0)
  const [geminiResponse, setGeminiResponse] = useState("")
  const [moneySaved, setMoneySaved] = useState(0)
  const [estEnergyUse, setEstEnergyUse] = useState(0)
  const [monthlyCost, setMonthlyCost] = useState(0)
  const [panels, setPanels] = useState(0)

    //gets the data stored in firebase
    const getFirebaseData = async() => {
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
      setGeminiResponse(data.geminiResponse)
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setRecommendations([])

    const value = Number(consumption)
    if (isNaN(value) || value <= 0) {
      setError('Please enter a valid consumption value in kWh.')
      return
    }

    setLoading(true)
    try {
      // 1️⃣ categorize
      const category = value < 200 ? 'low'
                      : value < 500 ? 'moderate'
                      : 'high'

      // 2️⃣ build prompt
      const prompt = `
A user has reported ${value} kWh of energy consumption, which is considered ${category}.
Provide 3–5 practical, specific recommendations to reduce their energy consumption.
Focus on actionable advice with potential savings estimates where possible.
      `.trim()

      // 3️⃣ call Gemini
      const text = await generateContent(prompt)

      // 4️⃣ clean & split into array
      const recs = text
        .replace(/\*\*/g, '')                  // strip any leftover **
        .split(/\n\s*[\d\-\.\)]*\s*/)          // split on numbered or dashed lines
        .map(l => l.trim())                    // trim whitespace
        .filter(l => l)                        // drop empties
      setRecommendations(recs)
    } catch (err) {
      console.error(err)
      setError(err.message || 'Error generating recommendations.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#000', color: '#fff' }}>
        {/* Sidebar */}
        <Box sx={{ width: 240, backgroundColor: '#111', p: 3, display: 'flex', flexDirection: 'column', gap: 2, borderRight: '1px solid #222' }}>
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
        </Box>

        {/* Main Content */}
        <Box sx={{ flex: 1, p: 4, overflowY: 'auto' }}>
          <Typography variant="h4" mb={2} sx={{ fontFamily: 'Quicksand, sans-serif' }}>
            Energy Consumption Recommendations
          </Typography>

          {/* input form */}
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 4 }}
          >
            <TextField
              label="Consumption (kWh)"
              variant="filled"
              value={consumption}
              onChange={(e) => setConsumption(e.target.value)}
              InputProps={{ style: { backgroundColor: '#222', color: '#fff' } }}
              InputLabelProps={{ style: { color: '#ccc', fontFamily: 'Quicksand, sans-serif' } }}
            />
            <Button
              type="submit"
              variant="contained"
              sx={{
                background: 'linear-gradient(90deg, #3DC787 0%, #55C923 100%)',
                textTransform: 'none',
                boxShadow: '0 4px 20px rgba(85, 201, 35, 0.3)',
                '&:hover': { background: 'linear-gradient(90deg, #55C923 0%, #3DC787 100%)' }
              }}
              disabled={loading}
            >
              {loading ? 'Generating...' : 'Get Recommendations'}
            </Button>
          </Box>

          {/* error message */}
          {error && (
            <Typography color="error" mb={2}>
              {error}
            </Typography>
          )}

          {/* nicely formatted list */}
          {recommendations.length > 0 && (
            <List component="ul" sx={{ pl: 0 }}>
              {recommendations.map((rec, idx) => {
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
            </List>
          )}
        </Box>
      </Box>
    </ThemeProvider>
  )
}
