//THIS OUR LOGIN PAGE
'use client'
import Image from "next/image";
import Link from 'next/link';  // Use Next.js Link
import { Button } from "@mui/material";
import { useState } from "react";


export default function Home() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");


  return (
    
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <p>Welcome to EcoTrack!</p>
      <p>With EcoTrack, you can give data about your data usage to predict
        your bills in the future, among other things as well!
      </p> 
      {
        (localStorage.getItem("username") === null || localStorage.getItem("username") === "") ? 
        <div>
        <p>
          Click here to login:
          {/*This will be a button directing users to the login.*/}
          <Button component = {Link} href = "/login" variant="contained">Login</Button>
        </p>
        <p>Need to create account? Click here:
          <Button variant="contained" component = {Link} href = "/register">REGISTER</Button>
        </p>
        </div>
        : 
        <div>
        <p>Click to go to the main page:
          <Button variant="contained" component = {Link} href = "/main">Main Page</Button>
        </p>
        </div>
      }
    </div>
  );
}
