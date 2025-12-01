import express from 'express';
import { upload, uploadDocument, verifyDocument, getPendingDocuments } from '../controllers/documentController';
import { authenticate, authorizeAdmin } from '../middlewares/authMiddleware';

const router = express.Router();

router.use(authenticate);

// User: Upload
router.post('/upload', upload.single('document'), uploadDocument);

// Admin: Verify & View
router.put('/:id/verify', authorizeAdmin, verifyDocument);
router.get('/pending', authorizeAdmin, getPendingDocuments);

export default router;
