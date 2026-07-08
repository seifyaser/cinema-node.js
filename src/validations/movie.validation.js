const Joi = require('joi');
const MOVIE_STATUS = require('../constants/movieStatus');

const AGE_RATINGS = ['G', 'PG', 'PG-13', 'R', 'NC-17'];

const createMovie = {
  body: Joi.object().keys({
    title: Joi.string().trim().required(),
    description: Joi.string().trim().required(),
    poster: Joi.string().uri().required(),
    gallery: Joi.array().items(Joi.string().uri()).default([]),
    trailerUrl: Joi.string().uri().allow('', null).optional(),
    genre: Joi.array().items(Joi.string().trim()).min(1).required(),
    duration: Joi.number().integer().min(1).required(),
    ageRating: Joi.string().valid(...AGE_RATINGS).optional(),
    releaseDate: Joi.date().required(),
    actors: Joi.array()
      .items(
        Joi.object().keys({
          name: Joi.string().trim().required(),
          image: Joi.string().uri().allow(null, '').optional(),
        })
      )
      .default([]),
    status: Joi.string()
      .valid(MOVIE_STATUS.NOW_SHOWING, MOVIE_STATUS.COMING_SOON)
      .optional(),
  }),
};

const updateMovie = {
  body: Joi.object()
    .keys({
      title: Joi.string().trim().optional(),
      description: Joi.string().trim().optional(),
      poster: Joi.string().uri().optional(),
      gallery: Joi.array().items(Joi.string().uri()).optional(),
      trailerUrl: Joi.string().uri().allow('', null).optional(),
      genre: Joi.array().items(Joi.string().trim()).min(1).optional(),
      duration: Joi.number().integer().min(1).optional(),
      ageRating: Joi.string().valid(...AGE_RATINGS).optional(),
      releaseDate: Joi.date().optional(),
      actors: Joi.array()
        .items(
          Joi.object().keys({
            name: Joi.string().trim().required(),
            image: Joi.string().uri().allow(null, '').optional(),
          })
        )
        .optional(),
      status: Joi.string()
        .valid(MOVIE_STATUS.NOW_SHOWING, MOVIE_STATUS.COMING_SOON)
        .optional(),
      isActive: Joi.boolean().optional(),
    })
    .min(1), // At least one field must be provided
};

const getMovies = {
  query: Joi.object().keys({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    status: Joi.string()
      .valid(MOVIE_STATUS.NOW_SHOWING, MOVIE_STATUS.COMING_SOON)
      .optional(),
    genre: Joi.string().optional(),
    sort: Joi.string().optional(), // e.g. "releaseDate:desc"
    q: Joi.string().trim().optional(), // search by title, actor, or genre
  }),
};

const searchMovies = {
  query: Joi.object().keys({
    q: Joi.string().trim().min(1).required(),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
  }),
};

module.exports = {
  createMovie,
  updateMovie,
  getMovies,
  searchMovies,
};
