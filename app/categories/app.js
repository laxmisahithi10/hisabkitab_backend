require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const logger = require('./utils/logger');
const errorMiddleware = require('./middlewares/errorMiddleware');
const expenseRoutes = require('./routes/expenseRoutes');
const recurringExpenseRoutes = require('./routes/recurringExpenseRoutes');
const ocrRoutes = require('./routes/ocrRoutes');
const chatRoutes = require('./routes/chatRoutes');
const userRoutes = require('./routes/userRoutes');
const scheduler = require('./services/scheduler');

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/expenses', expenseRoutes);
app.use('/api/recurring-expenses', recurringExpenseRoutes);
app.use('/api/upload-bill', ocrRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/users', userRoutes);

// Error handling middleware (should be last)
app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    logger.info('Connected to MongoDB');
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
    // Start scheduler after DB connection
    scheduler.startAllJobs();
  })
  .catch((err) => {
    logger.error('MongoDB connection error:', err);
  });