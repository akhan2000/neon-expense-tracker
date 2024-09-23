// expenses Controller 
const { externalClient } = require('../db');

const getExpenses = async (req, res) => {
  try {
    const result = await externalClient.query('SELECT * FROM expenses');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching expenses:', err);
    res.status(500).send('Error fetching expenses');
  }
};


const createExpense = async (req, res) => {
  const { user_id, category, amount, expense_date } = req.body;
  try {
    const result = await client.query(
      'INSERT INTO expenses (user_id, category, amount, expense_date) VALUES ($1, $2, $3, $4) RETURNING *',
      [user_id, category, amount, expense_date]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating expense:', err);
    res.status(500).send('Error creating expense');
  }
};


const updateExpense = async (req, res) => {
  const { id } = req.params;
  const { category, amount } = req.body;
  try {
    const result = await client.query(
      'UPDATE expenses SET category = $1, amount = $2 WHERE id = $3 RETURNING *',
      [category, amount, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating expense:', err);
    res.status(500).send('Error updating expense');
  }
};


const deleteExpense = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await client.query('DELETE FROM expenses WHERE id = $1 RETURNING *', [id]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error deleting expense:', err);
    res.status(500).send('Error deleting expense');
  }
};

module.exports = { getExpenses, createExpense, updateExpense, deleteExpense };
