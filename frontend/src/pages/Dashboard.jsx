import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [formData, setFormData] = useState({ title: '', amount: '', type: 'expense', category: 'Food' });
  
  // NEW STATES FOR EDIT AND FILTER
  const [editId, setEditId] = useState(null); 
  const [filterMonth, setFilterMonth] = useState(''); 

  // Fetch transactions from backend when page loads
  const fetchTransactions = async () => {
    try {
      const response = await api.get('/api/transactions');
      setTransactions(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching transactions", error);
      setLoading(false);
      if (error.response?.status === 401) {
        navigate('/'); 
      }
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // --- FILTER LOGIC ---
  // This creates a new list of transactions based on the selected month
  const filteredTransactions = filterMonth 
    ? transactions.filter(t => new Date(t.date).getMonth() === parseInt(filterMonth))
    : transactions;

  // Calculate Totals (using the filtered list)
  const income = filteredTransactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
  const expense = filteredTransactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
  const balance = income - expense;

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- HANDLE ADD & UPDATE ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        // UPDATE existing transaction
        const response = await api.put(`/api/transactions/${editId}`, {
          ...formData,
          amount: Number(formData.amount)
        });
        // Replace the old transaction in the list with the updated one
        setTransactions(transactions.map(t => t._id === editId ? response.data : t));
        setEditId(null); // Exit edit mode
      } else {
        // ADD new transaction
        const response = await api.post('/api/transactions', {
          ...formData,
          amount: Number(formData.amount)
        });
        setTransactions([response.data, ...transactions]);
      }
      // Clear the form
      setFormData({ title: '', amount: '', type: 'expense', category: 'Food' });
    } catch (error) {
      console.error("Error saving transaction", error);
    }
  };

  // --- HANDLE DELETE ---
  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/transactions/${id}`);
      setTransactions(transactions.filter(t => t._id !== id));
    } catch (error) {
      console.error("Error deleting transaction", error);
    }
  };

  // --- HANDLE EDIT CLICK ---
  const handleEditClick = (transaction) => {
    setEditId(transaction._id);
    setFormData({
      title: transaction.title,
      amount: transaction.amount,
      type: transaction.type,
      category: transaction.category
    });
    window.scrollTo(0, 0); // Scroll up to the form
  };

  // Prepare data for the Pie Chart (using the filtered list)
  const chartData = filteredTransactions
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

  if (loading) return <div style={{ textAlign: 'center', marginTop: '50px', fontSize: '20px' }}>Loading your data...</div>;

  return (
    <div className="dashboard-container">
      <div className="navbar">
        <h1>Expense Tracker</h1>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>

      {/* MONTH FILTER DROPDOWN */}
      <div style={{ marginBottom: '20px', textAlign: 'right', background: 'white', padding: '10px 20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
        <label style={{ marginRight: '10px', fontWeight: 'bold' }}>Filter by Month:</label>
        <select 
          value={filterMonth} 
          onChange={(e) => setFilterMonth(e.target.value)}
          style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc', outline: 'none' }}
        >
          <option value="">All Months</option>
          <option value="0">January</option>
          <option value="1">February</option>
          <option value="2">March</option>
          <option value="3">April</option>
          <option value="4">May</option>
          <option value="5">June</option>
          <option value="6">July</option>
          <option value="7">August</option>
          <option value="8">September</option>
          <option value="9">October</option>
          <option value="10">November</option>
          <option value="11">December</option>
        </select>
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

      {/* PIE CHART SECTION */}
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
          <h2>{editId ? 'Edit Transaction' : 'Add Transaction'}</h2>
          <form onSubmit={handleSubmit}>
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
            
            <button type="submit">{editId ? 'Update Transaction' : 'Add Transaction'}</button>
            
            {/* CANCEL EDIT BUTTON */}
            {editId && (
              <button 
                type="button" 
                onClick={() => { setEditId(null); setFormData({ title: '', amount: '', type: 'expense', category: 'Food' }); }} 
                style={{ background: 'gray', marginTop: '5px' }}
              >
                Cancel Edit
              </button>
            )}
          </form>
        </div>

        <div className="list-section">
          <h2>Recent Transactions</h2>
          {filteredTransactions.length === 0 && <p>No transactions found for this month.</p>}
          
          {filteredTransactions.map((t) => (
            <div key={t._id} className={`transaction-item ${t.type}`}>
              <div>
                <strong>{t.title}</strong>
                <br />
                <small>{t.category} • {new Date(t.date).toLocaleDateString()}</small>
              </div>
              <div>
                <span className="amount">
                  {t.type === 'income' ? '+' : '-'}₹{t.amount}
                </span>
                <button className="delete-btn" style={{ marginLeft: '15px', color: '#1e90ff' }} onClick={() => handleEditClick(t)}>Edit</button>
                <button className="delete-btn" style={{ marginLeft: '10px' }} onClick={() => handleDelete(t._id)}>X</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;