const express = require('express');
const { body, validationResult } = require('express-validator');
const Category = require('../models/Category');

const router = express.Router();

// GET /api/categories - Fetch all categories (sorted alphabetically)
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json({ success: true, categories });
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
    const category = new Category({ name, type, budget });
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
    const category = await Category.findByIdAndUpdate(
      req.params.id,
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
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    res.json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;