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
app.get("/", async(req, res) => {
  const resultado = await pool.query(
    `SELECT posts.id, posts.image_url, posts.content, users.username
        FROM posts
        JOIN users ON posts.user_id = users.id
        ORDER BY posts.date_created DESC`,
  );
  const posts = resultado.rows;
  res.json(posts);
});
// post /post <-- crear un post
app.post("/", (req, res) => {
  const { content } = req.body;
  const imageUrl = Picsum.url();
  const userId = req.headers["x-user-id"];
  pool
    .query(
      `INSERT INTO posts (image_url, content, user_id)
        VALUES ($1, $2, $3) RETURNING id`,
      [imageUrl, content, userId],
    )
    .then((result) => {
      res.json({ id: result.rows[0].id });
    })
    .catch((error) => {
      console.error("Error creating post", error);
      res.status(500).json({ error: "Internal server error" });
    });
});
// delete /posts <-- eliminar un post
app.delete("/:id", async (req, res) => {
  //leeremos los paraetros del req.body: id de post
  //tambien tenemos que verificar que eres el creador del post
  const { id } = req.params;
  const userId = req.headers["x-user-id"];
  //verificamos que el post existe y que el user es el creador
  try {
    const result = await pool.query(
      `SELECT * FROM posts WHERE id = $1 AND user_id = $2`,
      [id, userId],
    );
    if (result.rows.length === 0) {
      //el post no existe o no eres el creador
      return res
        .status(403)
        .json({ error: "No tienes permiso para eliminar este post" });
    }
    //primero eliminamos los comentarios asociados al post
    await pool.query(`DELETE FROM comments WHERE post_id = $1`, [id]);
    console.log("comentario asociados eliminados");
    //luego eliminamos los likes asociados al post
    await pool.query(`DELETE FROM likes WHERE post_id = $1`, [id]);
    console.log("likes asociados eliminados");
    //si el post existe y eres el creador, lo eliminamos
    await pool.query(`DELETE FROM posts WHERE id = $1`, [id]);
    console.log("post eliminado");
    res.json({ message: "Post eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar el post", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});
