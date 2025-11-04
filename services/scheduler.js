const cron = require('node-cron');
const Expense = require('../models/Expense');
const RecurringExpense = require('../models/RecurringExpense');
const User = require('../models/User');
const mailService = require('./mailService');
const smsService = require('./smsService');
const mongoose = require('mongoose');

// Helper: generate monthly report summary for user
async function generateMonthlyReport(userId) {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const expenses = await Expense.find({
    user: userId,
    date: { $gte: startOfMonth, $lte: endOfMonth },
  });

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  const byCategory = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {});

  let reportHTML = `<h2>Monthly Expense Report</h2><p>Total spent: ₹${total.toFixed(2)}</p><ul>`;
  for (const [cat, amt] of Object.entries(byCategory)) {
    reportHTML += `<li>${cat}: ₹${amt.toFixed(2)}</li>`;
  }
  reportHTML += '</ul>';

  return reportHTML;
}

// Send report email & sms
async function sendMonthlyReportToParent(user) {
  const report = await generateMonthlyReport(user._id);

  if (user.parentEmail) {
    await mailService.sendEmail(user.parentEmail, 'Hisab-Kitab Monthly Expense Report', report);
  }
  if (user.parentPhone) {
    await smsService.sendSMS(user.parentPhone, `Monthly Expense Report for your child:\nTotal spent this month.`);
  }
}

// Check and create recurring expenses if due
async function processRecurringExpenses() {
  const now = new Date();
  const recurringExpenses = await RecurringExpense.find({ nextDueDate: { $lte: now } });

  for (const recExp of recurringExpenses) {
    // Create expense entry
    const expense = new Expense({
      user: recExp.user,
      amount: recExp.amount,
      category: recExp.category,
      date: recExp.nextDueDate,
    });
    await expense.save();

    // Update nextDueDate
    let nextDate = new Date(recExp.nextDueDate);
    switch (recExp.frequency) {
      case 'daily':
        nextDate.setDate(nextDate.getDate() + 1);
        break;
      case 'weekly':
        nextDate.setDate(nextDate.getDate() + 7);
        break;
      case 'monthly':
        nextDate.setMonth(nextDate.getMonth() + 1);
        break;
      case 'yearly':
        nextDate.setFullYear(nextDate.getFullYear() + 1);
        break;
    }
    recExp.nextDueDate = nextDate;
    await recExp.save();
  }
    }

// Cron jobs

// Run monthly on 1st at 00:05 to send reports
const monthlyReportJob = cron.schedule('5 0 1 * *', async () => {
  try {
    const users = await User.find({ $or: [{ parentEmail: { $exists: true, $ne: '' } }, { parentPhone: { $exists: true, $ne: '' } }] });
    for (const user of users) {
      await sendMonthlyReportToParent(user);
    }
  } catch (error) {
    console.error('Monthly report job error:', error);
  }
});

// Run daily at 01:00 to check recurring expenses
const recurringExpensesJob = cron.schedule('0 1 * * *', async () => {
  try {
    await processRecurringExpenses();
  } catch (error) {
    console.error('Recurring expenses job error:', error);
  }
});

function startAllJobs() {
  monthlyReportJob.start();
  recurringExpensesJob.start();
}

module.exports = { startAllJobs };