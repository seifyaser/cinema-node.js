const mongoose = require('mongoose');
const Showtime = require('../models/Showtime');
const Movie = require('../models/Movie');
const Hall = require('../models/Hall');
const ApiError = require('../utils/apiError');
const { getPagination, getPaginationMeta } = require('../utils/paginate');

/**
 * Validate that a movie exists and is active.
 */
const validateMovie = async (movieId) => {
  const movie = await Movie.findById(movieId);
  if (!movie) {
    throw new ApiError(404, 'Movie not found');
  }
  if (!movie.isActive) {
    throw new ApiError(400, 'Cannot create showtime for an inactive movie');
  }
  return movie;
};

/**
 * Validate that a hall exists and is active.
 */
const validateHall = async (hallId) => {
  const hall = await Hall.findById(hallId);
  if (!hall) {
    throw new ApiError(404, 'Hall not found');
  }
  if (!hall.isActive) {
    throw new ApiError(400, 'Cannot create showtime for an inactive hall');
  }
  return hall;
};

/**
 * Check for overlapping showtimes in the same hall on the same date.
 * Two showtimes overlap when one starts before the other ends.
 * Excludes the current showtime when updating (via excludeId).
 */
const checkOverlap = async (hallId, date, startTime, endTime, excludeId = null) => {
  const filter = {
    hall: hallId,
    date,
    isActive: true,
    // Overlap condition: existing.startTime < newEndTime AND existing.endTime > newStartTime
    startTime: { $lt: endTime },
    endTime: { $gt: startTime },
  };

  if (excludeId) {
    filter._id = { $ne: excludeId };
  }

  const overlap = await Showtime.findOne(filter);
  if (overlap) {
    throw new ApiError(
      409,
      `Time conflict: Hall already has a showtime from ${overlap.startTime} to ${overlap.endTime} on this date`
    );
  }
};

// ─── Admin Services ──────────────────────────────────────────────────────────

/**
 * Create a new showtime — Admin only.
 * Validates movie, hall, time logic, and overlap.
 */
const createShowtime = async (data) => {
  // Validate endTime > startTime
  if (data.endTime <= data.startTime) {
    throw new ApiError(400, 'End time must be later than start time');
  }

  await validateMovie(data.movie);
  await validateHall(data.hall);
  await checkOverlap(data.hall, data.date, data.startTime, data.endTime);

  const showtime = await Showtime.create(data);

  // Populate for the response
  await showtime.populate('movie', 'title poster duration');
  await showtime.populate('hall', 'name screenType');

  return showtime;
};

/**
 * Update an existing showtime by ID — Admin only.
 * Re-validates overlap if hall, date, or times change.
 */
const updateShowtime = async (id, data) => {
  const showtime = await Showtime.findById(id);
  if (!showtime) {
    throw new ApiError(404, 'Showtime not found');
  }

  // If movie is changing, validate the new movie
  if (data.movie && data.movie !== showtime.movie.toString()) {
    await validateMovie(data.movie);
  }

  // If hall is changing, validate the new hall
  if (data.hall && data.hall !== showtime.hall.toString()) {
    await validateHall(data.hall);
  }

  // Determine effective values for overlap check
  const effectiveHall = data.hall || showtime.hall;
  const effectiveDate = data.date || showtime.date;
  const effectiveStart = data.startTime || showtime.startTime;
  const effectiveEnd = data.endTime || showtime.endTime;

  // Validate endTime > startTime with effective values
  if (effectiveEnd <= effectiveStart) {
    throw new ApiError(400, 'End time must be later than start time');
  }

  // Re-check overlap if any scheduling fields changed
  if (data.hall || data.date || data.startTime || data.endTime) {
    await checkOverlap(effectiveHall, effectiveDate, effectiveStart, effectiveEnd, id);
  }

  const updated = await Showtime.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  })
    .populate('movie', 'title poster duration')
    .populate('hall', 'name screenType');

  return updated;
};

/**
 * Soft-delete a showtime — Admin only.
 */
const deleteShowtime = async (id) => {
  const showtime = await Showtime.findById(id);
  if (!showtime) {
    throw new ApiError(404, 'Showtime not found');
  }

  showtime.isActive = false;
  await showtime.save();
};

/**
 * Get all showtimes with pagination and optional filters — Admin only.
 */
const getAllShowtimes = async (query) => {
  const { page, limit, movie, hall, date } = query;
  const { skip, limit: parsedLimit, page: parsedPage } = getPagination(page, limit);

  const filter = {};
  if (movie) filter.movie = movie;
  if (hall) filter.hall = hall;
  if (date) filter.date = date;

  const [showtimes, total] = await Promise.all([
    Showtime.find(filter)
      .populate('movie', 'title poster duration')
      .populate('hall', 'name screenType')
      .sort({ date: 1, startTime: 1 })
      .skip(skip)
      .limit(parsedLimit),
    Showtime.countDocuments(filter),
  ]);

  return { showtimes, pagination: getPaginationMeta(total, parsedPage, parsedLimit) };
};

// ─── User Services ───────────────────────────────────────────────────────────

/**
 * Get all future dates that have active showtimes for a movie.
 * - Excludes past dates entirely.
 * - For today: only includes today if at least one showtime hasn't started yet.
 * - Returns sorted array of date strings.
 */
const getAvailableDates = async (movieId) => {
  // Ensure movie exists and is active
  await validateMovie(movieId);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const now = new Date();
  const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  // Get all active showtimes for this movie from today onwards
  const showtimes = await Showtime.find({
    movie: movieId,
    isActive: true,
    date: { $gte: today },
  })
    .select('date startTime')
    .sort({ date: 1 })
    .lean();

  // Build unique date list, filtering out today's expired showtimes
  const todayStr = today.toISOString().split('T')[0];
  const dateSet = new Set();

  for (const st of showtimes) {
    const dateStr = new Date(st.date).toISOString().split('T')[0];

    // If the showtime is today, only count it if it hasn't started yet
    if (dateStr === todayStr) {
      if (st.startTime > currentTime) {
        dateSet.add(dateStr);
      }
    } else {
      // Future date — always include
      dateSet.add(dateStr);
    }
  }

  return Array.from(dateSet).sort();
};

/**
 * Get all available showtimes for a movie on a specific date.
 * - If date is today, return only future showtimes.
 * - Returns populated showtimes sorted by startTime.
 */
const getShowtimesByMovieAndDate = async (movieId, date) => {
  await validateMovie(movieId);

  const filter = {
    movie: movieId,
    date,
    isActive: true,
  };

  // If querying today, exclude expired showtimes
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const queryDate = new Date(date);
  queryDate.setHours(0, 0, 0, 0);

  let showtimes = await Showtime.find(filter)
    .populate('hall', 'name screenType totalRows totalColumns')
    .sort({ startTime: 1 })
    .lean();

  // Filter out expired showtimes if date is today
  if (queryDate.getTime() === today.getTime()) {
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    showtimes = showtimes.filter((st) => st.startTime > currentTime);
  }

  // Compute totalSeats virtual (not available in lean queries)
  showtimes = showtimes.map((st) => ({
    ...st,
    hall: {
      ...st.hall,
      totalSeats: st.hall.totalRows * st.hall.totalColumns,
    },
  }));

  return showtimes;
};

/**
 * Get complete showtime details by ID — public.
 * Used by the booking flow to show full information.
 */
const getShowtimeById = async (id) => {
  const showtime = await Showtime.findOne({ _id: id, isActive: true })
    .populate('movie', 'title description poster genre duration ageRating releaseDate actors status')
    .populate('hall', 'name screenType totalRows totalColumns')
    .lean();

  if (!showtime) {
    throw new ApiError(404, 'Showtime not found');
  }

  // Ensure the associated movie and hall are still active
  if (!showtime.movie) {
    throw new ApiError(404, 'The movie for this showtime is no longer available');
  }
  if (!showtime.hall) {
    throw new ApiError(404, 'The hall for this showtime is no longer available');
  }

  // Compute totalSeats virtual (not available in lean queries)
  showtime.hall.totalSeats = showtime.hall.totalRows * showtime.hall.totalColumns;

  return showtime;
};

module.exports = {
  createShowtime,
  updateShowtime,
  deleteShowtime,
  getAllShowtimes,
  getAvailableDates,
  getShowtimesByMovieAndDate,
  getShowtimeById,
};
