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

    return (
        <div>   
            <p>To send a test python call, click here:
                <Button variant='contained' onClick={testPythonCall}>CLICK ME</Button>
            </p>
        </div>
    )
}