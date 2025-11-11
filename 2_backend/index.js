const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");

const { Picsum } = require("picsum-photos"); //revisar

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

app.use(cors());

async function initDb() {
  pool.connect((err) => {
    if (err) {
      console.log("Error connecting to the database", err);
    } else {
      console.log("conneted to the database");
    }
  });
  try {
    //tabla users
    pool.query(
      `CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            role VARCHAR(50) NOT NULL
        )`
    );
    console.log("Users table created or already exist");
    //tabla posts
    pool.query(
      `CREATE TABLE IF NOT EXISTS posts (
            id SERIAL PRIMARY KEY,
            title VARCHAR(100),
            image_url VARCHAR(255),
            content VARCHAR(50),
            user_id INT REFERENCES users(id)
        )`
    );
    console.log("Posts table created or already exist");
    //usuario prueba
    const adminPassword = await bcrypt.hash("admin", 10);
    await pool.query(
      `INSERT INTO users (username, password, role)
        VALUES ($1, $2, $3)
        ON CONFLICT (username) DO NOTHING`,
      ["admin", adminPassword, "admin"]
    );

    console.log("Test user 'admin' created or already exists.");
    //usuario prueba
    const userPassword = await bcrypt.hash("user", 10);
    await pool.query(
      `INSERT INTO users (username, password, role)
        VALUES ($1, $2, $3)
        ON CONFLICT (username) DO NOTHING`,
      ["pepe", userPassword, "user"]
    );
    console.log("Test user 'pepe' created or already exists.");
    //post en tabla posts
    const createPost = async (id, imageUrl, content, username) => {
      const userResult = await pool.query(
        "SELECT id FROM users WHERE username = $1",
        [username]
      );
      if (userResult.rows.length === 0) {
        console.error(`User ${username} not found. Cannot create post ${id}.`);
        return; // Detener si el usuario no existe
      }
      const userId = userResult.rows[0].id;
      await pool.query(
        `INSERT INTO posts (id, image_url, content, user_id)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (id) DO NOTHING`,
        [id, imageUrl, content, userId]
      );
      console.log("Post created or already exists");
    };
    await createPost(
      1,
      Picsum.url(),
      "Este es el contenido del primer post.",
      "pepe"
    );
    await createPost(
      2,
      Picsum.url(),
      "Este es el contenido del segundo post.",
      "pepe"
    );
    await createPost(
      3,
      Picsum.url(),
      "Este es el contenido del tercero post.",
      "pepe"
    );
  } catch (err) {
    console.error("Error initializing the database", err);
  }
}

app.get("/post", async (req, res) => {
  const resultado = await pool.query(
    `SELECT posts.id, posts.title, posts.image_url, posts.content, users.username FROM posts JOIN users ON posts.user_id = users.id`
  );
  const posts = resultado.rows;
  res.json(posts);
});

initDb();

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});
