'use client'
import Link from 'next/link';
import { Button, TextField } from "@mui/material";
import { useState } from 'react';
import axios from "axios";

export default function Login()
{
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    // This is the function sending the username and passwrod to the backend.
    const sendLoginInfo = async() => {
        const response = await axios.post("http://localhost:5000/users/login_user", {
            username: username,
            password: password,
        })
        //This will be a button directing users to the login.
        console.log(response.data.message)
    }

    return (
        <div>   
            {/* Sends user back to the home page. */}
            <Button variant="contained" component = {Link} href = "/">BACK</Button>
            <p>Need to create account? Click here:
                <Button variant="contained" component = {Link} href = "/register">REGISTER</Button>
            </p>
            <p>Put your Login Info here.</p>
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
            <Button variant = "contained" onClick={sendLoginInfo}>Sign In</Button>
            <p>To send a test python call, click here:
                <Button></Button>
            </p>
        </div>
    )
}