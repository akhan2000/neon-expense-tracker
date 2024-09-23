const express = require('express');
const router = express.Router();
const { neonClient, externalClient } = require('../db');

// Fetch users (Read from Railway PSQL)
const getUsers = async (req, res) => {
  try {
    const result = await externalClient.query('SELECT * FROM users');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).send('Error fetching users');
  }
};

// Create user (Write to Neon)
const createUser = async (req, res) => {
  const { name } = req.body;
  try {
    const result = await neonClient.query(
      'INSERT INTO users (name) VALUES ($1) RETURNING *',
      [name]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).send('Error creating user');
  }
};

// Update user (Write to Neon)
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const result = await neonClient.query(
      'UPDATE users SET name = $1 WHERE id = $2 RETURNING *',
      [name, id]
    );
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).send('User not found');
    }
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).send('Error updating user');
  }
};

// Delete user (Write to Neon)
const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await neonClient.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).send('User not found');
    }
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).send('Error deleting user');
  }
};

// Define routes
router.get('/', getUsers);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;