const showtimeService = require('../services/showtime.service');
const { success, paginated } = require('../utils/apiResponse');
const asyncHandler = require('../middlewares/asyncHandler');
const logger = require('../config/logger');

// ─── Admin Controllers ─────────────────────────────────────────────────────

const createShowtime = asyncHandler(async (req, res) => {
  const showtime = await showtimeService.createShowtime(req.body);
  logger.info(`[Admin] Showtime created: ${showtime._id} (${showtime.startTime}–${showtime.endTime})`);
  return success(res, 'Showtime created successfully', { showtime }, 201);
});

const updateShowtime = asyncHandler(async (req, res) => {
  const showtime = await showtimeService.updateShowtime(req.params.id, req.body);
  logger.info(`[Admin] Showtime updated: ${showtime._id}`);
  return success(res, 'Showtime updated successfully', { showtime });
});

const deleteShowtime = asyncHandler(async (req, res) => {
  await showtimeService.deleteShowtime(req.params.id);
  logger.info(`[Admin] Showtime soft-deleted: ${req.params.id}`);
  return success(res, 'Showtime deleted successfully', {});
});

const getAllShowtimes = asyncHandler(async (req, res) => {
  const { showtimes, pagination } = await showtimeService.getAllShowtimes(req.query);
  return paginated(res, 'Showtimes fetched successfully', showtimes, pagination);
});

// ─── User Controllers ──────────────────────────────────────────────────────

const getAvailableDates = asyncHandler(async (req, res) => {
  const dates = await showtimeService.getAvailableDates(req.params.movieId);
  return success(res, 'Available dates fetched successfully', { dates, total: dates.length });
});

const getAvailableHalls = asyncHandler(async (req, res) => {
  const halls = await showtimeService.getAvailableHalls(req.params.movieId, req.query.date);

  const screenTypeDetails = {
    standard: {
      key: 'standard',
      displayName: 'Standard',
      icon: '🎬',
      description:
        'Enjoy a classic cinema experience with a standard-sized screen, immersive surround sound, and comfortable seating. Perfect for everyday movie watching at the most affordable price.',
    },
    vip: {
      key: 'vip',
      displayName: 'VIP',
      icon: '👑',
      description:
        'Experience premium comfort with spacious reclining leather seats, extra legroom, and an exclusive atmosphere. Selected locations may also offer in-seat food and beverage service for a luxurious movie experience.',
    },
    imax: {
      key: 'imax',
      displayName: 'IMAX',
      icon: '🎥',
      description:
        'Immerse yourself in breathtaking visuals with a giant screen, crystal-clear image quality, and powerful IMAX surround sound. Ideal for action-packed blockbusters and films designed for the ultimate cinematic experience.',
    },
  };

  const formattedHalls = halls.map((hall) => {
    const stKey = hall.screenType ? hall.screenType.toLowerCase() : 'standard';
    return {
      _id: hall._id,
      id: hall._id,
      displayName: hall.name,
      screenType: screenTypeDetails[stKey] || screenTypeDetails.standard,
      totalRows: hall.totalRows,
      totalColumns: hall.totalColumns,
      totalSeats: hall.totalSeats,
      isActive: hall.isActive,
    };
  });

  return success(res, 'Available halls fetched successfully', { halls: formattedHalls, total: formattedHalls.length });
});

const getShowtimesByMovie = asyncHandler(async (req, res) => {
  const showtimes = await showtimeService.getShowtimesByMovieAndDate(
    req.params.movieId,
    req.query.date
  );
  return success(res, 'Showtimes fetched successfully', { showtimes, total: showtimes.length });
});

const getShowtimeById = asyncHandler(async (req, res) => {
  const showtime = await showtimeService.getShowtimeById(req.params.id);
  return success(res, 'Showtime details fetched successfully', { showtime });
});

module.exports = {
  createShowtime,
  updateShowtime,
  deleteShowtime,
  getAllShowtimes,
  getAvailableDates,
  getAvailableHalls,
  getShowtimesByMovie,
  getShowtimeById,
};
