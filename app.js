const express = require('express');
const expensesRoutes = require('./routes/expenses');
const usersRoutes = require('./routes/users'); // Importing users route
const app = express();

app.use(express.json());

app.use('/api/expenses', expensesRoutes);
app.use('/api/users', usersRoutes); // Adding users route

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
