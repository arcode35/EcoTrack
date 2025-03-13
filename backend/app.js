const express = require("express");
const app = express();
const port = 3001;
const cors = require("cors");

const routes = require("./routes/users");

app.use(cors()); // Enable CORS
app.use("/users", routes);

// Sample route
app.get("/", (req, res) => {
  res.send("Express server working");
});

// create user
// works
app.post("/create_user", (req, res) => {
  console.log(req.query);
  const user = {
    username: req.query.username,
    password: req.query.password,
  };
  res.status(200).json(user);
});

//starting server
app.listen(port, () => {
  const url = `http://localhost:${port}`;
  console.log("Server is running");
  console.log(url);
});
