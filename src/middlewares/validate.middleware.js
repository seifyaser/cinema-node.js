const Joi = require('joi');
const { error } = require('../utils/apiResponse');

const validate = (schema) => (req, res, next) => {
  const validSchema = Object.keys(schema).reduce((acc, key) => {
    if (schema[key]) acc[key] = schema[key];
    return acc;
  }, {});
  
  const object = Object.keys(validSchema).reduce((acc, key) => {
    if (req[key]) acc[key] = req[key];
    return acc;
  }, {});

  const { value, error: joiError } = Joi.compile(validSchema)
    .prefs({ errors: { label: 'key' }, abortEarly: false })
    .validate(object);

  if (joiError) {
    const errors = joiError.details.map((details) => ({
      field: details.path.join('.'),
      message: details.message,
    }));
    return error(res, 'Validation failed', errors, 400);
  }

  Object.assign(req, value);
  return next();
};

module.exports = validate;
