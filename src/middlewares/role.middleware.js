const { error } = require('../utils/apiResponse');

const roleMiddleware = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return error(res, 'You do not have permission to perform this action', null, 403);
    }
    next();
  };
};

module.exports = roleMiddleware;
