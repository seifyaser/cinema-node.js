const User = require('../models/User');
const Movie = require('../models/Movie');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const { success } = require('../utils/apiResponse');
const asyncHandler = require('../middlewares/asyncHandler');
const PAYMENT_STATUS = require('../constants/paymentStatus');

const getStatistics = asyncHandler(async (req, res) => {
  const [
    totalUsers,
    totalMovies,
    totalBookings,
    revenueAggregation
  ] = await Promise.all([
    User.countDocuments(),
    Movie.countDocuments(),
    Booking.countDocuments(),
    Payment.aggregate([
      { $match: { paymentStatus: PAYMENT_STATUS.PAID } },
      { $group: { _id: null, totalRevenue: { $sum: '$amount' } } }
    ])
  ]);

  const totalRevenue = revenueAggregation.length > 0 ? revenueAggregation[0].totalRevenue : 0;

  return success(res, 'Dashboard statistics fetched successfully', {
    totalUsers,
    totalMovies,
    totalBookings,
    totalRevenue,
  });
});

module.exports = {
  getStatistics,
};
