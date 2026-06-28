const Joi = require('joi');

const SCREEN_TYPES = ['standard', 'imax', 'vip'];

const createHall = {
  body: Joi.object().keys({
    name: Joi.string().trim().required(),
    screenType: Joi.string().valid(...SCREEN_TYPES).optional(),
    totalRows: Joi.number().integer().min(1).max(26).required(),
    totalColumns: Joi.number().integer().min(1).max(50).required(),
  }),
};

const updateHall = {
  body: Joi.object()
    .keys({
      name: Joi.string().trim().optional(),
      screenType: Joi.string().valid(...SCREEN_TYPES).optional(),
      isActive: Joi.boolean().optional(),
      // NOTE: totalRows and totalColumns are intentionally excluded.
      // Changing seat layout after seats are created requires re-generation
      // which may conflict with existing bookings. Handle in a future phase.
    })
    .min(1),
};

module.exports = {
  createHall,
  updateHall,
};
