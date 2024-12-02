import KeyService from '../../models/Key_Service';
import logger from '../utils/logger';

export default DeleteKey = async (req, res) => {
    try {
        const { name } = req.body;
        const userId = req.headers['x-user-id'];

        if (!userId) {
            return res.status(400).json({ message: "Missing user ID in headers", status: "NACK" });
        }

        const keyObj = await KeyService.findOne({ platform: userId });

        if (!keyObj) {
            return res.status(404).json({ message: "No keys found for this platform", status: "NACK" });
        }

        const keyIndex = keyObj.keys.findIndex((key) => key.name === name);

        if (keyIndex === -1) {
            return res.status(404).json({ message: "Key not found", status: "NACK" });
        }

        // Remove the key
        keyObj.keys.splice(keyIndex, 1);

        // If no keys left, delete the entire object
        if (keyObj.keys.length === 0) {
            await KeyService.deleteOne({ platform: userId });
            return res.status(200).json({ message: 'Key object deleted as no keys remain' });
        }

        await keyObj.save();
        res.status(200).json({ message: 'Key deleted successfully', keyObj });
    } catch (error) {
        logger.error('Error deleting key:', error);
        res.status(500).json({ message: 'Error deleting key', error: error.message });
    }
};
