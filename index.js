const express = require('express');
const cookieParser = require('cookie-parser');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const app = express();
const port = 3000;
require('dotenv').config();

app.set('view engine', 'ejs');

app.use(express.urlencoded());
app.use(express.json());
app.use(cookieParser());

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

pool.connect();

app.get('/', (req, res) => {
  res.render('index', { title: 'titulo', name: 'nombre' });
});

isUser = (req, res, next) => {
  if (req.cookies && req.cookies.user == 'user') {
    return next();
  }
  if (req.cookies && req.cookies.user == 'admin') {
    res.redirect('/admin');
  }
  res.redirect('/login');
};

isAdmin = (req, res, next) => {
  if (req.cookies && req.cookies.user === 'admin') {
    return next();
  }

  if (req.cookies && req.cookies.user == 'user') {
    res.redirect('/user');
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
      res.cookie('user', user);
      res.redirect(fila.role);
    } else {
      res.status(401).redirect('login');
    }
  }
});

app.get('/user', isUser, (req, res) => {
  res.render('user', {
    name: req.cookies.user,
    rol: 'Usuario',
  });
});

app.get('/admin', isAdmin, (req, res) => {
  res.render('admin', {
    name: req.cookies.user,
    rol: 'Admin',
  });
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
