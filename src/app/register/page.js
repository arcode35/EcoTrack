'use client'
import Image from "next/image";
import Link from 'next/link';  // Use Next.js Link
import { useState } from 'react';
import { Button, TextField } from "@mui/material";
import axios from "axios";

export default function Register() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    //if user is logged in and they somehow get to this page, send them back until they press the logout button
    if(localStorage.getItem("username") !== null && localStorage.getItem("username") !== "")
    {
      window.location.href = "/main"
    }

    //Sends info for registration
    const sendRegisterInfo = async() => {
        const response = await axios.post("http://localhost:5000/users/create_user", {
            username: username,
            password: password,
        })
        //Gets back results of the backend call.
        const result = await response.data
        //if we're able to log them in, put their name in storage (so even if they refresh, username will still be there)
        if(result.success)
        {
            console.log("Registration successful!")
            localStorage.setItem("username", username)
            window.location.href = "/main"
        }
        else
        {
            alert(result.message)   
        }
    }

    return ( <div>   
            {/* Sends user back to the home page. */}
            <Button variant="contained" component = {Link} href = "/">BACK</Button>
            <p>Alerady have an account? Click here:
                <Button variant="contained" component = {Link} href = "/login">LOGIN</Button>
            </p>
            <p>Put your desired username and password here.</p>
            <p>USERNAME:
                {/*This is a field where they can put their username, updates in real time.*/}
                <TextField placeholder="Username here" value={username}
                onChange={(e) => setUsername(e.target.value)}></TextField>
            </p>
            <p>PASSWORD:
                {/* This will let user put password, updates in real time. */}
                <TextField placeholder="Password" value={password}
                onChange={(e) => setPassword(e.target.value)}></TextField>
            </p>
            {/* On click, calls login function. */}
            <Button variant = "contained" onClick={sendRegisterInfo}>Sign In</Button>
        </div>
  );
}
