import express from 'express';
import {
    createLoanProduct,
    applyForLoan,
    getMyLoans,
    getAllApplications,
    updateLoanStatus
} from '../controllers/loanController';
import { authenticate, authorizeAdmin } from '../middlewares/authMiddleware';

const router = express.Router();

// Public routes (none for now)

// Protected routes
router.use(authenticate);

// User routes
router.post('/apply', applyForLoan);
router.get('/my-loans', getMyLoans);

// Admin routes
router.post('/products', authorizeAdmin, createLoanProduct);
router.get('/applications', authorizeAdmin, getAllApplications);
router.put('/applications/:id/status', authorizeAdmin, updateLoanStatus);

export default router;
