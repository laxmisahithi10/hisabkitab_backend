const express = require('express');
const { body } = require('express-validator');
const userController = require('../../controllers/userController');
const authMiddleware = require('../../middleware/authMiddleware');
const validateRequest = require('../../middleware/validateMiddleware');

const router = express.Router();

// Register
router.post(
  '/register',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  validateRequest,
  userController.register
);

// Login
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').exists().withMessage('Password is required'),
  ],
  validateRequest,
  userController.login
);

// Update parental contact info
router.put(
  '/parental-contact',
  authMiddleware,
  [
    body('parentEmail').optional().isEmail().withMessage('Valid email required'),
    body('parentPhone').optional().isMobilePhone('any').withMessage('Valid phone number required'),
  ],
  validateRequest,
  userController.updateParentalContact
);

module.exports = router;