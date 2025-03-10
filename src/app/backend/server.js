const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
//The port we are using.
const PORT = 5000;

// Middleware
app.use(cors()); // Enable CORS for cross-origin requests. Want to protect against such requests primarily.

//Parses json automatically and makes the resulting values available in req.body automatically.
app.use(bodyParser.json()); // Parse JSON body

// API Route. This is where the code for the firebase should be.
app.post("/backend", (req, res) => {
    //Process what was passed in to req.
    const { username, password } = req.body;
    
    // For now, just send a message that it succeeded.
    res.json({ message: "Data received successfully", username, password });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});