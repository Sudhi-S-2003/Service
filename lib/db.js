import mongoose from 'mongoose';
import logger from './logger';

const connectMongo = async () => {
  if (mongoose.connection.readyState >= 1) return;
  logger.info('MongoDB connecting');
  return mongoose.connect(process.env.MONGODB_URI);
  
};

export default connectMongo;
