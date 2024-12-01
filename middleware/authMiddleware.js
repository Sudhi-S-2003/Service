import jwt from 'jsonwebtoken';
import PlatformMailService from '../models/PlatformMailService';
import logger from '../utils/logger';

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await PlatformMailService.findById(decoded._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    logger.error('Error in auth middleware:', error);
    res.status(401).json({ message: 'Authentication failed' });
  }
};

export default authMiddleware;
