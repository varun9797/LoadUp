import mongoose from 'mongoose';
import logger from './logger';
logger

const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/Loadup';

mongoose.connect(mongoUri)
    .then(() => logger.info('MongoDB connected...'))
    .catch((err: any) => logger.error('MongoDB connection error:', err));
