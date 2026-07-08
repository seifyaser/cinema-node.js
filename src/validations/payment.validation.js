const Joi = require('joi');

const verifyPaymentSchema = {
  body: Joi.object({
    bookingId: Joi.string().hex().length(24).required().messages({
      'string.length': '"bookingId" must be a valid 24 character hex string',
    }),
    transactionId: Joi.string().required(),
    orderId: Joi.string().required(),
    paymentKey: Joi.string().required(),
  }),
};

const getPaymentStatusSchema = {
  params: Joi.object({
    bookingId: Joi.string().hex().length(24).required().messages({
      'string.length': '"bookingId" must be a valid 24 character hex string',
    }),
  }),
};

module.exports = {
  verifyPaymentSchema,
  getPaymentStatusSchema,
};
