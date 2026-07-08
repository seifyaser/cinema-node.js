const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const BookingSeat = require('../models/BookingSeat');
const Payment = require('../models/Payment');
const paymobService = require('./paymob.service');
const ApiError = require('../utils/apiError');
const BOOKING_STATUS = require('../constants/bookingStatus');
const BOOKING_SEAT_STATUS = require('../constants/bookingSeatStatus');
const PAYMENT_STATUS = require('../constants/paymentStatus');
const logger = require('../config/logger');

/**
 * Verify payment from the Flutter SDK and process the booking confirmation.
 * This method must be idempotent.
 *
 * @param {string} userId - The ID of the user requesting verification
 * @param {Object} payload - { bookingId, transactionId, orderId, paymentKey }
 */
const verifyPayment = async (userId, payload) => {
  const { bookingId, transactionId, orderId, paymentKey } = payload;

  // 1. Verify booking exists and belongs to user
  const booking = await Booking.findOne({ _id: bookingId, user: userId });
  if (!booking) {
    throw new ApiError(404, 'Booking not found');
  }

  // 2. Idempotency Check: If already confirmed with THIS transaction ID, return success immediately.
  // We check if the payment record already exists and is successful.
  const existingPayment = await Payment.findOne({ transactionId });
  if (existingPayment) {
    if (existingPayment.paymentStatus === PAYMENT_STATUS.PAID) {
      if (String(existingPayment.booking) !== String(bookingId)) {
        throw new ApiError(409, 'Transaction ID already used for a different booking');
      }
      return { status: PAYMENT_STATUS.PAID, message: 'Payment already verified' };
    }
    // If it exists but failed, we shouldn't reuse it. Let the user create a new transaction.
    throw new ApiError(400, 'This transaction was already processed and failed');
  }

  // 3. Check booking state (must be pending)
  if (booking.status === BOOKING_STATUS.CONFIRMED) {
    throw new ApiError(400, 'Booking is already confirmed with another payment');
  }
  if (booking.status === BOOKING_STATUS.CANCELLED) {
    throw new ApiError(400, 'Booking is cancelled');
  }

  // 4. Check expiration
  if (booking.status === BOOKING_STATUS.PENDING && booking.expiresAt < new Date()) {
    // Optionally update booking to EXPIRED, but our getters handle it dynamically. Let's enforce it here.
    booking.status = BOOKING_STATUS.EXPIRED;
    await booking.save();
    throw new ApiError(400, 'Booking has expired. Please book again.');
  }

  // 5. Verify transaction directly with Paymob (Do not trust client)
  const isVerified = await paymobService.verifyTransaction(transactionId, orderId, paymentKey);

  // 6. Execute atomic updates based on verification result
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    if (isVerified) {
      // Create Payment record
      await Payment.create(
        [
          {
            booking: booking._id,
            provider: 'paymob',
            amount: booking.totalPrice,
            paymentStatus: PAYMENT_STATUS.PAID,
            transactionId,
            orderId,
            paymentKey,
            paidAt: new Date(),
          },
        ],
        { session }
      );

      // Update Booking
      booking.status = BOOKING_STATUS.CONFIRMED;
      await booking.save({ session });

      // Reserve Seats
      await BookingSeat.updateMany(
        { booking: booking._id },
        { $set: { status: BOOKING_SEAT_STATUS.RESERVED } },
        { session }
      );

      await session.commitTransaction();
      logger.info(`[Payment] Verified successfully for booking ${bookingId} with TX ${transactionId}`);

      return { status: PAYMENT_STATUS.PAID, message: 'Payment verified and booking confirmed' };
    } else {
      // Payment Failed Verification
      // Create failed payment record for audit
      await Payment.create(
        [
          {
            booking: booking._id,
            provider: 'paymob',
            amount: booking.totalPrice,
            paymentStatus: PAYMENT_STATUS.FAILED,
            transactionId,
            orderId,
            paymentKey,
          },
        ],
        { session }
      );

      // We DO NOT update the booking status. It remains pending and can still be paid for
      // before it expires, or it naturally expires.
      await session.commitTransaction();
      logger.warn(`[Payment] Verification failed for booking ${bookingId} with TX ${transactionId}`);

      return { status: PAYMENT_STATUS.FAILED, message: 'Payment verification failed' };
    }
  } catch (error) {
    await session.abortTransaction();
    
    // Safety net for race conditions on unique transactionId index
    if (error.code === 11000) {
      throw new ApiError(409, 'Transaction ID already processed');
    }
    
    throw error;
  } finally {
    session.endSession();
  }
};

/**
 * Get payment status for a specific booking.
 * Only the booking owner can access this.
 */
const getPaymentStatus = async (userId, bookingId) => {
  const booking = await Booking.findOne({ _id: bookingId, user: userId });
  if (!booking) {
    throw new ApiError(404, 'Booking not found');
  }

  // Find the most recent payment attempt for this booking
  const payment = await Payment.findOne({ booking: bookingId }).sort({ createdAt: -1 });

  if (!payment) {
    return {
      bookingId,
      status: PAYMENT_STATUS.PENDING,
      transactionId: null,
    };
  }

  return {
    bookingId,
    status: payment.paymentStatus,
    transactionId: payment.transactionId,
    paidAt: payment.paidAt,
  };
};

module.exports = {
  verifyPayment,
  getPaymentStatus,
};
