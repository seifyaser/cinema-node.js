const mongoose = require('mongoose');
const SEAT_TYPES = require('../constants/seatTypes');

const seatSchema = new mongoose.Schema(
  {
    hall: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hall',
      required: [true, 'Seat must belong to a hall'],
    },
    row: {
      type: String,
      required: [true, 'Row is required'],
      uppercase: true,
      trim: true,
    },
    number: {
      type: Number,
      required: [true, 'Seat number is required'],
      min: 1,
    },
    label: {
      type: String,
      required: [true, 'Seat label is required'],
      uppercase: true,
      trim: true,
    },
    type: {
      type: String,
      enum: {
        values: [SEAT_TYPES.STANDARD, SEAT_TYPES.VIP],
        message: 'Seat type must be standard or vip',
      },
      default: SEAT_TYPES.STANDARD,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Unique seat label within a hall — prevents duplicate seats
seatSchema.index({ hall: 1, label: 1 }, { unique: true });
seatSchema.index({ hall: 1 });
seatSchema.index({ hall: 1, type: 1 });

const Seat = mongoose.model('Seat', seatSchema);

module.exports = Seat;
