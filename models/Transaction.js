const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true, 
    trim: true 
  },
  amount: { 
    type: Number, 
    required: true, 
    min: 0 
  },
  category: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Category', 
    required: true 
  },
  type: { 
    type: String, 
    enum: ['income', 'expense'], 
    required: true 
  },
  date: { 
    type: Date, 
    required: true 
  },
  notes: { 
    type: String, 
    trim: true 
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema);