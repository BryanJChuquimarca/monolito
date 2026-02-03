const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const { Picsum } = require("picsum-photos");

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

// get /posts
app.get("/", async (req, res) => {
  const resultado = await pool.query(
    `SELECT posts.id, posts.image_url, posts.content, users.username
        FROM posts
        JOIN users ON posts.user_id = users.id
        ORDER BY posts.date_created DESC`,
  );
  const posts = resultado.rows;
  res.json(posts);
});

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});
