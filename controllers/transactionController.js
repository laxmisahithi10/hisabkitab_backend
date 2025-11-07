const Transaction = require('../models/Transaction');

const getTransactions = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, type, startDate, endDate } = req.query;
    
    const filter = { user: req.user._id };
    if (category) filter.category = category;
    if (type) filter.type = type;
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const transactions = await Transaction.find(filter)
      .populate('category', 'name color icon')
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Transaction.countDocuments(filter);

    res.json({
      success: true,
      transactions,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createTransaction = async (req, res) => {
  try {
    const { amount, description, category, type, date } = req.body;
    
    const transaction = await Transaction.create({
      amount,
      description,
      category,
      type,
      date,
      user: req.user._id
    });

    await transaction.populate('category', 'name color icon');

    res.status(201).json({ success: true, transaction });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, description, category, type, date } = req.body;

    const transaction = await Transaction.findOneAndUpdate(
      { _id: id, user: req.user._id },
      { amount, description, category, type, date },
      { new: true, runValidators: true }
    ).populate('category', 'name color icon');

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.json({ success: true, transaction });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    const transaction = await Transaction.findOneAndDelete({ _id: id, user: req.user._id });

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.json({ success: true, message: 'Transaction deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getTransactions, createTransaction, updateTransaction, deleteTransaction };