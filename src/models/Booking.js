const mongoose = require('mongoose');
const BOOKING_STATUS = require('../constants/bookingStatus');

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    showtime: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Showtime',
      required: [true, 'Showtime is required'],
    },
    totalSeats: {
      type: Number,
      required: [true, 'Total seats is required'],
      min: [1, 'Must book at least 1 seat'],
    },
    totalPrice: {
      type: Number,
      required: [true, 'Total price is required'],
      min: [0, 'Total price cannot be negative'],
    },
    status: {
      type: String,
      enum: {
        values: [
          BOOKING_STATUS.PENDING,
          BOOKING_STATUS.CONFIRMED,
          BOOKING_STATUS.CANCELLED,
          BOOKING_STATUS.EXPIRED,
        ],
        message: 'Booking status must be pending, confirmed, cancelled, or expired',
      },
      default: BOOKING_STATUS.PENDING,
    },
    expiresAt: {
      type: Date,
      required: [true, 'Expiration time is required'],
    },
  },
  {
    timestamps: true,
  }
);

// Performance indexes
bookingSchema.index({ user: 1 });
bookingSchema.index({ showtime: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ expiresAt: 1 });

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
