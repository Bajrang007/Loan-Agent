import express from 'express';
import { upload, uploadDocument, verifyDocument, getPendingDocuments, getMyDocuments } from '../controllers/documentController';
import { authenticate, authorizeAdmin } from '../middlewares/authMiddleware';

const router = express.Router();

router.use(authenticate);

// User: Upload
router.post('/upload', upload.single('document'), uploadDocument);
router.get('/my-documents', getMyDocuments);

// Admin: Verify & View
router.put('/:id/verify', authorizeAdmin, verifyDocument);
router.get('/pending', authorizeAdmin, getPendingDocuments);

export default router;
