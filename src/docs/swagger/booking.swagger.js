/**
 * @swagger
 * tags:
 *   name: Bookings
 *   description: Seat booking and hold management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Booking:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         user:
 *           type: string
 *           description: User ID reference
 *         showtime:
 *           type: string
 *           description: Showtime ID reference
 *         totalSeats:
 *           type: integer
 *           example: 3
 *         totalPrice:
 *           type: number
 *           example: 360
 *         status:
 *           type: string
 *           enum: [pending, confirmed, cancelled, expired]
 *         expiresAt:
 *           type: string
 *           format: date-time
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     BookingSeat:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         booking:
 *           type: string
 *           description: Booking ID reference
 *         showtime:
 *           type: string
 *           description: Showtime ID reference
 *         seat:
 *           type: string
 *           description: Seat ID reference
 *         status:
 *           type: string
 *           enum: [held, reserved]
 *         heldUntil:
 *           type: string
 *           format: date-time
 *     SeatMapItem:
 *       type: object
 *       properties:
 *         seatId:
 *           type: string
 *         label:
 *           type: string
 *           example: A5
 *         row:
 *           type: string
 *           example: A
 *         number:
 *           type: integer
 *           example: 5
 *         type:
 *           type: string
 *           enum: [standard, vip]
 *         status:
 *           type: string
 *           enum: [available, held, reserved]
 */

/**
 * @swagger
 * /showtimes/{id}/seats:
 *   get:
 *     summary: Get seat map for a showtime (Public)
 *     tags: [Bookings]
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
 *         description: Seat map with real-time availability
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
 *                     seats:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/SeatMapItem'
 *                     total:
 *                       type: integer
 *       "404":
 *         description: Showtime not found
 */

/**
 * @swagger
 * /bookings/hold:
 *   post:
 *     summary: Hold seats for a showtime (Authenticated)
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - showtimeId
 *               - seatIds
 *             properties:
 *               showtimeId:
 *                 type: string
 *                 description: Showtime ID
 *               seatIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of Seat IDs to hold
 *                 example: ["665f1a2b3c4d5e6f70000001", "665f1a2b3c4d5e6f70000002"]
 *     responses:
 *       "201":
 *         description: Seats held successfully
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
 *                     bookingId:
 *                       type: string
 *                     expiresAt:
 *                       type: string
 *                       format: date-time
 *                     summary:
 *                       type: object
 *                       properties:
 *                         movie:
 *                           type: object
 *                         hall:
 *                           type: object
 *                         date:
 *                           type: string
 *                           format: date
 *                         startTime:
 *                           type: string
 *                         endTime:
 *                           type: string
 *                         seats:
 *                           type: array
 *                           items:
 *                             type: object
 *                         ticketPrice:
 *                           type: number
 *                         totalSeats:
 *                           type: integer
 *                         totalPrice:
 *                           type: number
 *       "400":
 *         description: Invalid seats or exceeds maximum
 *       "401":
 *         description: Unauthorized
 *       "404":
 *         description: Showtime not found
 *       "409":
 *         description: One or more seats already taken
 */

/**
 * @swagger
 * /bookings/{id}/summary:
 *   get:
 *     summary: Get booking summary before payment (Authenticated)
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Booking ID
 *     responses:
 *       "200":
 *         description: Full booking summary
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
 *                     bookingId:
 *                       type: string
 *                     status:
 *                       type: string
 *                       enum: [pending, confirmed, cancelled, expired]
 *                     movie:
 *                       type: object
 *                     hall:
 *                       type: object
 *                     date:
 *                       type: string
 *                       format: date
 *                     startTime:
 *                       type: string
 *                     endTime:
 *                       type: string
 *                     seats:
 *                       type: array
 *                       items:
 *                         type: object
 *                     ticketPrice:
 *                       type: number
 *                     totalSeats:
 *                       type: integer
 *                     totalPrice:
 *                       type: number
 *                     expiresAt:
 *                       type: string
 *                       format: date-time
 *                     isExpired:
 *                       type: boolean
 *       "401":
 *         description: Unauthorized
 *       "404":
 *         description: Booking not found
 */
