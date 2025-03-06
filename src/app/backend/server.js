const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors()); // Allow frontend to make requests to this backend
app.use(bodyParser.json()); // Parse JSON bodies

// API Route
app.post("/backend", (req, res) => {
    const { username, password } = req.body;
    console.log("Received:", username, password);
    
    // Simulate processing or authentication
    res.json({ message: "Data received", username, password });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
