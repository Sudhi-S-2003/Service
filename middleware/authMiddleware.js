import { jwtVerify } from 'jose'; // Import jwtVerify from jose
import { NextResponse } from "next/server";
import logger from '@/lib/logger';

const authMiddleware = async (request) => {
  try {
    const authHeader = request.headers.get("Authorization");

    if (!authHeader) {
      // Missing Authorization header
      logger.warn("Authentication Header is missing.");
      return NextResponse.json({ message: "Authentication Header required", status: "NACK" }, { status: 401 });
    }

    if (authHeader.split(" ")[0] !== "Bearer") {
      // Invalid token type, should be "Bearer"
      logger.warn("Invalid token type, expected 'Bearer'.");
      return NextResponse.json({ message: "Bearer token expected", status: "NACK" }, { status: 400 });
    }

    const token = authHeader.replace("Bearer ", "");

    // Secret key used for JWT verification
    const secret = new TextEncoder().encode(process.env.JWT_SECRET); // Edge-compatible encoding

    // Verifying the JWT
    const { payload } = await jwtVerify(token, secret);

    // Attach user info to headers for downstream usage
    const headers = new Headers(request.headers);
    headers.set("x-user-id", payload._id);

    // Continue to the next middleware with updated headers
    return NextResponse.next({ headers });
  } catch (error) {
    logger.error("Authentication error:", error.message);

    // Handle specific errors
    if (error.name === 'JWTError') {
      return NextResponse.json({ message: "Invalid token", status: "NACK" }, { status: 401 });
    } else if (error.name === 'JWTExpired') {
      return NextResponse.json({ message: "Token expired", status: "NACK" }, { status: 401 });
    }

    // General authentication failure
    return NextResponse.json({ message: "Authentication failed", status: "NACK" }, { status: 401 });
  }
};

export default authMiddleware;
