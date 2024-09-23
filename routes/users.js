// users.js routes 

const express = require('express');
const { getUsers, createUser, updateUser, deleteUser } = require('../controllers/usersController');
const router = express.Router();

// Get all users
router.get('/', getUsers);

// Create a new user
router.post('/', createUser);

// Update user by ID
router.put('/:id', updateUser);

// Delete user by ID
router.delete('/:id', deleteUser);

module.exports = router;
