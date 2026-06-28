const Seat = require('../models/Seat');
const ApiError = require('../utils/apiError');

/**
 * Get all seats for a hall, sorted by row then seat number.
 */
const getSeatsForHall = async (hallId) => {
  const seats = await Seat.find({ hall: hallId }).sort({ row: 1, number: 1 });
  return seats;
};

/**
 * Get seat counts by type for a hall.
 * Useful for hall detail views.
 */
const getSeatSummary = async (hallId) => {
  const summary = await Seat.aggregate([
    { $match: { hall: hallId } },
    { $group: { _id: '$type', count: { $sum: 1 } } },
  ]);

  return summary.reduce((acc, item) => {
    acc[item._id] = item.count;
    return acc;
  }, {});
};

module.exports = {
  getSeatsForHall,
  getSeatSummary,
};
