import mongoose from 'mongoose';
const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/loadup';
console.log('Mongo URI:', mongoUri);
import logger from './logger';

const connectMongo = () => {
    return new Promise((resolve, reject) => {
        mongoose.connect(mongoUri)
            .then(() => {
                logger.info('MongoDB connected...');
                resolve(true);
            }).catch((err: any) => {
                logger.error('MongoDB connection error:', err);
                reject(err);
            });
    })
}

export default connectMongo;