const express = require('express');
const hallController = require('../controllers/hall.controller');
const hallValidation = require('../validations/hall.validation');
const validate = require('../middlewares/validate.middleware');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');
const ROLES = require('../constants/roles');

const router = express.Router();

// ─── Public Routes ─────────────────────────────────────────────────────────

router.get('/', hallController.getAllHalls);
router.get('/:id', hallController.getHallById);
router.get('/:id/seats', hallController.getHallSeats);

// ─── Admin Routes ──────────────────────────────────────────────────────────

router.post(
  '/',
  authMiddleware,
  roleMiddleware(ROLES.ADMIN),
  validate(hallValidation.createHall),
  hallController.createHall
);

router.put(
  '/:id',
  authMiddleware,
  roleMiddleware(ROLES.ADMIN),
  validate(hallValidation.updateHall),
  hallController.updateHall
);

router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware(ROLES.ADMIN),
  hallController.deleteHall
);

module.exports = router;
