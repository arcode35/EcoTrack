'use client'
import Link from 'next/link';
import { Button, TextField } from "@mui/material";
import { useState } from 'react';

export default function Login()
{
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const sendLoginInfo = async() => {
        const response = await fetch("https://localhost:5000", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({username: username, password: password})
          });
        const returnedValue = await response.json()
        console.log(returnedValue)
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