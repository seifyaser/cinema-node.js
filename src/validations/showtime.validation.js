const Joi = require('joi');

const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/;

const createShowtime = {
  body: Joi.object().keys({
    movie: Joi.string().required(),
    hall: Joi.string().required(),
    date: Joi.date().required(),
    startTime: Joi.string().pattern(timePattern).required()
      .messages({ 'string.pattern.base': 'startTime must be in HH:mm format (e.g. 14:30)' }),
    endTime: Joi.string().pattern(timePattern).required()
      .messages({ 'string.pattern.base': 'endTime must be in HH:mm format (e.g. 16:30)' }),
    ticketPrice: Joi.number().min(0).required(),
  }),
};

const updateShowtime = {
  body: Joi.object()
    .keys({
      movie: Joi.string().optional(),
      hall: Joi.string().optional(),
      date: Joi.date().optional(),
      startTime: Joi.string().pattern(timePattern).optional()
        .messages({ 'string.pattern.base': 'startTime must be in HH:mm format (e.g. 14:30)' }),
      endTime: Joi.string().pattern(timePattern).optional()
        .messages({ 'string.pattern.base': 'endTime must be in HH:mm format (e.g. 16:30)' }),
      ticketPrice: Joi.number().min(0).optional(),
      isActive: Joi.boolean().optional(),
    })
    .min(1),
};

const getShowtimesByMovie = {
  query: Joi.object().keys({
    date: Joi.date().required(),
  }),
};

const getAdminShowtimes = {
  query: Joi.object().keys({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
    movie: Joi.string().optional(),
    hall: Joi.string().optional(),
    date: Joi.date().optional(),
  }),
};

module.exports = {
  createShowtime,
  updateShowtime,
  getShowtimesByMovie,
  getAdminShowtimes,
};
