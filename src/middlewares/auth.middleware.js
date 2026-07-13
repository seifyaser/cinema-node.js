const { verifyToken } = require('../utils/tokenHelper');
const { error } = require('../utils/apiResponse');
const User = require('../models/User');
const TokenBlocklist = require('../models/TokenBlocklist');

const authMiddleware = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return error(res, 'You are not logged in! Please log in to get access.', null, 401);
  }

  try {
    const isBlocked = await TokenBlocklist.exists({ token });
    if (isBlocked) {
      return error(res, 'Token has been revoked. Please log in again.', null, 401);
    }

    const decoded = verifyToken(token);

    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return error(res, 'The user belonging to this token does no longer exist.', null, 401);
    }

    if (!currentUser.isActive) {
      return error(res, 'Your account has been deactivated.', null, 401);
    }

    req.user = currentUser;
    req.token = token;
    req.tokenExp = decoded.exp;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = authMiddleware;
