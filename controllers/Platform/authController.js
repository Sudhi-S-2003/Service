import PlatformMailService from '../../models/Platform_Mail_service';
import logger from '@/lib/logger';

// User Registration
export const registerUser = async (req, res) => {
  try {
    const { name, email, user_id, password } = req.body;

    // Validate input
    if (!user_id || !email || !password) {
      return res.status(400).json({
        status: 'NACK',
        message: 'Invalid request: user_id, email, and password are required',
      });
    }


    // Check if the user already exists by email or user_id
    const existingUser = await PlatformMailService.findOne({
      $or: [{ email }, { user_id }]
    });

    if (existingUser) {
      return res.status(400).json({ status: "NACK", message: 'User already exists' });
    }

    // Create a new user
    const newUser = new PlatformMailService({ user_id, name, email, password });
    await newUser.save();

    // Generate an auth token for the new user
    const token = await newUser.generateAuthToken();

    // Send the response with a token
    res.status(201).json({ status: "ACK", message: 'User registered successfully', token });
  } catch (error) {
    logger.error('Error registering user:', error);
    res.status(500).json({ status: "NACK", message: 'Error registering user', error: error.message });
  }
};
// User Login
export const loginUser = async (req, res) => {
  try {
    const { user_id, email, password } = req.body;

    // Validate input
    if (!password || (!user_id && !email)) {
      return res.status(400).json({
        message: 'Invalid request: user_id or email and password are required',
        status: 'NACK',
      });
    }

    // Construct query for user lookup
    const query = {};
    if (user_id) query["user_id"] = user_id;
    if (email) query["email"] = email;

    // Find the user in the database
    const user = await PlatformMailService.findOne(query);
    if (!user) {
      return res.status(401).json({
        message: 'Invalid credentials: user not found',
        status: 'NACK',
      });
    }

    // Compare the password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        message: 'Invalid credentials: incorrect password',
        status: 'NACK',
      });
    }

    // Generate an auth token for the user
    const token = await user.generateAuthToken();

    // Respond with success
    res.status(200).json({
      message: 'Logged in successfully',
      status: 'ACK',
      token,
    });
  } catch (error) {
    logger.error('Error logging in user:', error);
    res.status(500).json({
      message: 'Internal server error while logging in',
      status: 'NACK',
      error: error.message,
    });
  }
};
