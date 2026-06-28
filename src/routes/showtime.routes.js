const express = require('express');
const showtimeController = require('../controllers/showtime.controller');
const showtimeValidation = require('../validations/showtime.validation');
const validate = require('../middlewares/validate.middleware');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');
const ROLES = require('../constants/roles');

const router = express.Router();

// ─── Public Routes ─────────────────────────────────────────────────────────

router.get('/:id', showtimeController.getShowtimeById);

// ─── Admin Routes ──────────────────────────────────────────────────────────

router.post(
  '/',
  authMiddleware,
  roleMiddleware(ROLES.ADMIN),
  validate(showtimeValidation.createShowtime),
  showtimeController.createShowtime
);

router.get(
  '/',
  authMiddleware,
  roleMiddleware(ROLES.ADMIN),
  validate(showtimeValidation.getAdminShowtimes),
  showtimeController.getAllShowtimes
);

router.put(
  '/:id',
  authMiddleware,
  roleMiddleware(ROLES.ADMIN),
  validate(showtimeValidation.updateShowtime),
  showtimeController.updateShowtime
);

router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware(ROLES.ADMIN),
  showtimeController.deleteShowtime
);

module.exports = router;
