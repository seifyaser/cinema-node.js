const mongoose = require('mongoose');
const MOVIE_STATUS = require('../constants/movieStatus');

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Movie title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Movie description is required'],
      trim: true,
    },
    poster: {
      type: String,
      required: [true, 'Movie poster URL is required'],
    },
    gallery: {
      type: [String],
      default: [],
    },
    trailerUrl: {
      type: String,
      default: null,
    },
    genre: {
      type: [String],
      required: [true, 'At least one genre is required'],
    },
    duration: {
      type: Number,
      required: [true, 'Movie duration is required'],
      min: [1, 'Duration must be at least 1 minute'],
    },
    ageRating: {
      type: String,
      enum: {
        values: ['G', 'PG', 'PG-13', 'R', 'NC-17'],
        message: 'Age rating must be one of: G, PG, PG-13, R, NC-17',
      },
      default: 'PG',
    },
    releaseDate: {
      type: Date,
      required: [true, 'Release date is required'],
    },
    actors: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: {
        values: [MOVIE_STATUS.NOW_SHOWING, MOVIE_STATUS.COMING_SOON],
        message: 'Status must be either now_showing or coming_soon',
      },
      default: MOVIE_STATUS.COMING_SOON,
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

// Indexes for performance — aligned with Phase 0 blueprint
movieSchema.index({ status: 1 });
movieSchema.index({ releaseDate: -1 });
movieSchema.index({ genre: 1 });
movieSchema.index({ isActive: 1 });
movieSchema.index({ title: 'text' }); // Text index for full-text search

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;
