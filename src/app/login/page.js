'use client'
import Link from 'next/link';
import { Button, TextField } from "@mui/material";
import { useState } from 'react';
import axios from "axios";

export default function Login()
{
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const sendLoginInfo = async() => {
        const response = await axios.post("http://localhost:5000/backend", {
            username: username,
            password: password
        })
        console.log(response.data.message)
    }

    return (
        <div>   
            <Button variant="contained" component = {Link} href = "/">BACK</Button>
            <p>Put your Login Info here.</p>
            <p>USERNAME:
                <TextField placeholder="Username here" value={username}
                onChange={(e) => setUsername(e.target.value)}></TextField>
            </p>
            <p>PASSWORD:
                <TextField placeholder="Password" value={password}
                onChange={(e) => setPassword(e.target.value)}></TextField>
            </p>
            <Button variant = "contained" onClick={sendLoginInfo}>Sign In</Button>
        </div>
    )
}