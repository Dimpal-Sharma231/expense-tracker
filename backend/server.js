const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors({
    origin: 'https://expense-tracker-pi4i-ee47mrzqi-jaipurites.vercel.app'
}));
app.use(express.json());

// CONNECT ROUTES
const authRoutes = require('./routes/authRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);

// TEST ROUTE
app.get('/', (req, res) => {
    res.send('Expense Tracker API is running...');
});

// DATABASE CONNECTION
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB Connected Successfully'))
    .catch((err) => console.log('❌ MongoDB Connection Error: ', err.message));

// START SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});