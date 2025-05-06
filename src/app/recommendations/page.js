'use client'
 
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
   TextField
 } from '@mui/material'
 import BoltIcon from '@mui/icons-material/Bolt'
 import ScheduleIcon from '@mui/icons-material/Schedule'
 import SpaIcon from '@mui/icons-material/Spa'
 import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord'
 import Sidebar from '@/components/Sidebar'
 
 const theme = createTheme()
 
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
         query: userMessage
       })
       const text = response.data
       console.log(text.response)
       const recs = text.response
       .replace(/\*\*/g, '')                  // strip any leftover **
       .split(/\n\s*[\d\-\.\)]*\s*/)          // split on numbered or dashed lines
       .map(l => l.trim())                    // trim whitespace
       .filter(l => l)                        // drop empties
       setLoading(false)
       setOnFirstMessage(false)
       addMessages(prev => {
         return [...prev, {type: "Bot", content: recs}]
       })
     }
 
   const beginChat = async (event) => 
     {
       event.preventDefault(); // Prevents page reload
       setLoading(true)
       const response = await axios.post("http://localhost:5001/python/next_chat", {
         isFirstMessage: true,
         energyUse: estEnergyUse,
         cost: monthlyCost
       })
       const text = response.data
       console.log(text.response)
       const recs = text.response
       .replace(/\*\*/g, '')                  // strip any leftover **
       .split(/\n\s*[\d\-\.\)]*\s*/)          // split on numbered or dashed lines
       .map(l => l.trim())                    // trim whitespace
       .filter(l => l)                        // drop empties
       addMessages([{type: "Bot", content: recs}])
       setLoading(false)
       setOnFirstMessage(false)
     }
 
   return (
     <ThemeProvider theme={theme}>
       <CssBaseline />
       <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#000', color: '#fff' }}>
         <Sidebar currentTab={"Usage Tips"} hasResultsData={true} />
 
         {/* Main Content */}
         <Box sx={{ flex: 1, p: 4, overflowY: 'auto' }}>
           <Typography variant="h4" mb={2} sx={{ fontFamily: 'Quicksand, sans-serif' }}>
             Energy Consumption Recommendations
           </Typography>
 
           {/* input form */}
           <Box
             component="form"
             onSubmit={beginChat}
             sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 4 }}
           >
             {onFirstMessage ? <Button
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
              : <div></div>}
 
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
       </Box>
     </ThemeProvider>
   )
 }