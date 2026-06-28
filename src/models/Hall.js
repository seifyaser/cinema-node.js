const mongoose = require('mongoose');

const SCREEN_TYPES = ['standard', 'imax', 'vip'];

const hallSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Hall name is required'],
      unique: true,
      trim: true,
    },
    screenType: {
      type: String,
      enum: {
        values: SCREEN_TYPES,
        message: 'Screen type must be one of: standard, imax, vip',
      },
      default: 'standard',
    },
    totalRows: {
      type: Number,
      required: [true, 'Total rows is required'],
      min: [1, 'Must have at least 1 row'],
      max: [26, 'Maximum 26 rows supported (A–Z)'],
    },
    totalColumns: {
      type: Number,
      required: [true, 'Total columns is required'],
      min: [1, 'Must have at least 1 column'],
      max: [50, 'Maximum 50 columns per row'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Derived field — not stored, computed on read
hallSchema.virtual('totalSeats').get(function () {
  return this.totalRows * this.totalColumns;
});

hallSchema.index({ isActive: 1 });

const Hall = mongoose.model('Hall', hallSchema);

module.exports = Hall;
