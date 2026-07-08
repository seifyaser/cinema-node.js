const User = require('../models/User');
const { success, error } = require('../utils/apiResponse');
const asyncHandler = require('../middlewares/asyncHandler');

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password').sort('-createdAt');
  return success(res, 'Users fetched successfully', { users, total: users.length });
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (!user) {
    return error(res, 'User not found', null, 404);
  }
  return success(res, 'User fetched successfully', user);
});

const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role },
    { new: true, runValidators: true }
  ).select('-password');

  if (!user) {
    return error(res, 'User not found', null, 404);
  }

  return success(res, 'User role updated successfully', user);
});

const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    return error(res, 'User not found', null, 404);
  }

  return success(res, 'User deleted successfully', null, 204);
});

module.exports = {
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser,
};
