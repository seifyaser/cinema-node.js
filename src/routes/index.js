const express = require('express');
const authRoutes = require('./auth.routes');
const movieRoutes = require('./movie.routes');
const hallRoutes = require('./hall.routes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/movies', movieRoutes);
router.use('/halls', hallRoutes);

module.exports = router;
