const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;
require("dotenv").config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/profile", (req, res) => {
  const userId = req.headers["x-user-id"];
  const userName = req.headers["x-user-name"];
  const userRole = req.headers["x-user-role"];
  const user = { id: userId, username: userName, role: userRole };
  res.json({ message: "This is a protected profile route", user: user });
});

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});
