const express = require('express');
const router = express.Router();
const { neonClient, externalClient } = require('../db');

/**
 * @swagger
 * components:
 *   schemas:
 *     Expense:
 *       type: object
 *       required:
 *         - user_id
 *         - category
 *         - amount
 *         - expense_date
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the expense
 *         user_id:
 *           type: integer
 *           description: The id of the user
 *         category:
 *           type: string
 *           description: The category of the expense
 *         amount:
 *           type: number
 *           description: The amount of the expense
 *         expense_date:
 *           type: string
 *           format: date
 *           description: The date of the expense
 *       example:
 *         id: 1
 *         user_id: 1
 *         category: Food
 *         amount: 20.5
 *         expense_date: 2023-10-01
 */

/**
 * @swagger
 * tags:
 *   name: Expenses
 *   description: The expenses managing API
 */

/**
 * @swagger
 * /api/expenses:
 *   get:
 *     summary: Returns the list of all the expenses
 *     tags: [Expenses]
 *     responses:
 *       200:
 *         description: The list of the expenses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Expense'
 */
const getExpenses = async (req, res) => {
  try {
    const result = await externalClient.query('SELECT * FROM expenses');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching expenses:', err);
    res.status(500).send('Error fetching expenses');
  }
};

/**
 * @swagger
 * /api/expenses:
 *   post:
 *     summary: Creates a new expense
 *     tags: [Expenses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Expense'
 *     responses:
 *       201:
 *         description: The created expense
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Expense'
 *       500:
 *         description: Some server error
 */
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

/**
 * @swagger
 * /api/expenses/{id}:
 *   put:
 *     summary: Updates an expense
 *     tags: [Expenses]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The expense id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Expense'
 *     responses:
 *       200:
 *         description: The updated expense
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Expense'
 *       404:
 *         description: Expense not found
 *       500:
 *         description: Some server error
 */
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

/**
 * @swagger
 * /api/expenses/{id}:
 *   delete:
 *     summary: Deletes an expense
 *     tags: [Expenses]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The expense id
 *     responses:
 *       200:
 *         description: The deleted expense
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Expense'
 *       404:
 *         description: Expense not found
 *       500:
 *         description: Some server error
 */
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