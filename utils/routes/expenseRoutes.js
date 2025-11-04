const express = require('express');
const { body, query } = require('express-validator');
const expenseController = require('../../controllers/expenseController');
const authMiddleware = require('../../middleware/authMiddleware');
const validateRequest = require('../../middleware/validateMiddleware');

const router = express.Router();

router.use(authMiddleware);

// POST /add-expense
router.post(
  '/add-expense',
  [
    body('amount').isFloat({ gt: 0 }).withMessage('Amount must be greater than 0'),
    body('category').isString().trim().notEmpty().withMessage('Category is required'),
    body('date').isISO8601().toDate().withMessage('Valid date is required'),
  ],
  validateRequest,
  expenseController.addExpense
);

// GET /expenses with optional filters ?category=&startDate=&endDate=
router.get(
  '/',
  [
    query('category').optional().isString().trim(),
    query('startDate').optional().isISO8601().toDate(),
    query('endDate').optional().isISO8601().toDate(),
  ],
  validateRequest,
  expenseController.getExpenses
);

// GET /insights
router.get('/insights', expenseController.getInsights);

module.exports = router;