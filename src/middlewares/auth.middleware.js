const { verifyToken } = require('../utils/tokenHelper');
const { error } = require('../utils/apiResponse');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return error(res, 'You are not logged in! Please log in to get access.', null, 401);
  }

  try {
    const decoded = verifyToken(token);

    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return error(res, 'The user belonging to this token does no longer exist.', null, 401);
    }

    if (!currentUser.isActive) {
      return error(res, 'Your account has been deactivated.', null, 401);
    }

    req.user = currentUser;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = authMiddleware;
