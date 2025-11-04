const mongoose = require('mongoose');

const recurringExpenseSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true, min: 0 },
  category: { type: String, required: true, trim: true },
  frequency: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'yearly'],
    required: true
  },
  nextDueDate: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.RecurringExpense || mongoose.model('RecurringExpense', recurringExpenseSchema);