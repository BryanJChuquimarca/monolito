const cors = require("cors");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");
const { Picsum } = require("picsum-photos");

require("dotenv").config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function initDb() {
  try {
    await pool.connect();
    console.log("Connected to the database");
  } catch (error) {
    console.error("Error connecting to the database", error);
  }
  try {
    await pool.query(
      `CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(20) NOT NULL
    )`
    );
    console.log("Users table created or already exists");
    pool.query(
      `CREATE TABLE IF NOT EXISTS posts (
        id SERIAL PRIMARY KEY,
        image_url VARCHAR(255),
        content TEXT NOT NULL,
        date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        user_id INTEGER REFERENCES users(id)
    )`
    );
    console.log("Posts table created or already exists");
    //crear tabla de coments
    pool.query(
      `CREATE TABLE IF NOT EXISTS comments (
        id SERIAL PRIMARY KEY,
        content TEXT NOT NULL,
        user_id INTEGER REFERENCES users(id),
        post_id INTEGER REFERENCES posts(id),
        date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`
    );
    console.log("Comments table created or already exists");
    //crear tabla de likes
    pool.query(
      `CREATE TABLE IF NOT EXISTS likes (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        post_id INTEGER REFERENCES posts(id)
    )`
    );
    console.log("Likes table created or already exists");

    const createUser = async (username, password, role) => {
      const hashedPassword = await bcrypt.hash(password, 10);
      await pool.query(
        `INSERT INTO users (username, password, role)
            VALUES ($1, $2, $3)
            ON CONFLICT (username) DO NOTHING`,
        [username, hashedPassword, role]
      );
      console.log(`Default user "${username}" created or already exists`);
    };
    await createUser("pepe", "pepe", "user");
    await createUser("admin", "admin", "admin");
    const createPost = async (imageUrl, content, username) => {
      const userResult = await pool.query(
        "SELECT id FROM users WHERE username = $1",
        [username]
      );
      if (userResult.rows.length === 0) {
        console.log(`User "${username}" does not exist. Cannot create post.`);
        return;
      }
      const userId = userResult.rows[0].id;
      await pool.query(
        `INSERT INTO posts (image_url, content, user_id)
            VALUES ($1, $2, $3)
            `,
        [imageUrl, content, userId]
      );
      console.log("Post created or already exists");
    };
    await createPost(
      Picsum.url(),
      "Este es el contenido del primer post.",
      "pepe"
    );
    await createPost(
      Picsum.url(),
      "Este es el contenido del segundo post.",
      "pepe"
    );
    await createPost(
      Picsum.url(),
      "Este es el contenido del tercer post.",
      "pepe"
    );
  } catch (error) {
    console.error("Error initializing database", error);
  }
  finally{
    console.log("Closing database connection");
    await pool.end();
    process.exit(0);
  }
}

initDb();
