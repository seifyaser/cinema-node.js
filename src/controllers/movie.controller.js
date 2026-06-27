const movieService = require('../services/movie.service');
const { success, paginated } = require('../utils/apiResponse');
const asyncHandler = require('../middlewares/asyncHandler');
const logger = require('../config/logger');

// ─── Admin Controllers ─────────────────────────────────────────────────────

const createMovie = asyncHandler(async (req, res) => {
  const movie = await movieService.createMovie(req.body);
  logger.info(`[Admin] Movie created: "${movie.title}" (${movie._id})`);
  return success(res, 'Movie created successfully', { movie }, 201);
});

const updateMovie = asyncHandler(async (req, res) => {
  const movie = await movieService.updateMovie(req.params.id, req.body);
  logger.info(`[Admin] Movie updated: "${movie.title}" (${movie._id})`);
  return success(res, 'Movie updated successfully', { movie });
});

const deleteMovie = asyncHandler(async (req, res) => {
  await movieService.deleteMovie(req.params.id);
  logger.info(`[Admin] Movie soft-deleted: ${req.params.id}`);
  return success(res, 'Movie deleted successfully', {});
});

// ─── Public Controllers ────────────────────────────────────────────────────

const getAllMovies = asyncHandler(async (req, res) => {
  const { movies, pagination } = await movieService.getAllMovies(req.query);
  return paginated(res, 'Movies fetched successfully', movies, pagination);
});

const getMovieById = asyncHandler(async (req, res) => {
  const movie = await movieService.getMovieById(req.params.id);
  return success(res, 'Movie fetched successfully', { movie });
});

const searchMovies = asyncHandler(async (req, res) => {
  const { movies, pagination } = await movieService.searchMovies(req.query);
  return paginated(res, 'Search results fetched successfully', movies, pagination);
});

module.exports = {
  createMovie,
  updateMovie,
  deleteMovie,
  getAllMovies,
  getMovieById,
  searchMovies,
};
