const express = require('express');
const { body, validationResult } = require('express-validator');
const Transaction = require('../models/Transaction');
const Category = require('../models/Category');

const router = express.Router();

// GET /api/transactions - Fetch all transactions with optional filters
router.get('/', async (req, res) => {
  try {
    const { category, dateRange, type } = req.query;
    let filter = {};

    // Apply filters
    if (category) filter.category = category;
    if (type) filter.type = type;
    if (dateRange) {
      const [startDate, endDate] = dateRange.split(',');
      if (startDate && endDate) {
        filter.date = {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        };
      }
    }

    const transactions = await Transaction.find(filter)
      .populate('category', 'name type budget spent')
      .sort({ date: -1 });

    res.json({ success: true, transactions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/transactions - Add a transaction
router.post('/', [
  body('title').notEmpty().trim().withMessage('Title is required'),
  body('amount').isFloat({ gt: 0 }).withMessage('Amount must be greater than 0'),
  body('category').isMongoId().withMessage('Valid category ID is required'),
  body('type').isIn(['income', 'expense']).withMessage('Type must be income or expense'),
  body('date').isISO8601().withMessage('Valid date is required'),
  body('notes').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { title, amount, category, type, date, notes } = req.body;
    
    // Verify category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({ success: false, message: 'Category not found' });
    }

    const transaction = new Transaction({
      title,
      amount,
      category,
      type,
      date,
      notes
    });

    await transaction.save();
    
    // Update category spent amount if it's an expense
    if (type === 'expense') {
      await Category.findByIdAndUpdate(category, {
        $inc: { spent: amount }
      });
    }
    
    await transaction.populate('category', 'name type budget spent');
    
    res.status(201).json({ success: true, transaction });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /api/transactions/:id - Delete transaction by ID
router.delete('/:id', async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    // Update category spent amount if it's an expense
    if (transaction.type === 'expense') {
      await Category.findByIdAndUpdate(transaction.category, {
        $inc: { spent: -transaction.amount }
      });
    }

    await Transaction.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Transaction deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;