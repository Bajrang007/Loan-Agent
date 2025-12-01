import express from 'express';
import { getRepayments, makePayment } from '../controllers/repaymentController';
import { authenticate } from '../middlewares/authMiddleware';

const router = express.Router();

router.use(authenticate);

router.get('/:loanId', getRepayments);
router.post('/pay', makePayment);

export default router;
