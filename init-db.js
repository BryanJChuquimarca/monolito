const { Client } = require('pg');
const bcrypt = require('bcrypt');

require('dotenv').config();

const client = new Client({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function initDB() {
  try {
    await client.connect();
    console.log('Connected to the database');

    await client.query(`
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL
  );
`);

    await client.query(
      `INSERT INTO users (username, password, role) VALUES
      ($1, $2, $3)
      ON CONFLICT (username) DO NOTHING`,
      ['admin', await bcrypt.hash('12345', 10), 'admin'],
    );

    await client.query(
      `INSERT INTO users (username, password, role) VALUES
      ($1, $2, $3)
      ON CONFLICT (username) DO NOTHING`,
      ['user', await bcrypt.hash('1234', 10), 'user'],
    );
    await client.end();
    console.log('Database initialized with default users');
  } catch (error) {
    console.error('Error initializing the database:', error);
  }
}

initDB();
