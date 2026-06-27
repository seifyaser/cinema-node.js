const express = require('express');
const movieController = require('../controllers/movie.controller');
const movieValidation = require('../validations/movie.validation');
const validate = require('../middlewares/validate.middleware');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');
const ROLES = require('../constants/roles');

const router = express.Router();

// ─── Public Routes ─────────────────────────────────────────────────────────
router.get(
  '/',
  validate(movieValidation.getMovies),
  movieController.getAllMovies
);

router.get('/:id', movieController.getMovieById);

// ─── Admin Routes ──────────────────────────────────────────────────────────

router.post(
  '/',
  authMiddleware,
  roleMiddleware(ROLES.ADMIN),
  validate(movieValidation.createMovie),
  movieController.createMovie
);

router.put(
  '/:id',
  authMiddleware,
  roleMiddleware(ROLES.ADMIN),
  validate(movieValidation.updateMovie),
  movieController.updateMovie
);

router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware(ROLES.ADMIN),
  movieController.deleteMovie
);

module.exports = router;
