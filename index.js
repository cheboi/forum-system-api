const express = require("express");
const cors = require("cors");
const app = express();

const PORT = process.env.PORT || 8000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

const users = [];
const threadList = [];

app.get("/api", (req, res) => {
  res.json({
    message: "Testing World",
  });
});

// Login
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  let result = users.filter((user) => {
    user.email === email && user.password === password;
  });
  if (result.length !== 1) {
    res.status(403).send("Invalid credentials");
  }
  res.json({
    message: "Login Successful",
    id: result[0].id,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
