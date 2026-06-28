const Hall = require('../models/Hall');
const Seat = require('../models/Seat');
const ApiError = require('../utils/apiError');
const { generateSeats } = require('../utils/seatGenerator');
const { getSeatsForHall } = require('./seat.service');
const logger = require('../config/logger');

/**
 * Create a hall and automatically generate all its seats.
 * If seat generation fails, the hall is rolled back to keep data consistent.
 */
const createHall = async (data) => {
  const hall = await Hall.create(data);

  try {
    const seatDocs = generateSeats(hall._id, hall.totalRows, hall.totalColumns);
    await Seat.insertMany(seatDocs, { ordered: true });
    logger.info(`Generated ${seatDocs.length} seats for hall: "${hall.name}"`);
  } catch (error) {
    // Compensating rollback — remove the hall if seat creation fails
    await Hall.findByIdAndDelete(hall._id);
    logger.error(`Seat generation failed for hall "${hall.name}", rolling back`, error);
    throw new ApiError(500, 'Failed to generate seats. Hall creation rolled back.');
  }

  return hall;
};

/**
 * Get all halls (admin view — includes inactive).
 */
const getAllHalls = async () => {
  const halls = await Hall.find().sort({ name: 1 });
  return halls;
};

/**
 * Get a single hall by ID.
 */
const getHallById = async (id) => {
  const hall = await Hall.findById(id);
  if (!hall) {
    throw new ApiError(404, 'Hall not found');
  }
  return hall;
};

/**
 * Update a hall's metadata.
 * NOTE: totalRows and totalColumns cannot be changed after seat generation.
 * Changing the layout would require seat re-generation and conflict checks
 * with existing bookings (future implementation).
 */
const updateHall = async (id, data) => {
  const hall = await Hall.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });

  if (!hall) {
    throw new ApiError(404, 'Hall not found');
  }

  return hall;
};

/**
 * Soft-delete a hall.
 * TODO: Before deleting, check for future confirmed bookings in this hall (Phase — Bookings).
 */
const deleteHall = async (id) => {
  const hall = await Hall.findById(id);
  if (!hall) {
    throw new ApiError(404, 'Hall not found');
  }

  hall.isActive = false;
  await hall.save();
};

/**
 * Get all seats for a hall (delegates to seat service).
 */
const getHallWithSeats = async (hallId) => {
  const hall = await getHallById(hallId);
  const seats = await getSeatsForHall(hallId);

  return { hall, seats };
};

module.exports = {
  createHall,
  getAllHalls,
  getHallById,
  updateHall,
  deleteHall,
  getHallWithSeats,
};
