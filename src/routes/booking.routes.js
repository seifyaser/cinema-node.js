const express = require('express');
const bookingController = require('../controllers/booking.controller');
const bookingValidation = require('../validations/booking.validation');
const validate = require('../middlewares/validate.middleware');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

// All booking routes require authentication
router.use(authMiddleware);

router.post(
  '/hold',
  validate(bookingValidation.holdSeats),
  bookingController.holdSeats
);

router.get('/:id/summary', bookingController.getBookingSummary);

module.exports = router;
