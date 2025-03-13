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
    const { username, password, action } = req.body;

    //If user is intending to register
    switch(action)
    {
        //Do when the user is wanting to register
        case "Register":
            res.json({ message: "Pretend Registration Successful", username: username, password: password, action: action});
            break;
        //Do when user is wanting to login
        case "Login":
            res.json({ message: "Pretend Login Successful", username: username, password: password, action: action});    
            break;
        //When action is not known
        default:
            res.json({message: "error performing request"});
    }
    
    // For now, just send a message that it succeeded.
    
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
