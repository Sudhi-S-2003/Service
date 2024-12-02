import KeyService from '@/models/Key_Service';
import logger from '@/lib/logger';

const GetKey = async (req, res) => {
    try {
        //  GET /api/Platform_service/service/key?platformId=123&keyName=testKey
        let { platformId, keyName } = req.query;
        platformId = platformId || req.headers['x-user-id'];
        
        if (!platformId) {
            return res.status(400).json({ message: "Platform ID is required", status: "NACK" });
        }

        const keyService = await KeyService.findOne({ platform: platformId });

        if (!keyService) {
            return res.status(404).json({ message: "No keys found for the specified platform", status: "NACK" });
        }

        // If keyName is provided, fetch specific key
        if (keyName) {
            const isActive = keyService.isKeyActive(keyName);

            if (!isActive) {
                return res.status(404).json({ message: "Key is not active or does not exist", status: "NACK" });
            }

            const key = keyService.keys.find((key) => key.name === keyName);
            return res.status(200).json({ message: "Key retrieved successfully", key });
        }

        // If no keyName, fetch all active keys for the platform
        const activeKeys = await KeyService.getActiveKeysByPlatform(platformId);

        if (activeKeys.length === 0) {
            return res.status(404).json({ message: "No active keys found", status: "NACK" });
        }

        res.status(200).json({ message: "Active keys retrieved successfully", activeKeys });
    } catch (error) {
        logger.error('Error retrieving keys:', error);
        res.status(500).json({ message: 'Error retrieving keys', error: error.message });
    }
};
export default GetKey