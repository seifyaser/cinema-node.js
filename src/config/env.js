const dotenv = require('dotenv');
const Joi = require('joi');

dotenv.config();

const envSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
  PORT: Joi.number().default(3000),
  MONGODB_URI: Joi.string().required().description('MongoDB connection string'),
  JWT_SECRET: Joi.string().required().description('JWT secret key'),
  JWT_EXPIRES_IN: Joi.string().default('7d').description('JWT expiration time'),
  MAX_BOOKING_SEATS: Joi.number().integer().min(1).default(10).description('Maximum seats per booking'),
  HOLD_DURATION_MINUTES: Joi.number().integer().min(1).default(5).description('Seat hold duration in minutes'),
}).unknown();

const { value: envVars, error } = envSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  mongoose: {
    url: envVars.MONGODB_URI,
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    expiresIn: envVars.JWT_EXPIRES_IN,
  },
  booking: {
    maxSeats: envVars.MAX_BOOKING_SEATS,
    holdDurationMinutes: envVars.HOLD_DURATION_MINUTES,
  },
};
