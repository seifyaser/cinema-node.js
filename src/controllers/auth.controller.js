const authService = require('../services/auth.service');
const { success } = require('../utils/apiResponse');
const asyncHandler = require('../middlewares/asyncHandler');
const logger = require('../config/logger');

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

module.exports = {
  register,
  login,
  getMe,
};
