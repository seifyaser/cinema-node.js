const User = require('../models/User');
const ApiError = require('../utils/apiError');
const { generateToken } = require('../utils/tokenHelper');

const registerUser = async (userData) => {
  // Check if email or phone already exists (handled mostly by mongo duplicate error, but good to check explicitly sometimes, though error handler covers it)
  const user = await User.create(userData);
  
  const token = generateToken(user._id, user.role);

  return { user, token };
};

const loginUser = async (email, password) => {
  const user = await User.findOne({ email }).select('+password');
  
  if (!user || !(await user.correctPassword(password, user.password))) {
    throw new ApiError(401, 'Incorrect email or password');
  }

  if (!user.isActive) {
    throw new ApiError(401, 'Your account has been deactivated');
  }

  const token = generateToken(user._id, user.role);

  return { user, token };
};

const getUserById = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  return user;
};

module.exports = {
  registerUser,
  loginUser,
  getUserById,
};
