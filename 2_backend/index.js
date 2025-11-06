const express = require('express');
const cookieParser = require('cookie-parser');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const app = express();
const port = 3000;
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

app.set('view engine', 'ejs');

app.use(express.urlencoded());
app.use(express.json());
app.use(cookieParser());

pool.connect();

function initDb() {
  pool.connect((err) => {
    if (err) {
      console.log('Error connecting to the database', err);
    } else {
      console.log('conneted to the database');
    }
  });
  try {
    //
    pool.query(
      `CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            role VARCHAR(50) NOT NULL
        )`,
    );
    console.log('Users table created or already exist');
  } catch (err) {
    console.error('Error initializing the database', err);
  }
}

initDb();

app.get('/', (req, res) => {
  res.render('index', { title: 'titulo', name: 'nombre' });
});

const isUser = (req, res, next) => {
  if (req.cookies && req.cookies.user) {
    const userCookie = JSON.parse(req.cookies.user);
    if (userCookie.role === 'user') {
      return next();
    }
    if (userCookie.role === 'admin') {
      return res.redirect('/admin');
    }
  }
  res.redirect('/login');
};

const isAdmin = (req, res, next) => {
  if (req.cookies && req.cookies.user) {
    const userCookie = JSON.parse(req.cookies.user);
    if (userCookie.role === 'admin') {
      return next();
    }
    if (userCookie.role === 'user') {
      return res.redirect('/user');
    }
  }
  res.redirect('/login');
};

//gestion de la vista
app.get('/login', (req, res) => {
  res.render('login');
});

//hacer login generico comparandolo con la base de datos

app.post('/login', async (req, res) => {
  const { user, password } = req.body;
  const seleccionar = await pool.query(
    'SELECT username, password, role FROM users WHERE username = $1',
    [user],
  );
  const fila = seleccionar.rows[0];

  if (fila) {
    const username = fila.username;
    const pwd = fila.password;

    if (await bcrypt.compareSync(password, pwd)) {
      console.log('Login correcto de ' + username);
      res.cookie(
        'user',
        JSON.stringify({ username: fila.username, role: fila.role }),
      );
      if (fila.role === 'admin') {
        res.redirect('/admin');
      } else {
        res.redirect('/user');
      }
    } else {
      res.status(401).redirect('/login');
    }
  }
});

app.post('/register', async (req, res) => {
  const { user, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).send('Las contraseñas no coinciden');
  }

  try {
    const existingUser = await pool.query(
      'SELECT * FROM users WHERE username = $1',
      [user],
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).send('El usuario ya existe');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      'INSERT INTO users (username, password, role) VALUES ($1, $2, $3)',
      [user, hashedPassword, 'user'],
    );

    console.log(`Usuario ${user} registrado correctamente`);
    res.redirect('/login');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al registrar el usuario');
  }
});

app.get('/user', isUser, (req, res) => {
  const userCookie = JSON.parse(req.cookies.user);
  res.render('user', {
    name: userCookie.username,
    rol: 'Usuario',
  });
});

app.get('/admin', isAdmin, (req, res) => {
  const userCookie = JSON.parse(req.cookies.user);
  res.render('admin', {
    name: userCookie.username,
    rol: 'Admin',
  });
});

app.get('/register', (req, res) => {
  res.render('register');
});

app.get('/logout', (req, res) => {
  res.clearCookie('user');
  res.redirect('login');
});

app.get('/logout', (req, res) => {
  res.clearCookie('user');
  res.redirect('login');
});

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});
