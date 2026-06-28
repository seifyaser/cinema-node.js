const Joi = require('joi');

const holdSeats = {
  body: Joi.object().keys({
    showtimeId: Joi.string().required(),
    seatIds: Joi.array()
      .items(Joi.string().required())
      .min(1)
      .required()
      .messages({
        'array.min': 'You must select at least one seat',
      }),
  }),
};

module.exports = {
  holdSeats,
};
