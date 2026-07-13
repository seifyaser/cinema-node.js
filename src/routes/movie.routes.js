const express = require('express');
const movieController = require('../controllers/movie.controller');
const showtimeController = require('../controllers/showtime.controller');
const movieValidation = require('../validations/movie.validation');
const showtimeValidation = require('../validations/showtime.validation');
const validate = require('../middlewares/validate.middleware');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');
const ROLES = require('../constants/roles');

const router = express.Router();

// ─── Public Routes ─────────────────────────────────────────────────────────
// NOTE: /search must be declared BEFORE /:id — otherwise "search" is treated as the id param

router.get(
  '/search',
  validate(movieValidation.searchMovies),
  movieController.searchMovies
);

router.get(
  '/',
  validate(movieValidation.getMovies),
  movieController.getAllMovies
);

// ─── Showtime User Routes (nested under /movies) ──────────────────────────
// Declared BEFORE /:id to prevent Express treating path segments as movie IDs

router.get('/:movieId/available-dates', showtimeController.getAvailableDates);
router.get('/:movieId/available-halls', showtimeController.getAvailableHalls);

router.get(
  '/:movieId/showtimes',
  validate(showtimeValidation.getShowtimesByMovie),
  showtimeController.getShowtimesByMovie
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
