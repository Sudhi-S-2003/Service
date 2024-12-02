import CreateKey from '../../../../../../controllers/Key/CreateKey';
import DeleteKey from '../../../../../../controllers/Key/DeleteKey';
import GetKey from '../../../../../../controllers/Key/GetKey';
import Updatekey from '../../../../../../controllers/Key/Updatekey';

export default async function handler(req, res) {
    try {
        if (req.method === 'GET') {
            // Handle GET request to retrieve keys
            return await GetKey(req, res);
        } else if (req.method === 'POST') {
            // Handle POST request to create a new key
            return await CreateKey(req, res);
        } else if (req.method === 'PUT') {
            // Handle PUT request to update a key
            return await Updatekey(req, res);
        } else if (req.method === 'DELETE') {
            // Handle DELETE request to remove a key
            return await DeleteKey(req, res);
        } else {
            // Handle unsupported methods with 405 Method Not Allowed
            return res.status(405).json({ status: "NACK", message: "Method Not Allowed" });
        }
    } catch (error) {
        // Log and respond with a 500 Internal Server Error for unhandled exceptions
        console.error('Handler error:', error);
        res.status(500).json({ status: "NACK", message: "Internal Server Error", error: error.message });
    }
}
