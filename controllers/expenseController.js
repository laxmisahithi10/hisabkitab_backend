const Expense = require('../models/Expense');
const mongoose = require('mongoose');

const addExpense = async (req, res, next) => {
  try {
    const { amount, category, date } = req.body;
    const expense = new Expense({
      user: req.user._id,
      amount,
      category,
      date,
    });
    await expense.save();
    res.status(201).json({ message: 'Expense added', expense });
  } catch (error) {
    next(error);
  }
};

const getExpenses = async (req, res, next) => {
  try {
    const { category, startDate, endDate } = req.query;
    const filter = { user: req.user._id };

    if (category) filter.category = category;
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = startDate;
      if (endDate) filter.date.$lte = endDate;
    }

    const expenses = await Expense.find(filter).sort({ date: -1 });
    res.json({ expenses });
  } catch (error) {
    next(error);
  }
};

const getInsights = async (req, res, next) => {
  try {
    const userId = mongoose.Types.ObjectId(req.user._id);

    const now = new Date();
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    // Aggregate expenses for food category for this and last month
    const foodCategory = 'food';

    const thisMonthExpenses = await Expense.aggregate([
      { $match: { user: userId, category: foodCategory, date: { $gte: startOfThisMonth, $lt: now } } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const lastMonthExpenses = await Expense.aggregate([
      { $match: { user: userId, category: foodCategory, date: { $gte: startOfLastMonth, $lte: endOfLastMonth } } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const thisMonthTotal = thisMonthExpenses.length ? thisMonthExpenses[0].total : 0;
    const lastMonthTotal = lastMonthExpenses.length ? lastMonthExpenses[0].total : 0;

    let percentageChange = 0;
    if (lastMonthTotal > 0) {
      percentageChange = ((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100;
    } else if (thisMonthTotal > 0) {
      percentageChange = 100;
    }

    // Savings calculation example: save ₹500/day
    const daysLeft = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate() - now.getDate() + 1;
    const dailySaving = 500;
    const potentialSaving = dailySaving * daysLeft;

    res.json({
      insights: [
        `This month you spent ${percentageChange.toFixed(2)}% ${percentageChange >= 0 ? 'more' : 'less'} on food than last month.`,
        `If you save ₹${dailySaving}/day, you can save ₹${potentialSaving} this month.`,
      ],
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addExpense,
  getExpenses,
  getInsights,
};