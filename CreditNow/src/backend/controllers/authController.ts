import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { validateAndCorrectName, validateEmail, validatePhoneNumber, validatePassword } from '../utils/validation';

const prisma = new PrismaClient();

export const register = async (req: Request, res: Response) => {
    try {
        const { name, email, password, phone, address, role } = req.body;

        // Validate and auto-correct input fields
        const nameValidation = validateAndCorrectName(name);
        if (!nameValidation.isValid) {
            return res.status(400).json({ message: nameValidation.error });
        }

        const emailValidation = validateEmail(email);
        if (!emailValidation.isValid) {
            return res.status(400).json({ message: emailValidation.error });
        }

        const phoneValidation = validatePhoneNumber(phone);
        if (!phoneValidation.isValid) {
            return res.status(400).json({ message: phoneValidation.error });
        }

        // Validate password
        const passwordValidation = validatePassword(password);
        if (!passwordValidation.isValid) {
            return res.status(400).json({ message: passwordValidation.error });
        }

        // Use corrected values
        const correctedName = nameValidation.correctedValue || name;
        const correctedEmail = emailValidation.correctedValue || email;
        const correctedPhone = phoneValidation.correctedValue || phone;

        // Check for existing user by email
        const existingUserByEmail = await prisma.user.findUnique({
            where: { email: correctedEmail }
        });

        if (existingUserByEmail) {
            return res.status(409).json({
                message: 'User already exists with this email. Please log in instead.',
                field: 'email',
                action: 'login'
            });
        }

        // Check for existing user by phone
        const existingUserByPhone = await prisma.user.findFirst({
            where: { phone: correctedPhone }
        });

        if (existingUserByPhone) {
            return res.status(409).json({
                message: 'This phone number is already in use by another account.',
                field: 'phone',
                action: 'login'
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Create user with corrected values
        const user = await prisma.user.create({
            data: {
                name: correctedName,
                email: correctedEmail,
                phone: correctedPhone,
                passwordHash,
                address,
                role: role || 'USER'
            }
        });

        res.status(201).json({
            message: 'User registered successfully',
            userId: user.id,
            email: user.email
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        // Validate email format
        const emailValidation = validateEmail(email);
        if (!emailValidation.isValid) {
            return res.status(400).json({ message: emailValidation.error });
        }

        // Find user
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate JWT
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET || 'secret_key',
            { expiresIn: '1d' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getMe = async (req: any, res: Response) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                role: true,
                createdAt: true
            }
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error('Get Me error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const logout = async (req: Request, res: Response) => {
    // Since we are using JWTs, we can't really "invalidate" them without a blacklist.
    // For now, we just send a success response and the client should remove the token.
    res.json({ message: 'Logged out successfully' });
};
