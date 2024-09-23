
const express = require('express');
const { getExpenses, createExpense, updateExpense, deleteExpense } = require('../controllers/expensesController');
const router = express.Router();

// get
router.get('/', getExpenses);

// create
router.post('/', createExpense);

// Update expense by ID
router.put('/:id', updateExpense);

// Delete expense by ID
router.delete('/:id', deleteExpense);

module.exports = router;
