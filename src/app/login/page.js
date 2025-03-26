"use client";
import Link from "next/link";
import { Button, TextField } from "@mui/material";
import { useState } from "react";
import axios from "axios";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  //if user is logged in and they somehow get to this page, send them back until they press the logout button
  if(localStorage.getItem("username") !== null && localStorage.getItem("username") !== "")
  {
    window.location.href = "/main"
  }

  // This is the function sending the username and passwrod to the backend.
  // 3/16 line 23 is undefined
  const sendLoginInfo = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/users/login_user",
        {
          username,
          password,
        }
      );
      //This will be a button directing users to the login.
      const responseData = await response.data;
      //if we're able to log them in, put their name in storage (so even if they refresh, username will still be there)
      if(response.data.success)
      {
        console.log("Login succeded!")
        localStorage.setItem("username", username)
        window.location.href = "/main"
      }
      else
      {
        alert(responseData.message)
      }
    } catch (error) {
      console.log("error communciating with backend!");
    }
  };

  return (
    <div>
      {/* Sends user back to the home page. */}
      <Button variant="contained" component={Link} href="/">
        BACK
      </Button>
      <p>
        Need to create account? Click here:
        <Button variant="contained" component={Link} href="/register">
          REGISTER
        </Button>
      </p>
      <p>Put your Login Info here.</p>
      <p>
        USERNAME:
        {/*This is a field where they can put their username, updates in real time.*/}
        <TextField
          placeholder="Username here"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        ></TextField>
      </p>
      <p>
        PASSWORD:
        {/* This will let user put password, updates in real time. */}
        <TextField
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        ></TextField>
      </p>
      {/* On click, calls login function. */}
      <Button variant="contained" onClick={sendLoginInfo}>
        Sign In
      </Button>
    </div>
  );
}
