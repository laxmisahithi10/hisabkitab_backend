const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    trim: true
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
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

// Compound index for user + name uniqueness
categorySchema.index({ user: 1, name: 1 }, { unique: true });

module.exports = mongoose.models.Category || mongoose.model('Category', categorySchema);