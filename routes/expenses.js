const express = require('express');
const router = express.Router();
const { neonClient, externalClient } = require('../db');

// Fetch expenses (Read from Railway PostGres)
const getExpenses = async (req, res) => {
  try {
    const result = await externalClient.query('SELECT * FROM expenses');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching expenses:', err);
    res.status(500).send('Error fetching expenses');
  }
};

// Create expense (Write to Neon)
const createExpense = async (req, res) => {
  const { user_id, category, amount, expense_date } = req.body;
  try {
    const result = await neonClient.query(
      'INSERT INTO expenses (user_id, category, amount, expense_date) VALUES ($1, $2, $3, $4) RETURNING *',
      [user_id, category, amount, expense_date]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating expense:', err);
    res.status(500).send('Error creating expense');
  }
};

// Update expense (Write to Neon)
const updateExpense = async (req, res) => {
  const { id } = req.params;
  const { category, amount } = req.body;
  try {
    const result = await neonClient.query(
      'UPDATE expenses SET category = $1, amount = $2 WHERE id = $3 RETURNING *',
      [category, amount, id]
    );
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).send('Expense not found');
    }
  } catch (err) {
    console.error('Error updating expense:', err);
    res.status(500).send('Error updating expense');
  }
};

// Delete expense (Write to Neon)
const deleteExpense = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await neonClient.query('DELETE FROM expenses WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).send('Expense not found');
    }
  } catch (err) {
    console.error('Error deleting expense:', err);
    res.status(500).send('Error deleting expense');
  }
};

// Define routes
router.get('/', getExpenses);
router.post('/', createExpense);
router.put('/:id', updateExpense);
router.delete('/:id', deleteExpense);

module.exports = router;