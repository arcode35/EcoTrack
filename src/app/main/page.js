"use client";
import Link from "next/link";
import { Button, TextField } from "@mui/material";
import { useState } from "react";
import axios from "axios";

export default function Main() {
  const [washerHours, setWashHours] = useState();
  const [dryerHours, setDryerHours] = useState();
  const [homeArea, setHomeArea] = useState();
  const [numRooms, setNumRooms] = useState();
  const [numBedrooms, setNumBedrooms] = useState();
  const [numPeople, setNumPeople] = useState();
  const [numHeatCoolFootage, setNumHeatCoolFootage] = useState();
  const [numHeatCoolDays, setNumheatCoolDays] = useState();
  const [latitude, setLatitude] = useState();
  const [longitude, setLongitude] = useState();

  // This is the function sending the username and passwrod to the backend.
  const testPythonCall = async () => {
    const response = await axios.get(
      "http://localhost:5001/python/message",
      {}
    );
    const result = await response.data;
    console.log(result);
  };

  //to log out the user when they press the according button
  const logoutUser = async () => {
    localStorage.setItem("username", "");
    redirectFunction();
  };

  const redirectFunction = async () => {
    //checks if we're actually not logged in, and we need to go back to the main menu
    if (
      localStorage.getItem("username") === null ||
      localStorage.getItem("username") === ""
    ) {
      window.location.href = "/";
    }
  };
  redirectFunction();

  //gets the solar data using latittude and longitude
  const getSolarData = async () => {
    const response = await axios.post("http://localhost:5000/solar/getData", {
      latitude: latitude,
      longitude: longitude,
    });
    const data = await response.data;
    //if fail, alert user of it
    if (data.success == false) {
      console.log(data.error);
      alert("Failed to get data: " + data.error.message);
    }
    //otherwise FOR NOW, just log the data
    else {
      console.log(data.data);
    }
  };

  return (
    <div>
      <h1>If you don't know any of these, leave them empty.</h1>
      <Button variant="contained" onClick={logoutUser}>
        LOGOUT
      </Button>
      <p>
        Here, put in the # of hours you use your washer monthly:
        <TextField
          placeholder="Washer Hours"
          value={washerHours}
          onChange={(e) => setWashHours(e.target.value)}
        ></TextField>
      </p>
      <p>
        Here, put in the # of hours you use your dryer monthly:
        <TextField
          placeholder="Dryer Hours"
          value={dryerHours}
          onChange={(e) => setDryerHours(e.target.value)}
        ></TextField>
      </p>
      <p>
        Here, square footage of your home:
        <TextField
          placeholder="Home Area"
          value={homeArea}
          onChange={(e) => setHomeArea(e.target.value)}
        ></TextField>
      </p>
      <p>
        Here, set the # of rooms in your home:
        <TextField
          placeholder="# of Rooms"
          value={numRooms}
          onChange={(e) => setNumRooms(e.target.value)}
        ></TextField>
      </p>
      <p>
        Here, set the # of bedrooms in your home:
        <TextField
          placeholder="# of Bedrooms"
          value={numBedrooms}
          onChange={(e) => setNumBedrooms(e.target.value)}
        ></TextField>
      </p>
      <p>
        Here, set the # of people in your home:
        <TextField
          placeholder="# of People"
          value={numPeople}
          onChange={(e) => setNumPeople(e.target.value)}
        ></TextField>
      </p>
      <p>
        Here, set the total heat/cooled square footage:
        <TextField
          placeholder="# of People"
          value={numHeatCoolFootage}
          onChange={(e) => setNumHeatCoolFootage(e.target.value)}
        ></TextField>
      </p>
      <p>
        Here, set the total heating/cooling degree days:
        <TextField
          placeholder="# of People"
          value={numHeatCoolDays}
          onChange={(e) => setNumheatCoolDays(e.target.value)}
        ></TextField>
      </p>
      <Button variant="contained" onClick={testPythonCall}>
        Send Python Data
      </Button>
      <p>
        Here, set the your latitude:
        <TextField
          placeholder="# of People"
          value={latitude}
          onChange={(e) => setLatitude(e.target.value)}
        ></TextField>
      </p>
      <p>
        Here, set the your longitude:
        <TextField
          placeholder="# of People"
          value={longitude}
          onChange={(e) => setLongitude(e.target.value)}
        ></TextField>
      </p>
      <div>
        {/*32.9871, -96.6795*/}
        <Button variant="contained" onClick={getSolarData}>
          Get Solar Data (input lattitude and longitude first)
        </Button>
      </div>
    </div>
  );
}
