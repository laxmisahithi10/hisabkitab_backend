const express = require('express');
const { body } = require('express-validator');
const { getCategories, createCategory, updateCategory, deleteCategory } = require('../controllers/categoryController');
const authMiddleware = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateMiddleware');

const router = express.Router();

// Protect all category routes
router.use(authMiddleware);

// GET /api/categories
router.get('/', getCategories);

// POST /api/categories
router.post('/', [
  body('name').notEmpty().withMessage('Category name is required')
], validateRequest, createCategory);

// PUT /api/categories/:id
router.put('/:id', [
  body('name').notEmpty().withMessage('Category name is required')
], validateRequest, updateCategory);

// DELETE /api/categories/:id
router.delete('/:id', deleteCategory);

module.exports = router;