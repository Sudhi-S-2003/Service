import pino from 'pino';

// Create a simple Pino logger instance
const logger = pino({
  level: process.env.LOG_LEVEL || 'info', // Set log level from environment variable or default to 'info'
  timestamp: pino.stdTimeFunctions.isoTime, // Optional: Adds timestamp to log entries
  redact: ['password', 'token'], // Redact sensitive fields from logs
});

export default logger;
