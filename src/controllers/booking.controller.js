const bookingService = require('../services/booking.service');
const Booking = require('../models/Booking');
const { success } = require('../utils/apiResponse');
const asyncHandler = require('../middlewares/asyncHandler');
const logger = require('../config/logger');

const getSeatMap = asyncHandler(async (req, res) => {
  const seatMap = await bookingService.getSeatMap(req.params.id);
  return success(res, 'Seat map fetched successfully', { seats: seatMap, total: seatMap.length });
});

const holdSeats = asyncHandler(async (req, res) => {
  const { showtimeId, seatIds } = req.body;
  const result = await bookingService.holdSeats(req.user._id, showtimeId, seatIds);

  logger.info(`[Booking] Seats held — Booking ID: ${result.bookingId}`);

  return success(res, 'Seats held successfully', result, 201);
});

const getBookingSummary = asyncHandler(async (req, res) => {
  const summary = await bookingService.getBookingSummary(req.params.id, req.user._id);
  return success(res, 'Booking summary fetched successfully', summary);
});

const getAllBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find()
    .populate('user', 'name email')
    .populate({
      path: 'showtime',
      populate: [
        { path: 'movie', select: 'title' },
        { path: 'hall', select: 'name' }
      ]
    })
    .sort('-createdAt');
    
  return success(res, 'All bookings fetched successfully', { bookings, total: bookings.length });
});

const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await bookingService.getMyBookings(req.user._id);
  return success(res, 'My bookings fetched successfully', { bookings, total: bookings.length });
});

module.exports = {
  getSeatMap,
  holdSeats,
  getBookingSummary,
  getAllBookings,
  getMyBookings,
};
