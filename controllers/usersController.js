// users controller 

const client = require('../db');

// Get
const getUsers = async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM users');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).send('Error fetching users');
  }
};

// Create User
const createUser = async (req, res) => {
    const { name } = req.body;
    try {
      const result = await client.query(
        'INSERT INTO users (name) VALUES ($1) RETURNING *',
        [name]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error('Error creating user:', err);  // Log the actual error
      res.status(500).send('Error creating user');
    }
  };
  

// Update 
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const result = await client.query(
      'UPDATE users SET name = $1 WHERE id = $2 RETURNING *',
      [name, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).send('Error updating user');
  }
};

// Delete 
const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
      const result = await client.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
      if (result.rowCount === 0) {
        res.status(404).send('User not found');
      } else {
        res.json(result.rows[0]);
      }
    } catch (err) {
      console.error('Error deleting user:', err);  // Log the actual error
      res.status(500).send('Error deleting user');
    }
  };
  
  
  module.exports = { getUsers, createUser, updateUser, deleteUser };
