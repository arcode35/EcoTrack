'use client'
import Image from "next/image";
import Link from 'next/link';  // Use Next.js Link
import { useState } from 'react';
import { Button, TextField } from "@mui/material";
import axios from "axios";

export default function SignUp() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const sendRegisterInfo = async() => {
        const response = await axios.post("http://localhost:5000/backend", {
            username: username,
            password: password,
            action: "Register"
        })
        //This will be a button directing users to the login.
        console.log(response.data.message)
    }

    return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div>   
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
    </div>
  );
}
