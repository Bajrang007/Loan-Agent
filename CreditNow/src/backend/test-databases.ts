import { PrismaClient } from '@prisma/client';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

// MongoDB Schema for Audit Logs (matching mongo-schema.js)
const auditLogSchema = new mongoose.Schema({
    userId: { type: Number, required: true },
    action: { type: String, required: true },
    details: { type: Object },
    ipAddress: { type: String },
    timestamp: { type: Date, default: Date.now },
});

const AuditLog = mongoose.models.AuditLog || mongoose.model('AuditLog', auditLogSchema, 'audit_logs');

async function testMySQL() {
    console.log('\n--- Testing MySQL (Prisma) ---');
    try {
        // 1. Create a User
        const userEmail = `testuser_${Date.now()}@example.com`;
        const user = await prisma.user.create({
            data: {
                name: 'Test User',
                email: userEmail,
                passwordHash: 'hashed_password',
                phone: `555-${Date.now()}`,
            },
        });
        console.log('✅ Created User:', user.id, user.email);

        // 2. Create a Loan Product
        const product = await prisma.loanProduct.create({
            data: {
                title: 'Test Loan Product',
                interestRate: 10.5,
                maxAmount: 50000,
                minAmount: 1000,
                tenureMonths: 12,
            },
        });
        console.log('✅ Created Loan Product:', product.id, product.title);

        // 3. Create a Loan Application
        const loan = await prisma.loanApplication.create({
            data: {
                userId: user.id,
                productId: product.id,
                amount: 5000,
                tenure: 12,
                interestRate: 10.5,
            },
        });
        console.log('✅ Created Loan Application:', loan.id, 'Status:', loan.status);

        // 4. Clean up
        await prisma.loanApplication.delete({ where: { id: loan.id } });
        await prisma.loanProduct.delete({ where: { id: product.id } });
        await prisma.user.delete({ where: { id: user.id } });
        console.log('✅ Cleaned up MySQL test data');

    } catch (error) {
        console.error('❌ MySQL Test Failed:', error);
        throw error;
    }
}

async function testMongoDB() {
    console.log('\n--- Testing MongoDB (Mongoose) ---');
    try {
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI is not defined in .env');
        }

        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // 1. Create an Audit Log
        const logEntry = await AuditLog.create({
            userId: 123, // Mock ID
            action: 'TEST_ACTION',
            details: { test: true, description: 'Testing MongoDB connection' },
            ipAddress: '127.0.0.1',
        });
        console.log('✅ Created Audit Log:', logEntry._id);

        // 2. Query the Log
        const foundLog = await AuditLog.findById(logEntry._id);
        if (foundLog) {
            console.log('✅ Retrieved Audit Log:', foundLog.action);
        } else {
            console.error('❌ Failed to retrieve Audit Log');
        }

        // 3. Clean up
        await AuditLog.deleteOne({ _id: logEntry._id });
        console.log('✅ Cleaned up MongoDB test data');

        await mongoose.disconnect();
        console.log('✅ Disconnected from MongoDB');

    } catch (error) {
        console.error('❌ MongoDB Test Failed:', error);
        throw error;
    }
}

async function main() {
    try {
        await testMySQL();
        await testMongoDB();
        console.log('\n🎉 All Database Tests Passed!');
    } catch (error) {
        console.error('\n💥 Some tests failed.');
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
