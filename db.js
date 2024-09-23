// db.js
require('dotenv').config();
const { Client } = require('pg');

const client = new Client({
  host: process.env.RDS_HOST,
  database: process.env.RDS_DATABASE,
  user: process.env.RDS_USER,
  password: process.env.RDS_PASSWORD,
  port: process.env.RDS_PORT,
  ssl: { rejectUnauthorized: false }, // Use SSL for secure connections
});

client.connect()
  .then(() => console.log('Connected to AWS RDS Postgres'))
  .catch(err => console.error('Connection error', err.stack));

module.exports = client;



// // db.js
// require('dotenv').config();
// const { Client } = require('pg');

// const client = new Client({
//   host: process.env.PGHOST,
//   database: process.env.PGDATABASE,
//   user: process.env.PGUSER,
//   password: process.env.PGPASSWORD,
//   port: process.env.PGPORT,
//   ssl: { rejectUnauthorized: false }, // SSL for security purposes (TBD)
// });

// client.connect()
//   .then(() => console.log('Connected to external Postgres'))
//   .catch(err => console.error('Connection error', err.stack));

// module.exports = client;
