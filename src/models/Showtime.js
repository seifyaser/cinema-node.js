const mongoose = require('mongoose');

const showtimeSchema = new mongoose.Schema(
  {
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie',
      required: [true, 'Movie is required'],
    },
    hall: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hall',
      required: [true, 'Hall is required'],
    },
    date: {
      type: Date,
      required: [true, 'Showtime date is required'],
    },
    startTime: {
      type: String,
      required: [true, 'Start time is required'],
      match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Start time must be in HH:mm format'],
    },
    endTime: {
      type: String,
      required: [true, 'End time is required'],
      match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'End time must be in HH:mm format'],
    },
    ticketPrice: {
      type: Number,
      required: [true, 'Ticket price is required'],
      min: [0, 'Ticket price cannot be negative'],
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

// Performance indexes
showtimeSchema.index({ movie: 1, date: 1 });
showtimeSchema.index({ hall: 1, date: 1 });
showtimeSchema.index({ date: 1 });
showtimeSchema.index({ isActive: 1 });

const Showtime = mongoose.model('Showtime', showtimeSchema);

module.exports = Showtime;
