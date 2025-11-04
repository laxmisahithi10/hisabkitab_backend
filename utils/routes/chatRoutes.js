const express = require('express');
const { body } = require('express-validator');
const chatController = require('../../controllers/chatController');
const authMiddleware = require('../../middleware/authMiddleware');
const validateRequest = require('../../middleware/validateMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.post(
  '/',
  [body('message').isString().trim().notEmpty().withMessage('Message is required')],
  validateRequest,
  chatController.chat
);

module.exports = router;