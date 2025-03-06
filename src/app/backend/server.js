const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors()); // Enable CORS for cross-origin requests
app.use(bodyParser.json()); // Parse JSON body

// API Route
app.post("/backend", (req, res) => {
    const { username, password } = req.body;
    console.log("Received:", username, password);
    
    // Simulate processing
    res.json({ message: "Data received successfully", username, password });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});