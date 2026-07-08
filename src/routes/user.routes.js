const express = require('express');
const userController = require('../controllers/user.controller');
const userValidation = require('../validations/user.validation');
const validate = require('../middlewares/validate.middleware');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');
const ROLES = require('../constants/roles');

const router = express.Router();

// All user routes are admin-only
router.use(authMiddleware, roleMiddleware(ROLES.ADMIN));

router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.put(
  '/:id/role',
  validate(userValidation.updateUserRole),
  userController.updateUserRole
);
router.delete(
  '/:id',
  validate(userValidation.deleteUser),
  userController.deleteUser
);

module.exports = router;
