import pino from 'pino';
import pretty from 'pino-pretty'; // Import pino-pretty for development pretty-printing

// Create a Pino logger instance
const logger = pino(
  {
    level: process.env.LOG_LEVEL || 'info', // Set log level from environment variable or default to 'info'
    timestamp: pino.stdTimeFunctions.isoTime, // Optional: Adds timestamp to log entries
    redact: ['password', 'token'], // Redact sensitive fields from logs
  },
  process.env.NODE_ENV === 'development' ? pretty() : undefined // Use pretty-printing in development only
);

export default logger;
