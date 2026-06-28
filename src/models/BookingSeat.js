const mongoose = require('mongoose');
const BOOKING_SEAT_STATUS = require('../constants/bookingSeatStatus');

const bookingSeatSchema = new mongoose.Schema(
  {
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: [true, 'Booking is required'],
    },
    showtime: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Showtime',
      required: [true, 'Showtime is required'],
    },
    seat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Seat',
      required: [true, 'Seat is required'],
    },
    status: {
      type: String,
      enum: {
        values: [BOOKING_SEAT_STATUS.HELD, BOOKING_SEAT_STATUS.RESERVED],
        message: 'Seat status must be held or reserved',
      },
      default: BOOKING_SEAT_STATUS.HELD,
    },
    heldUntil: {
      type: Date,
      required: [true, 'Hold expiration time is required'],
    },
  },
  {
    timestamps: true,
  }
);

// Unique constraint — a seat can only appear once per showtime (prevents double-booking)
bookingSeatSchema.index({ showtime: 1, seat: 1 }, { unique: true });
bookingSeatSchema.index({ booking: 1 });
bookingSeatSchema.index({ showtime: 1, status: 1 });
bookingSeatSchema.index({ heldUntil: 1 });

const BookingSeat = mongoose.model('BookingSeat', bookingSeatSchema);

module.exports = BookingSeat;
