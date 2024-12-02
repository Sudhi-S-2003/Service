import KeyService from '../../models/Key_Service';
import PlatformMailService from '../../models/Platform_Mail_service';
import logger from '../utils/logger';

export default CreateKey = async (req, res) => {
    try {
        const { name, value, expiry } = req.body;
        const userId = req.headers['x-user-id'];

        if (!userId) {
            return res.status(400).json({ message: "Missing user ID in headers", status: "NACK" });
        }

        const platformObj = await PlatformMailService.findById(userId);
        if (!platformObj) {
            return res.status(400).json({ message: "Unauthorized", status: "NACK" });
        }

        const keyObj = await KeyService.findOne({ platform: userId });
        const keyExpiry = expiry || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // Default to 30 days

        if (!keyObj) {
            // Create a new key object
            const newKey = new KeyService({
                platform: userId,
                keys: [{ name, value, expiry: keyExpiry }],
            });
            await newKey.save();
            return res.status(200).json({ message: 'Key created successfully', newKey });
        }

        // Check for duplicate keys
        const duplicateKey = keyObj.keys.find((key) => key.name === name);
        if (duplicateKey) {
            return res.status(400).json({ message: 'Error: Key already exists', status: "NACK" });
        }

        // Add the new key
        keyObj.keys.push({ name, value, expiry: keyExpiry });
        await keyObj.save();
        res.status(200).json({ message: 'Key added successfully', keyObj });
    } catch (error) {
        logger.error('Error creating key:', error);
        res.status(500).json({ message: 'Error creating key', error: error.message });
    }
};
