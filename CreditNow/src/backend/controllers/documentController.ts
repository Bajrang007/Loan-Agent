import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middlewares/authMiddleware';
import multer from 'multer';
import path from 'path';

const prisma = new PrismaClient();

// Multer config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

// File filter to allow only specific image types
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Only .jpg, .jpeg, and .png files are allowed!'));
    }
};

export const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// User: Upload Document
export const uploadDocument = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const { documentType, type } = req.body; // Accept both for compatibility
        const userId = req.user!.id;

        const document = await prisma.userDocument.create({
            data: {
                userId,
                documentType: documentType || type, // Use documentType if available, fallback to type
                documentUrl: req.file.path,
                status: 'PENDING'
            }
        });

        res.status(201).json(document);
    } catch (error) {
        console.error('Document upload error:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};

// Admin: Verify Document
export const verifyDocument = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // VERIFIED, REJECTED
        const adminId = req.user!.id;

        const document = await prisma.userDocument.update({
            where: { id: Number(id) },
            data: { status }
        });

        // Log admin action
        await prisma.adminAction.create({
            data: {
                adminId,
                action: 'VERIFY_DOCUMENT',
                note: `Document ${id} ${status} by admin`
            }
        });

        res.json(document);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Admin: Get Pending Documents
export const getPendingDocuments = async (req: AuthRequest, res: Response) => {
    try {
        const documents = await prisma.userDocument.findMany({
            where: { status: 'PENDING' },
            include: { user: true }
        });
        res.json(documents);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// User: Get My Documents
export const getMyDocuments = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!.id;
        const documents = await prisma.userDocument.findMany({
            where: { userId },
            orderBy: { uploadedAt: 'desc' }
        });
        res.json(documents);
    } catch (error) {
        console.error('Get documents error:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};
