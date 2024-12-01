import PlatformMailService from '../models/PlatformMailService';
import logger from '../utils/logger';

export const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const userId = req.user._id; // user is populated via authMiddleware

    const updatedUser = await PlatformMailService.findByIdAndUpdate(userId, { name, email }, { new: true });
    res.status(200).json({ message: 'Profile updated successfully', updatedUser });
  } catch (error) {
    logger.error('Error updating profile:', error);
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
};
