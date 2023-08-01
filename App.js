import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; // Import the CSS file for styling

const App = () => {
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [expenses, setExpenses] = useState([]);

  const handleAddExpense = async (e) => {
    e.preventDefault();
    const date = `${day}-${month}-${year}`;
    try {
      await axios.post('/add_expense', {
        date,
        category,
        description,
        amount: parseFloat(amount),
      });
      fetchExpenses();
      setDay('');
      setMonth('');
      setYear('');
      setCategory('');
      setDescription('');
      setAmount('');
    } catch (error) {
      console.error(error);
    }
  };

  const fetchExpenses = async () => {
    try {
      const response = await axios.get('/get_expenses');
      setExpenses(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  return (
    <div className="container">
      <h1>Daily Life Expense Tracker</h1>
      <form onSubmit={handleAddExpense}>
        <div className="date-input">
          <label>Day:</label>
          <input
            type="number"
            value={day}
            onChange={(e) => setDay(e.target.value)}
            min="1"
            max="31"
            required
          />

          <label>Month:</label>
          <input
            type="number"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            min="1"
            max="12"
            required
          />

          <label>Year:</label>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            min="1900"
            max="2099"
            required
          />
        </div>

        <label>Category:</label>
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />

        <label>Description:</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <label>Amount:</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          step="0.01"
          required
        />

        <button type="submit">Add Expense</button>
      </form>

      <h2>Expense Details</h2>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Category</th>
            <th>Description</th>
            <th>Amount (USD)</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense, index) => (
            <tr key={index}>
              <td>{expense.Date}</td>
              <td>{expense.Category}</td>
              <td>{expense.Description}</td>
              <td>${expense.Amount.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;
