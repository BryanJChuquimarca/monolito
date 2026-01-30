const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const app = express();
const port = 3000;
require("dotenv").config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
const JWT_SECRET = "secreto";

app.get("/verify", (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    console.error("No token provided");
    return res.sendStatus(401);
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error("Token verification failed:", err);
      return res.sendStatus(403);
    }
    res.setHeader("x-user-id", String(decoded.id));
    res.setHeader("x-user-name", decoded.username);
    res.setHeader("x-user-role", decoded.role);
    res.sendStatus(200);
  });
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  pool
    .query("SELECT * FROM users WHERE username = $1", [username])
    .then(async (result) => {
      if (result.rows.length === 0) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      const user = result.rows[0];
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        JWT_SECRET,
        { expiresIn: "1h" }
      );
      res.json({ token });
    })
    .catch((error) => {
      console.error("Error during login", error);
      res.status(500).json({ error: "Internal server error" });
    });
});

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});
