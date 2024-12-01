export default async function handler(req, res) {
  if (req.method === 'GET') {
    // Send a successful response with "ACK" and a welcome message
    return res.status(200).json({ status: "ACK", message: "Welcome to the service!..." });
  } else {
    // Handle unsupported methods with 405 Method Not Allowed
    return res.status(405).json({ status: "NACK", message: "Method Not Allowed" });
  }
}
