const express = require('express');
const { body } = require('express-validator');
const { signup, login } = require('../controllers/authController');
const validateRequest = require('../middleware/validateMiddleware');

const router = express.Router();

// POST /api/auth/signup
router.post('/signup', [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], validateRequest, signup);

// POST /api/auth/login
router.post('/login', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
], validateRequest, login);

module.exports = router;