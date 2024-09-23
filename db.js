require('dotenv').config();
const { Client } = require('pg');

// Neon Database Client
const neonClient = new Client({
  host: process.env.NEON_HOST,
  database: process.env.NEON_DATABASE,
  user: process.env.NEON_USER,
  password: process.env.NEON_PASSWORD,
  port: process.env.NEON_PORT,
  ssl: { rejectUnauthorized: false }
});

// Railway Database Client
const externalClient = new Client({
  host: process.env.RAILWAY_HOST,
  database: process.env.RAILWAY_DATABASE,
  user: process.env.RAILWAY_USER,
  password: process.env.RAILWAY_PASSWORD,
  port: process.env.RAILWAY_PORT,
  ssl: { rejectUnauthorized: false }
});

neonClient.connect()
  .then(() => console.log('Connected to Neon Postgres'))
  .catch(err => console.error('Neon Connection error', err.stack));

externalClient.connect()
  .then(() => console.log('Connected to Railway Postgres'))
  .catch(err => console.error('Railway Postgres Connection error', err.stack));

module.exports = { neonClient, externalClient };
