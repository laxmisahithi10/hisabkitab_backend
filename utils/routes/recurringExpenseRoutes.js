const express = require('express');
const { body } = require('express-validator');
const recurringExpenseController = require('../../controllers/recurringExpenseController');
const authMiddleware = require('../../middleware/authMiddleware');
const validateRequest = require('../../middleware/validateMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.post(
  '/',
  [
    body('amount').isFloat({ gt: 0 }).withMessage('Amount must be greater than 0'),
    body('category').isString().trim().notEmpty().withMessage('Category is required'),
    body('frequency').isIn(['daily', 'weekly', 'monthly', 'yearly']).withMessage('Frequency invalid'),
    body('nextDueDate').isISO8601().toDate().withMessage('Valid nextDueDate is required'),
  ],
  validateRequest,
  recurringExpenseController.addRecurringExpense
);

router.get('/', recurringExpenseController.getRecurringExpenses);

module.exports = router;