const express = require('express');
const dashboardController = require('../controllers/dashboard.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');
const ROLES = require('../constants/roles');

const router = express.Router();

router.use(authMiddleware, roleMiddleware(ROLES.ADMIN));

router.get('/statistics', dashboardController.getStatistics);

module.exports = router;
