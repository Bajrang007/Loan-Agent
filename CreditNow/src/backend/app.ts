import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './routes/authRoutes';
import loanRoutes from './routes/loanRoutes';
import documentRoutes from './routes/documentRoutes';
import repaymentRoutes from './routes/repaymentRoutes';

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/repayments', repaymentRoutes);

app.get('/', (req, res) => {
    res.send('Loan Management System API is running');
});

export default app;
