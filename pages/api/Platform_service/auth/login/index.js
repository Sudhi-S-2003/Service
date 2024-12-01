import connectMongo from '@/lib/db.js';
import { loginUser } from "@/controllers/Platform/authController";

export default async function handler(req, res) {
  await connectMongo();

  if (req.method === 'POST') {
    // Pass the request and response to the controller
    return loginUser(req, res); 
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
