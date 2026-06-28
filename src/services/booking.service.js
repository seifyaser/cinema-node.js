const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const BookingSeat = require('../models/BookingSeat');
const Showtime = require('../models/Showtime');
const Seat = require('../models/Seat');
const ApiError = require('../utils/apiError');
const BOOKING_STATUS = require('../constants/bookingStatus');
const BOOKING_SEAT_STATUS = require('../constants/bookingSeatStatus');
const env = require('../config/env');
const logger = require('../config/logger');

// Configurable via environment variables
const HOLD_DURATION_MINUTES = env.booking.holdDurationMinutes;
const MAX_BOOKING_SEATS = env.booking.maxSeats;

// ─── Seat Availability ───────────────────────────────────────────────────────

/**
 * Get the seat map for a showtime.
 * Loads all seats from the hall, then overlays BookingSeat records
 * to determine each seat's real-time availability.
 *
 * Expired holds are ignored — they are treated as available.
 */
const getSeatMap = async (showtimeId) => {
  const showtime = await Showtime.findOne({ _id: showtimeId, isActive: true });
  if (!showtime) {
    throw new ApiError(404, 'Showtime not found');
  }

  // 1. Load all active seats for this hall
  const seats = await Seat.find({ hall: showtime.hall, isActive: true })
    .sort({ row: 1, number: 1 })
    .lean();

  // 2. Load non-expired BookingSeat records for this showtime
  const now = new Date();
  const bookedSeats = await BookingSeat.find({
    showtime: showtimeId,
    $or: [
      { status: BOOKING_SEAT_STATUS.RESERVED },
      { status: BOOKING_SEAT_STATUS.HELD, heldUntil: { $gt: now } },
    ],
  })
    .select('seat status')
    .lean();

  // 3. Build a lookup map: seatId → status
  const seatStatusMap = {};
  for (const bs of bookedSeats) {
    seatStatusMap[bs.seat.toString()] = bs.status;
  }

  // 4. Merge into a unified seat map
  const seatMap = seats.map((seat) => ({
    seatId: seat._id,
    label: seat.label,
    row: seat.row,
    number: seat.number,
    type: seat.type,
    status: seatStatusMap[seat._id.toString()] || 'available',
  }));

  return seatMap;
};

// ─── Hold Seats ──────────────────────────────────────────────────────────────

/**
 * Hold selected seats for a user.
 * Creates a pending Booking and BookingSeat records with a hold expiration.
 *
 * Business rules enforced:
 * - Showtime must exist and be active
 * - All seats must belong to the showtime's hall
 * - Max seats per booking (from env)
 * - No seat can already be held or reserved
 * - Calculates total price from showtime's ticketPrice
 */
const holdSeats = async (userId, showtimeId, seatIds) => {
  // Validate max seats
  if (seatIds.length > MAX_BOOKING_SEATS) {
    throw new ApiError(
      400,
      `Cannot book more than ${MAX_BOOKING_SEATS} seats at a time`
    );
  }

  // Validate showtime
  const showtime = await Showtime.findOne({ _id: showtimeId, isActive: true })
    .populate('movie', 'title poster duration')
    .populate('hall', 'name screenType');

  if (!showtime) {
    throw new ApiError(404, 'Showtime not found');
  }

  // Validate all seats exist and belong to the showtime's hall
  const seats = await Seat.find({
    _id: { $in: seatIds },
    hall: showtime.hall._id,
    isActive: true,
  }).lean();

  if (seats.length !== seatIds.length) {
    throw new ApiError(400, 'One or more selected seats are invalid or do not belong to this hall');
  }

  // Check for already held or reserved seats (ignore expired holds)
  const now = new Date();
  const conflicting = await BookingSeat.find({
    showtime: showtimeId,
    seat: { $in: seatIds },
    $or: [
      { status: BOOKING_SEAT_STATUS.RESERVED },
      { status: BOOKING_SEAT_STATUS.HELD, heldUntil: { $gt: now } },
    ],
  })
    .populate('seat', 'label')
    .lean();

  if (conflicting.length > 0) {
    const labels = conflicting.map((c) => c.seat.label).join(', ');
    throw new ApiError(409, `Seats already taken: ${labels}`);
  }

  // Calculate pricing
  const totalPrice = showtime.ticketPrice * seatIds.length;
  const expiresAt = new Date(now.getTime() + HOLD_DURATION_MINUTES * 60 * 1000);

  // Use a session/transaction for atomicity
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Clean up any expired holds for these seats (housekeeping)
    await BookingSeat.deleteMany({
      showtime: showtimeId,
      seat: { $in: seatIds },
      status: BOOKING_SEAT_STATUS.HELD,
      heldUntil: { $lte: now },
    }).session(session);

    // Create booking
    const [booking] = await Booking.create(
      [
        {
          user: userId,
          showtime: showtimeId,
          totalSeats: seatIds.length,
          totalPrice,
          status: BOOKING_STATUS.PENDING,
          expiresAt,
        },
      ],
      { session }
    );

    // Create BookingSeat records
    const bookingSeatDocs = seatIds.map((seatId) => ({
      booking: booking._id,
      showtime: showtimeId,
      seat: seatId,
      status: BOOKING_SEAT_STATUS.HELD,
      heldUntil: expiresAt,
    }));

    await BookingSeat.insertMany(bookingSeatDocs, { session });

    await session.commitTransaction();

    logger.info(
      `[Booking] User ${userId} held ${seatIds.length} seats for showtime ${showtimeId} — expires at ${expiresAt.toISOString()}`
    );

    return {
      bookingId: booking._id,
      expiresAt,
      summary: {
        movie: showtime.movie,
        hall: showtime.hall,
        date: showtime.date,
        startTime: showtime.startTime,
        endTime: showtime.endTime,
        seats: seats.map((s) => ({ seatId: s._id, label: s.label, type: s.type })),
        ticketPrice: showtime.ticketPrice,
        totalSeats: seatIds.length,
        totalPrice,
      },
    };
  } catch (error) {
    await session.abortTransaction();

    // Handle duplicate key error from the unique index (race condition safety net)
    if (error.code === 11000) {
      throw new ApiError(409, 'One or more seats were just taken by another user. Please try again.');
    }

    throw error;
  } finally {
    session.endSession();
  }
};

// ─── Booking Summary ─────────────────────────────────────────────────────────

/**
 * Get full booking summary for the payment screen.
 * Only the booking owner can view their summary.
 */
const getBookingSummary = async (bookingId, userId) => {
  const booking = await Booking.findOne({ _id: bookingId, user: userId })
    .populate({
      path: 'showtime',
      populate: [
        { path: 'movie', select: 'title poster duration genre ageRating' },
        { path: 'hall', select: 'name screenType totalRows totalColumns' },
      ],
    });

  if (!booking) {
    throw new ApiError(404, 'Booking not found');
  }

  // Load the held/reserved seats for this booking
  const bookingSeats = await BookingSeat.find({ booking: bookingId })
    .populate('seat', 'label row number type')
    .lean();

  const seats = bookingSeats.map((bs) => ({
    seatId: bs.seat._id,
    label: bs.seat.label,
    row: bs.seat.row,
    number: bs.seat.number,
    type: bs.seat.type,
    status: bs.status,
  }));

  // Check if hold has expired
  const now = new Date();
  const isExpired = booking.status === BOOKING_STATUS.PENDING && booking.expiresAt < now;

  return {
    bookingId: booking._id,
    status: isExpired ? BOOKING_STATUS.EXPIRED : booking.status,
    movie: booking.showtime.movie,
    hall: {
      ...booking.showtime.hall.toObject(),
      totalSeats: booking.showtime.hall.totalRows * booking.showtime.hall.totalColumns,
    },
    date: booking.showtime.date,
    startTime: booking.showtime.startTime,
    endTime: booking.showtime.endTime,
    seats,
    ticketPrice: booking.showtime.ticketPrice,
    totalSeats: booking.totalSeats,
    totalPrice: booking.totalPrice,
    expiresAt: booking.expiresAt,
    isExpired,
  };
};

module.exports = {
  getSeatMap,
  holdSeats,
  getBookingSummary,
};
