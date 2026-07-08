const express = require('express');
const authRoutes = require('./auth.routes');
const movieRoutes = require('./movie.routes');
const hallRoutes = require('./hall.routes');
const showtimeRoutes = require('./showtime.routes');
const bookingRoutes = require('./booking.routes');
const paymentRoutes = require('./payment.routes');
const userRoutes = require('./user.routes');
const dashboardRoutes = require('./dashboard.routes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/movies', movieRoutes);
router.use('/halls', hallRoutes);
router.use('/showtimes', showtimeRoutes);
router.use('/bookings', bookingRoutes);
router.use('/payments', paymentRoutes);
router.use('/users', userRoutes);
router.use('/dashboard', dashboardRoutes);

module.exports = router;
