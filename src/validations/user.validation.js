const Joi = require('joi');
const ROLES = require('../constants/roles');

const updateUserRole = {
  params: Joi.object().keys({
    id: Joi.string().hex().length(24).required(),
  }),
  body: Joi.object().keys({
    role: Joi.string().valid(ROLES.USER, ROLES.ADMIN).required(),
  }),
};

const deleteUser = {
  params: Joi.object().keys({
    id: Joi.string().hex().length(24).required(),
  }),
};

module.exports = {
  updateUserRole,
  deleteUser,
};
