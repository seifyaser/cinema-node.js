/**
 * @swagger
 * tags:
 *   name: Showtimes
 *   description: Showtime management and booking preparation
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Showtime:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         movie:
 *           type: string
 *           description: Movie ID reference (populated in responses)
 *         hall:
 *           type: string
 *           description: Hall ID reference (populated in responses)
 *         date:
 *           type: string
 *           format: date
 *         startTime:
 *           type: string
 *           example: "14:30"
 *           description: HH:mm format
 *         endTime:
 *           type: string
 *           example: "16:30"
 *           description: HH:mm format
 *         ticketPrice:
 *           type: number
 *           example: 120
 *         isActive:
 *           type: boolean
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /showtimes:
 *   post:
 *     summary: Create a new showtime (Admin only)
 *     tags: [Showtimes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - movie
 *               - hall
 *               - date
 *               - startTime
 *               - endTime
 *               - ticketPrice
 *             properties:
 *               movie:
 *                 type: string
 *                 description: Movie ID
 *               hall:
 *                 type: string
 *                 description: Hall ID
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2026-07-01"
 *               startTime:
 *                 type: string
 *                 example: "14:30"
 *               endTime:
 *                 type: string
 *                 example: "16:30"
 *               ticketPrice:
 *                 type: number
 *                 example: 120
 *     responses:
 *       "201":
 *         description: Showtime created
 *       "400":
 *         description: Validation failed or invalid time
 *       "401":
 *         description: Unauthorized
 *       "403":
 *         description: Forbidden — Admin only
 *       "404":
 *         description: Movie or Hall not found
 *       "409":
 *         description: Time conflict — overlapping showtime
 */

/**
 * @swagger
 * /showtimes:
 *   get:
 *     summary: Get all showtimes with optional filters (Admin only)
 *     tags: [Showtimes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *       - in: query
 *         name: movie
 *         schema:
 *           type: string
 *         description: Filter by Movie ID
 *       - in: query
 *         name: hall
 *         schema:
 *           type: string
 *         description: Filter by Hall ID
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter by date
 *     responses:
 *       "200":
 *         description: Paginated list of showtimes
 *       "401":
 *         description: Unauthorized
 *       "403":
 *         description: Forbidden — Admin only
 */

/**
 * @swagger
 * /showtimes/{id}:
 *   get:
 *     summary: Get showtime details by ID (Public)
 *     tags: [Showtimes]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Showtime ID
 *     responses:
 *       "200":
 *         description: Showtime details with populated movie and hall
 *       "404":
 *         description: Showtime not found
 */

/**
 * @swagger
 * /showtimes/{id}:
 *   put:
 *     summary: Update a showtime (Admin only)
 *     tags: [Showtimes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               movie:
 *                 type: string
 *               hall:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               startTime:
 *                 type: string
 *                 example: "15:00"
 *               endTime:
 *                 type: string
 *                 example: "17:00"
 *               ticketPrice:
 *                 type: number
 *               isActive:
 *                 type: boolean
 *     responses:
 *       "200":
 *         description: Showtime updated
 *       "400":
 *         description: Validation failed or invalid time
 *       "401":
 *         description: Unauthorized
 *       "403":
 *         description: Forbidden — Admin only
 *       "404":
 *         description: Showtime not found
 *       "409":
 *         description: Time conflict — overlapping showtime
 */

/**
 * @swagger
 * /showtimes/{id}:
 *   delete:
 *     summary: Soft-delete a showtime (Admin only)
 *     tags: [Showtimes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         description: Showtime deleted
 *       "401":
 *         description: Unauthorized
 *       "403":
 *         description: Forbidden — Admin only
 *       "404":
 *         description: Showtime not found
 */

/**
 * @swagger
 * /movies/{movieId}/available-dates:
 *   get:
 *     summary: Get all available dates with showtimes for a movie (Public)
 *     tags: [Showtimes]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: movieId
 *         required: true
 *         schema:
 *           type: string
 *         description: Movie ID
 *     responses:
 *       "200":
 *         description: List of available dates (sorted ascending)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     dates:
 *                       type: array
 *                       items:
 *                         type: string
 *                         format: date
 *                       example: ["2026-07-01", "2026-07-02", "2026-07-03"]
 *                     total:
 *                       type: integer
 *       "404":
 *         description: Movie not found
 */

/**
 * @swagger
 * /movies/{movieId}/showtimes:
 *   get:
 *     summary: Get showtimes for a movie on a specific date (Public)
 *     tags: [Showtimes]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: movieId
 *         required: true
 *         schema:
 *           type: string
 *         description: Movie ID
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *           example: "2026-07-01"
 *         description: Date to query (YYYY-MM-DD)
 *     responses:
 *       "200":
 *         description: List of showtimes sorted by start time
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     showtimes:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Showtime'
 *                     total:
 *                       type: integer
 *       "400":
 *         description: Missing or invalid date query parameter
 *       "404":
 *         description: Movie not found
 */
