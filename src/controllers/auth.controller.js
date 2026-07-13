const authService = require('../services/auth.service');
const { success } = require('../utils/apiResponse');
const asyncHandler = require('../middlewares/asyncHandler');
const logger = require('../config/logger');
const TokenBlocklist = require('../models/TokenBlocklist');

const register = asyncHandler(async (req, res) => {
  const { user, token } = await authService.registerUser(req.body);
  
  logger.info(`User registered successfully: ${user.email}`);
  
  return success(res, 'Registration successful', { user, token }, 201);
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const { user, token } = await authService.loginUser(email, password);
  
  logger.info(`User logged in successfully: ${user.email}`);

  return success(res, 'Login successful', { user, token }, 200);
});

const getMe = asyncHandler(async (req, res) => {
  const user = await authService.getUserById(req.user._id);
  
  return success(res, 'User fetched successfully', { user }, 200);
});

const logout = asyncHandler(async (req, res) => {
  const token = req.token;
  // req.tokenExp is in seconds, convert to milliseconds for Date
  const expiresAt = new Date(req.tokenExp * 1000);

  await TokenBlocklist.create({ token, expiresAt });

  logger.info(`User logged out successfully: ${req.user.email}`);

  return success(res, 'Logout successful', null, 200);
});

module.exports = {
  register,
  login,
  getMe,
  logout,
};
