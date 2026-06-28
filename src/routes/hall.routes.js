const express = require('express');
const hallController = require('../controllers/hall.controller');
const hallValidation = require('../validations/hall.validation');
const validate = require('../middlewares/validate.middleware');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');
const ROLES = require('../constants/roles');

const router = express.Router();

// All hall routes require admin — aligned with Phase 0 blueprint
router.use(authMiddleware, roleMiddleware(ROLES.ADMIN));

router.post('/', validate(hallValidation.createHall), hallController.createHall);
router.get('/', hallController.getAllHalls);
router.get('/:id', hallController.getHallById);
router.put('/:id', validate(hallValidation.updateHall), hallController.updateHall);
router.delete('/:id', hallController.deleteHall);
router.get('/:id/seats', hallController.getHallSeats);

module.exports = router;
