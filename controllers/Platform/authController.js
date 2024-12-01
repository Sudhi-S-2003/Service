import PlatformMailService from '../../models/Platform_Mail_service';
import logger from '@/lib/logger';

// User Registration
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if the user already exists
    const existingUser = await PlatformMailService.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create a new user
    const newUser = new PlatformMailService({ name, email, password });
    await newUser.save();

    // Generate an auth token for the new user
    const token = await newUser.generateAuthToken();
    
    // Send the response with a token
    res.status(201).json({ message: 'User registered successfully', token });
  } catch (error) {
    logger.error('Error registering user:', error);
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
};

// User Login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find the user in the database
    const user = await PlatformMailService.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Compare the password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate an auth token for the user
    const token = await user.generateAuthToken();
    res.status(200).json({ message: 'Logged in successfully', token });
  } catch (error) {
    logger.error('Error logging in user:', error);
    res.status(500).json({ message: 'Error logging in user', error: error.message });
  }
};
