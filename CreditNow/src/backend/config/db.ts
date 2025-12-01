import mongoose from 'mongoose';

export const connectMongoDB = async () => {
    try {
        const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/loan_management_system';
        await mongoose.connect(mongoURI);
        console.log('MongoDB Connected');
    } catch (error) {
        console.error('MongoDB Connection Error:', error);
        process.exit(1);
    }
};
