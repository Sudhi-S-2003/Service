import SendMail from "@/controllers/Mail/SendMail";

export default async function handler(req, res) {
    try {
        if (req.method === 'POST') {
            // Handle GET request to retrieve keys
            return await SendMail(req, res);
        } else if(req.method === 'GET'){
              // Handle GET request to retrieve keys
              return await SendMail(req, res);
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
