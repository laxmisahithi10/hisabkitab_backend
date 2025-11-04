const RecurringExpense = require('../models/recurringexpense');

const addRecurringExpense = async (req, res, next) => {
  try {
    const { amount, category, frequency, nextDueDate } = req.body;
    const recurringExpense = new RecurringExpense({
      user: req.user._id,
      amount,
      category,
      frequency,
      nextDueDate,
    });
    await recurringExpense.save();
    res.status(201).json({ message: 'Recurring expense added', recurringExpense });
  } catch (error) {
    next(error);
  }
};

const getRecurringExpenses = async (req, res, next) => {
  try {
    const expenses = await RecurringExpense.find({ user: req.user._id }).sort({ nextDueDate: 1 });
    res.json({ recurringExpenses: expenses });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addRecurringExpense,
  getRecurringExpenses,
};