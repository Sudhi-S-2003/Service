import PlatformMailService from '@/models/Platform_Mail_service';
import KeyService from '@/models/Key_Service';
import logger from '@/lib/logger';
import crypto from 'crypto'; // To generate a random key value

const CreateKey = async (req, res) => {
    try {
        const { name, expiry } = req.body;
        const userId = req.headers['x-user-id'];

        // Validate required inputs
        if (!userId) {
            return res.status(400).json({ message: "Missing user ID in headers", status: "NACK" });
        }
        if (!name) {
            return res.status(400).json({ message: "Missing name", status: "NACK" });
        }

        // Generate a random key value
        const value = crypto.randomBytes(16).toString('hex');

        // Check if the user exists in the platform service
        const platformObj = await PlatformMailService.findById(userId);
        if (!platformObj) {
            return res.status(401).json({ message: "Unauthorized access", status: "NACK" });
        }

        // Check if a KeyService document exists for the user
        const keyObj = await KeyService.findOne({ platform: userId });
        const keyExpiry = expiry || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // Default expiry: 30 days

        if (!keyObj) {
            // Create a new key document if none exists
            const newKey = new KeyService({
                platform: userId,
                keys: [{ name, value, expiry: keyExpiry }],
            });
            await newKey.save();
            return res.status(201).json({ message: 'Key created successfully', key: { name, value, expiry: keyExpiry } });
        }

        // Check for duplicate key names
        const duplicateKey = keyObj.keys.find((key) => key.name === name);
        if (duplicateKey) {
            return res.status(409).json({ message: 'Error: Key with this name already exists', status: "NACK" });
        }

        // Add the new key to the existing document
        keyObj.keys.push({ name, value, expiry: keyExpiry });
        await keyObj.save();

        res.status(200).json({ message: 'Key added successfully', key: { name, value, expiry: keyExpiry } });
    } catch (error) {
        logger.error('Error creating key:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

export default CreateKey;
