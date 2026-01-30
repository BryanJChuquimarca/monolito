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

// get /comments <-- lista
app.get("/:postId", async (req, res) => {
  //leeremos los paraetros del req.body: id de post
  const { postId } = req.params;
  pool
    .query(
      `SELECT comments.id, comments.content, users.username
        FROM comments
        JOIN users ON comments.user_id = users.id
        WHERE comments.post_id = $1
        ORDER BY comments.date_created DESC`,
      [postId],
    )
    .then((result) => {
      res.json(result.rows);
    })
    .catch((error) => {
      console.error("Error fetching comments", error);
      res.status(500).json({ error: "Internal server error" });
    });
});
//post /comments <-- creará un comentario
app.post("/", async (req, res) => {
  //aqui el "creador" de post sera el del token
  const { content, postId } = req.body;
  console.log("Creating comment for postId:", postId, "with content:", content);
  const userId = req.headers["x-user-id"];
  pool
    .query(
      `INSERT INTO comments (content, user_id, post_id)
        VALUES ($1, $2, $3) RETURNING id`,
      [content, userId, postId],
    )
    .then((result) => {
      res.json({ id: result.rows[0].id });
    })
    .catch((error) => {
      console.error("Error creating comment", error);
      res.status(500).json({ error: "Internal server error" });
    });
});
// delete /comments <-- eliminar un comentario
app.delete("/:id", async (req, res) => {
  //leeremos el id del comentario del req.body
  //tambien tenemos que veridicar que eres el creador del comentario
  const { id } = req.params;
  const userId = req.headers["x-user-id"];
  pool
    .query(`SELECT * FROM comments WHERE id = $1 AND user_id = $2`, [
      id,
      userId,
    ])
    .then((result) => {
      if (result.rows.length === 0) {
        return res
          .status(403)
          .json({ error: "You are not the creator of this comment" });
      }
      pool
        .query(`DELETE FROM comments WHERE id = $1`, [id])
        .then(() => {
          res.json({ message: "Comment deleted successfully" });
        })
        .catch((error) => {
          console.error("Error deleting comment", error);
          res.status(500).json({ error: "Internal server error" });
        });
    })
    .catch((error) => {
      console.error("Error verifying comment creator", error);
      res.status(500).json({ error: "Internal server error" });
    });
});
/*funciona sin esto:
 let eventLoopLagMs = 0;
setInterval(() => {
  const start = Date.now();
  setImmediate(() => {
    eventLoopLagMs = Date.now() - start;
  });
}, 1000).unref(); */

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});
