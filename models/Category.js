const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    trim: true, 
    unique: true 
  },
  type: { 
    type: String, 
    required: true, 
    enum: ['income', 'expense'] 
  },
  budget: {
    type: Number,
    default: 0,
    min: 0
  },
  spent: {
    type: Number,
    default: 0,
    min: 0
  }
}, { timestamps: true });

module.exports = mongoose.models.Category || mongoose.model('Category', categorySchema);