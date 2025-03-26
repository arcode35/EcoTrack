'use client'
import Link from 'next/link';
import { Button, TextField } from "@mui/material";
import { useState } from 'react';
import axios from "axios";

export default function Main()
{
    // This is the function sending the username and passwrod to the backend.
    const testPythonCall = async() => {
        const response = await axios.get("http://localhost:5001/python/message", {
        })
        const result = await response.data
        console.log(result)
    }

    const logoutUser = async() => {
        localStorage.setItem("username", "")
        redirectFunction()
    }

    const redirectFunction = async() => {
        //checks if we're actually not logged in, and we need to go back to the main menu
        if(localStorage.getItem("username") === null || localStorage.getItem("username") === "")
        {
            window.location.href = "/"
        }
    }
    redirectFunction()

    return (
        <div>   
            <Button variant='contained' onClick={logoutUser}>LOGOUT</Button>
            <p>To send a test python call, click here:
                <Button variant='contained' onClick={testPythonCall}>CLICK ME</Button>
            </p>
        </div>
    )
}