const express = require('express');
const paymentController = require('../controllers/payment.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const paymentValidation = require('../validations/payment.validation');

const router = express.Router();

// All payment routes require authentication
router.use(authMiddleware);

router.post(
  '/verify',
  validate(paymentValidation.verifyPaymentSchema),
  paymentController.verifyPayment
);

router.get(
  '/booking/:bookingId',
  validate(paymentValidation.getPaymentStatusSchema),
  paymentController.getPaymentStatus
);

module.exports = router;
