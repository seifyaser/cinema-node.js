const Movie = require('../models/Movie');
const ApiError = require('../utils/apiError');
const { getPagination, getPaginationMeta } = require('../utils/paginate');

/**
 * Create a new movie — Admin only
 */
const createMovie = async (data) => {
  const movie = await Movie.create(data);
  return movie;
};

/**
 * Update an existing movie by ID — Admin only
 */
const updateMovie = async (id, data) => {
  const movie = await Movie.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });

  if (!movie) {
    throw new ApiError(404, 'Movie not found');
  }

  return movie;
};

/**
 * Soft-delete a movie — Admin only
 * Sets isActive = false instead of removing the document
 */
const deleteMovie = async (id) => {
  const movie = await Movie.findById(id);

  if (!movie) {
    throw new ApiError(404, 'Movie not found');
  }

  movie.isActive = false;
  await movie.save();
};

/**
 * Get all active movies with pagination, filtering, and sorting
 */
const getAllMovies = async (query) => {
  const { page, limit, status, genre, sort, q } = query;
  const { skip, limit: parsedLimit, page: parsedPage } = getPagination(page, limit);

  // Only return active movies — business rule
  const filter = { isActive: true };
  if (status) filter.status = status;
  if (genre) filter.genre = { $in: [genre] };
  if (q) {
    // Case-insensitive search across title, actors, and genre
    filter.$or = [
      { title: { $regex: q, $options: 'i' } },
      { actors: { $regex: q, $options: 'i' } },
      { genre: { $regex: q, $options: 'i' } },
    ];
  }

  // Build sort options — default to releaseDate descending
  const sortOptions = {};
  if (sort) {
    const [field, order] = sort.split(':');
    sortOptions[field] = order === 'desc' ? -1 : 1;
  } else {
    sortOptions.releaseDate = -1;
  }

  const [movies, total] = await Promise.all([
    Movie.find(filter).sort(sortOptions).skip(skip).limit(parsedLimit),
    Movie.countDocuments(filter),
  ]);

  return { movies, pagination: getPaginationMeta(total, parsedPage, parsedLimit) };
};

/**
 * Get a single active movie by its ID
 */
const getMovieById = async (id) => {
  const movie = await Movie.findOne({ _id: id, isActive: true });

  if (!movie) {
    throw new ApiError(404, 'Movie not found');
  }

  return movie;
};

module.exports = {
  createMovie,
  updateMovie,
  deleteMovie,
  getAllMovies,
  getMovieById,
};
