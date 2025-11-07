const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Import routes
const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const userRoutes = require('./utils/routes/userRoutes');
const expenseRoutes = require('./utils/routes/expenseRoutes');
const recurringExpenseRoutes = require('./utils/routes/recurringExpenseRoutes');
const ocrRoutes = require('./utils/routes/ocrRoutes');
const chatRoutes = require('./utils/routes/chatRoutes');

// Import middleware
const errorMiddleware = require('./middleware/errorMiddleware');
const { startAllJobs } = require('./services/scheduler');

const app = express();
const PORT = process.env.PORT || 5000;

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'https://hisabkitab-frontend.onrender.com', 'https://hisabkitab-ldis.onrender.com'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Main API Routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/transactions', transactionRoutes);

// Legacy Routes
app.use('/api/users', userRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/recurring-expenses', recurringExpenseRoutes);
app.use('/api/ocr', ocrRoutes);
app.use('/api/chat', chatRoutes);

// Error handling middleware
app.use(errorMiddleware);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ MongoDB connected');
  // Start cron jobs after DB connection
  startAllJobs();
})
.catch((err) => console.error('❌ MongoDB connection failed:', err));

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});