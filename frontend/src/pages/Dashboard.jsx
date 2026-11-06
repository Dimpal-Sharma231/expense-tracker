import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true); // Added loading state
  const [formData, setFormData] = useState({ title: '', amount: '', type: 'expense', category: 'Food' });

  // Fetch transactions from backend when page loads
  const fetchTransactions = async () => {
    try {
      const response = await api.get('/api/transactions');
      setTransactions(response.data);
      setLoading(false); // Stop loading
    } catch (error) {
      console.error("Error fetching transactions", error);
      setLoading(false); // Stop loading even if error
      if (error.response?.status === 401) {
        navigate('/'); 
      }
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // Calculate Totals
  const income = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
  const expense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
  const balance = income - expense;

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/api/transactions', {
        ...formData,
        amount: Number(formData.amount)
      });
      setTransactions([response.data, ...transactions]);
      setFormData({ title: '', amount: '', type: 'expense', category: 'Food' });
    } catch (error) {
      console.error("Error adding transaction", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/transactions/${id}`);
      setTransactions(transactions.filter(t => t._id !== id));
    } catch (error) {
      console.error("Error deleting transaction", error);
    }
  };

  // Prepare data for the Pie Chart
  const chartData = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      const existing = acc.find(item => item.name === t.category);
      if (existing) {
        existing.value += t.amount;
      } else {
        acc.push({ name: t.category, value: t.amount });
      }
      return acc;
    }, []);
    
  const COLORS = ['#ff4757', '#ffa502', '#2ed573', '#1e90ff', '#a4b0be'];

  // Show loading text before data arrives
  if (loading) return <div style={{ textAlign: 'center', marginTop: '50px', fontSize: '20px' }}>Loading your data...</div>;

  return (
    <div className="dashboard-container">
      <div className="navbar">
        <h1>Expense Tracker</h1>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>

      <div className="summary-cards">
        <div className="card">
          <h3>Balance</h3>
          <p>₹{balance.toFixed(2)}</p>
        </div>
        <div className="card income">
          <h3>Income</h3>
          <p>+₹{income.toFixed(2)}</p>
        </div>
        <div className="card expense">
          <h3>Expense</h3>
          <p>-₹{expense.toFixed(2)}</p>
        </div>
      </div>

      {/* PIE CHART SECTION - THIS WAS MISSING */}
      {chartData.length > 0 && (
        <div className="chart-section" style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', marginBottom: '20px' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>Expenses by Category</h2>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ₹${value}`}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `₹${value}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="main-content">
        <div className="form-section">
          <h2>Add Transaction</h2>
          <form onSubmit={handleAddTransaction}>
            <input type="text" name="title" placeholder="Title (e.g. Groceries)" value={formData.title} onChange={handleChange} required />
            <input type="number" name="amount" placeholder="Amount" value={formData.amount} onChange={handleChange} required />
            <select name="type" value={formData.type} onChange={handleChange}>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
            <select name="category" value={formData.category} onChange={handleChange}>
              <option value="Food">Food</option>
              <option value="Transport">Transport</option>
              <option value="Bills">Bills</option>
              <option value="Job">Job</option>
              <option value="Other">Other</option>
            </select>
            <button type="submit">Add Transaction</button>
          </form>
        </div>

        <div className="list-section">
          <h2>Recent Transactions</h2>
          {transactions.length === 0 && <p>No transactions yet. Add one!</p>}
          {transactions.map((t) => (
            <div key={t._id} className={`transaction-item ${t.type}`}>
              <div>
                <strong>{t.title}</strong>
                <br />
                <small>{t.category}</small>
              </div>
              <div>
                <span className="amount">
                  {t.type === 'income' ? '+' : '-'}₹{t.amount}
                </span>
                <button className="delete-btn" style={{ marginLeft: '15px' }} onClick={() => handleDelete(t._id)}>X</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;