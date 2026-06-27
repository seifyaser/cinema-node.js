const express = require('express');
const authRoutes = require('./auth.routes');
const movieRoutes = require('./movie.routes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/movies', movieRoutes);

module.exports = router;
