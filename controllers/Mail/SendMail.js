import PlatformMailService from '@/models/Platform_Mail_service';
import KeyService from '@/models/Key_Service';
import logger from '@/lib/logger';
import Mailservice from '@/models/Mail_service';

const SendMail = async (req, res) => {
    try {
        const { key } = req.query;
        const { data } = req.body;

        // Validate required inputs
        if (!key) {
            return res.status(400).json({
                message: "Missing Key",
                status: "NACK",
                statusCode: 400
            });
        }

        // Validate data
        if (!data || typeof data !== 'object' || Object.keys(data).length === 0) {
            return res.status(400).json({
                message: "Invalid data in request body",
                status: "NACK",
                statusCode: 400
            });
        }

        // Parse the key (userid-keyvalue)
        const [user_id, keyvalue] = key.split("-");
        if (!user_id || !keyvalue) {
            return res.status(400).json({
                message: "Key in invalid format, key must be in the format 'user_id-keyvalue'",
                status: "NACK",
                format: "user_id-keyvalue",
                example: "nobbie-dc55d183de0647261750180a70ab734c",
                statusCode: 400
            });
        }

        // Check if the user exists in the platform service
        const platformObj = await PlatformMailService.findOne({ user_id });
        if (!platformObj) {
            logger.warn(`Unauthorized access attempt by userId: ${user_id}`);
            return res.status(401).json({
                message: "Unauthorized access",
                status: "NACK",
                statusCode: 401
            });
        }

        // Check if a KeyService document exists for the user
        const keyObj = await KeyService.findOne({ platform: platformObj._id });
        if (!keyObj) {
            logger.warn(`KeyService not active for userId: ${user_id}`);
            return res.status(404).json({
                message: 'Key service not active',
                status: "NACK",
                statusCode: 404
            });
        }

        // Validate the key
        const presentkey = keyObj.keys.find((key) => key.value === keyvalue);
        if (!presentkey) {
            logger.warn(`Key not found for userId: ${user_id}, keyvalue: ${keyvalue}`);
            return res.status(404).json({
                message: 'Error: Key not present',
                status: "NACK",
                statusCode: 404
            });
        }

        // Check if the key has expired
        if (!presentkey.expiry || new Date(presentkey.expiry) < new Date()) {
            logger.warn(`Expired key used by userId: ${user_id}, keyvalue: ${keyvalue}`);
            return res.status(409).json({
                message: 'Error: Key expired',
                status: "NACK",
                expiry: presentkey.expiry,
                statusCode: 409
            });
        }

        // Map data to codes
        const codes = Object.keys(data).reduce((acc, key) => {
            if (key && data[key]) {
                acc.push({ code: key, value: data[key] });
            } else {
                logger.warn(`Invalid data field: ${key}, value: ${data[key]}`);
            }
            return acc;
        }, []);

        // Create mail service object
        const SendMailobj = new Mailservice({
            platform: platformObj._id,
            key: {
                keyRef: keyObj._id,
                keyName: presentkey.name
            },
            codes: codes
        });

        await SendMailobj.save();

        logger.info(`Email sent successfully for userId: ${user_id}`);
        return res.status(200).json({
            message: 'Email sent successfully',
            status: "ACK",
            statusCode: 200
        });
    } catch (error) {
        logger.error('Error sending email:', error);
        return res.status(500).json({
            message: 'Internal server error',
            status: "NACK",
            statusCode: 500,
            error: error.message
        });
    }
};

export default SendMail;
