const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

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

app.get("/:postId", async (req, res) => {
  //leeremos el id del post del req.body
  //esto nos devolvera el contador de likes de un post
  const { postId } = req.params;
  pool
    .query(
      `SELECT COUNT(*) AS like_count
        FROM likes
        WHERE post_id = $1`,
      [postId],
    )
    .then((result) => {
      res.json({ likeCount: result.rows[0].like_count });
    })
    .catch((error) => {
      console.error("Error fetching likes", error);
      res.json({ likeCount: 0 });
    });
});

app.post("/toggle", async (req, res) => {
  const { postId } = req.body;
  const userId = req.headers["x-user-id"];
  try {
    const existingLike = await pool.query(
      `SELECT * FROM likes WHERE user_id = $1 AND post_id = $2`,
      [userId, postId],
    );
    if (existingLike.rows.length > 0) {
      await pool.query(`DELETE FROM likes WHERE id = $1`, [
        existingLike.rows[0].id,
      ]);
      return res.json({ message: "Like removed successfully" });
    }
    await pool.query(`INSERT INTO likes (user_id, post_id) VALUES ($1, $2)`, [
      userId,
      postId,
    ]);
    res.json({ message: "Like added successfully" });
  } catch (error) {
    console.error("Error toggling like", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/status/:postId", async (req, res) => {
  const { postId } = req.params;
  const userId = req.headers["x-user-id"];
  try {
    const existingLike = await pool.query(
      `SELECT * FROM likes WHERE user_id = $1 AND post_id = $2`,
      [userId, postId],
    );
    if (existingLike.rows.length > 0) {
      return res.json({ liked: true });
    }
    res.json({ liked: false });
  } catch (error) {
    console.error("Error checking like status", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});
