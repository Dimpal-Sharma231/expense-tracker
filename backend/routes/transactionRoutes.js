const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const { protect } = require('../middleware/authMiddleware');

// @route   POST /api/transactions
// @desc    Add a transaction
router.post('/', protect, async (req, res) => {
    try {
        const { title, amount, type, category } = req.body;

        const transaction = await Transaction.create({
            user: req.user.id, // We get this from the authMiddleware
            title,
            amount,
            type,
            category
        });

        res.status(201).json(transaction);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   GET /api/transactions
// @desc    Get all user transactions
router.get('/', protect, async (req, res) => {
    try {
        // Only find transactions where the user matches the logged-in user
        const transactions = await Transaction.find({ user: req.user.id }).sort({ date: -1 });
        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   DELETE /api/transactions/:id
// @desc    Delete a transaction
router.delete('/:id', protect, async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);

        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        // Make sure the logged-in user matches the transaction owner
        if (transaction.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await transaction.deleteOne();
        res.status(200).json({ message: 'Transaction removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;