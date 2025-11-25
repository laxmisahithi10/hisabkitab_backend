const express = require('express');
const { body, validationResult } = require('express-validator');
const Category = require('../models/Category');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Protect all category routes
router.use(authMiddleware);

// GET /api/categories - Fetch all categories (sorted alphabetically)
router.get('/', async (req, res) => {
  try {
    // Debug logging
    console.log('🔍 User ID from token:', req.user.id);
    console.log('🔍 User _id from token:', req.user._id);
    console.log('🔍 Full user object:', req.user);
    
    const allCategories = await Category.find({});
    console.log('🔍 All categories in DB:', allCategories.length);
    console.log('🔍 Sample category user field:', allCategories[0]?.user);
    
    const userCategories = await Category.find({ user: req.user._id }).sort({ name: 1 });
    console.log('🔍 User categories found:', userCategories.length);
    
    res.json({ success: true, categories: userCategories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/categories - Add a new category
router.post('/', [
  body('name').notEmpty().trim().withMessage('Category name is required'),
  body('type').isIn(['income', 'expense']).withMessage('Type must be income or expense'),
  body('budget').optional().isFloat({ min: 0 }).withMessage('Budget must be a positive number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, type, budget = 0 } = req.body;
    const category = new Category({ name, type, budget, user: req.user._id });
    await category.save();
    
    res.status(201).json({ success: true, category });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Category name already exists' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/categories/:id - Update a category
router.put('/:id', [
  body('name').optional().notEmpty().trim().withMessage('Category name is required'),
  body('type').optional().isIn(['income', 'expense']).withMessage('Type must be income or expense'),
  body('budget').optional().isFloat({ min: 0 }).withMessage('Budget must be a positive number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, type, budget } = req.body;
    const category = await Category.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { name, type, budget },
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    res.json({ success: true, category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /api/categories/:id - Delete a category by ID
router.delete('/:id', async (req, res) => {
  try {
    const category = await Category.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    res.json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;