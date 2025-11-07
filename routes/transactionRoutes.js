const express = require('express');
const { body } = require('express-validator');
const { getTransactions, createTransaction, updateTransaction, deleteTransaction } = require('../controllers/transactionController');
const authMiddleware = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateMiddleware');

const router = express.Router();

// Protect all transaction routes
router.use(authMiddleware);

// GET /api/transactions
router.get('/', getTransactions);

// POST /api/transactions
router.post('/', [
  body('amount').isFloat({ gt: 0 }).withMessage('Amount must be greater than 0'),
  body('description').notEmpty().withMessage('Description is required'),
  body('category').isMongoId().withMessage('Valid category ID is required'),
  body('type').isIn(['income', 'expense']).withMessage('Type must be income or expense'),
  body('date').isISO8601().withMessage('Valid date is required')
], validateRequest, createTransaction);

// PUT /api/transactions/:id
router.put('/:id', [
  body('amount').isFloat({ gt: 0 }).withMessage('Amount must be greater than 0'),
  body('description').notEmpty().withMessage('Description is required'),
  body('category').isMongoId().withMessage('Valid category ID is required'),
  body('type').isIn(['income', 'expense']).withMessage('Type must be income or expense'),
  body('date').isISO8601().withMessage('Valid date is required')
], validateRequest, updateTransaction);

// DELETE /api/transactions/:id
router.delete('/:id', deleteTransaction);

module.exports = router;