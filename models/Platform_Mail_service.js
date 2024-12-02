import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import logger from '../lib/logger'; // Using pino logger for better logging

const PlatformMailServiceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  user_id:{ type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  token: { type: String, default: null }, // JWT token field
});

// Hash the password before saving
PlatformMailServiceSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); // Skip hashing if password is not modified

  try {
    const salt = await bcrypt.genSalt(10); // Generate a salt
    this.password = await bcrypt.hash(this.password, salt); // Hash the password
    return next(); // Proceed with saving the document
  } catch (error) {
    logger.error('Error hashing password:', error); // Log error if hashing fails
    next(error); // Pass error to next middleware
  }
});

// Method to compare password
PlatformMailServiceSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password); // Compare hashed passwords
  } catch (error) {
    logger.error('Error comparing passwords:', error);
    throw new Error('Password comparison failed'); // Throw error if comparison fails
  }
};

// Method to generate JWT token and save it in the database
PlatformMailServiceSchema.methods.generateAuthToken = async function () {
  try {
    // Check if a token already exists and is valid
    if (this.token) {
      try {
        jwt.verify(this.token, process.env.JWT_SECRET); // Verify the existing token
        return this.token; // Return the valid token
      } catch (error) {
        // Token expired or invalid
        logger.info('Existing token expired or invalid. Generating a new one...', error);
      }
    }

    // Generate a new token if no valid token exists or if the existing token is invalid
    const token = jwt.sign(
      { _id: this._id, email: this.email }, // Payload (you can add more data)
      process.env.JWT_SECRET, // Secret key for signing the token
      { expiresIn: '1h' } // Set expiration time (1 hour)
    );

    // Save the new token in the database
    this.token = token;
    await this.save(); // Save the updated document with the new token

    return token; // Return the new token
  } catch (error) {
    logger.error('Error generating auth token:', error); // Log error
    throw new Error('Error generating authentication token'); // Throw error if token generation fails
  }
};

// Method to verify the authenticity of the token
PlatformMailServiceSchema.methods.verifyAuthToken = async function (token) {
  try {
    // Verify the provided token using the JWT secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded; // Return decoded token data if the token is valid
  } catch (error) {
    logger.error('Error verifying token:', error); // Log the error
    throw new Error('Invalid or expired token'); // Throw an error if token is invalid or expired
  }
};

export default mongoose.models.PlatformMailService || mongoose.model('PlatformMailService', PlatformMailServiceSchema);
