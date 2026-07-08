const paymentService = require('../services/payment.service');
const apiResponse = require('../utils/apiResponse');
const asyncHandler = require('../middlewares/asyncHandler');
const PAYMENT_STATUS = require('../constants/paymentStatus');

/**
 * @desc    Verify payment and confirm booking
 * @route   POST /api/v1/payments/verify
 * @access  Private
 */
const verifyPayment = asyncHandler(async (req, res) => {
  const result = await paymentService.verifyPayment(req.user._id, req.body);

  if (result.status === PAYMENT_STATUS.PAID) {
    return apiResponse.success(res, 200, result.message, result);
  }

  // Return 400 for failed verifications (business logic failure, not a server crash)
  return apiResponse.error(res, 400, result.message);
});

/**
 * @desc    Get payment status for a booking
 * @route   GET /api/v1/payments/booking/:bookingId
 * @access  Private
 */
const getPaymentStatus = asyncHandler(async (req, res) => {
  const statusInfo = await paymentService.getPaymentStatus(req.user._id, req.params.bookingId);
  return apiResponse.success(res, 200, 'Payment status fetched successfully', statusInfo);
});

module.exports = {
  verifyPayment,
  getPaymentStatus,
};
