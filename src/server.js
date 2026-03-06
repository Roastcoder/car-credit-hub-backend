import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import loanRoutes from './routes/loans.js';
import bankRoutes from './routes/banks.js';
import brokerRoutes from './routes/brokers.js';
import userRoutes from './routes/users.js';
import dashboardRoutes from './routes/dashboard.js';
import leadRoutes from './routes/leads.js';
import commissionRoutes from './routes/commissions.js';
import reportRoutes from './routes/reports.js';
import branchRoutes from './routes/branches.js';
import { logger } from './middleware/logger.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/banks', bankRoutes);
app.use('/api/brokers', brokerRoutes);
app.use('/api/users', userRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/commissions', commissionRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/branches', branchRoutes);

app.get('/', (req, res) => {
  res.json({ 
    message: 'Car Credit Hub API', 
    version: '1.0.0',
    status: 'running',
    author: 'Built by RoastCoder'
  });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
