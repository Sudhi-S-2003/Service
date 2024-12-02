import KeyService from '../../models/Key_Service';
import logger from '../utils/logger';

export default UpdateKey = async (req, res) => {
    try {
        const { name, value, expiry } = req.body;
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

        // Update the key
        keyObj.keys[keyIndex] = {
            name,
            value,
            expiry: expiry || keyObj.keys[keyIndex].expiry,
        };
        await keyObj.save();

        res.status(200).json({ message: 'Key updated successfully', keyObj });
    } catch (error) {
        logger.error('Error updating key:', error);
        res.status(500).json({ message: 'Error updating key', error: error.message });
    }
};
