// ─── Booking (User) ─────────────────────────────────────────────────────────

/**
 * @swagger
 * /bookings/hold:
 *   post:
 *     summary: Hold seats for a showtime
 *     description: |
 *       Temporarily reserves seats for a specified showtime.
 *       - Requires authentication
 *       - Selected seats must belong to the showtime's hall
 *       - Seats cannot be double-held (returns 409 if already taken)
 *       - Maximum seats allowed is configured by MAX_BOOKING_SEATS (default 10)
 *       - Hold expires automatically after a configured duration (default 5 mins)
 *     tags: [Booking (User)]
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
 *           example:
 *             showtimeId: "665f1a2b3c4d5e6f70000040"
 *             seatIds: ["665f1a2b3c4d5e6f70000030", "665f1a2b3c4d5e6f70000031"]
 *     responses:
 *       "201":
 *         description: Seats held successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Seats held successfully
 *               data:
 *                 bookingId: "665f1a2b3c4d5e6f70000050"
 *                 expiresAt: "2026-07-01T14:35:00.000Z"
 *                 summary:
 *                   movie:
 *                     _id: "665f1a2b3c4d5e6f70000010"
 *                     title: The Dark Knight
 *                   hall:
 *                     _id: "665f1a2b3c4d5e6f70000020"
 *                     name: Hall 1
 *                   date: "2026-07-01T00:00:00.000Z"
 *                   startTime: "14:30"
 *                   endTime: "16:45"
 *                   seats:
 *                     - seatId: "665f1a2b3c4d5e6f70000030"
 *                       label: A1
 *                       type: standard
 *                     - seatId: "665f1a2b3c4d5e6f70000031"
 *                       label: A2
 *                       type: standard
 *                   ticketPrice: 120
 *                   totalSeats: 2
 *                   totalPrice: 240
 *       "400":
 *         description: Validation failed, invalid seats, or max seats exceeded
 *       "401":
 *         description: Not authenticated
 *       "404":
 *         description: Showtime not found
 *       "409":
 *         description: One or more seats are already held or reserved
 *       "500":
 *         description: Server Error
 * 
 * /bookings/my-bookings:
 *   get:
 *     summary: Get user's booking history
 *     description: Returns all bookings/tickets for the currently authenticated user
 *     tags: [Booking (User)]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: Successfully fetched user's bookings
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: My bookings fetched successfully
 *               data:
 *                 total: 1
 *                 bookings:
 *                   - _id: 6a4f5b...
 *                     showtime:
 *                       movie:
 *                         title: "Inception"
 *                       hall:
 *                         name: "Hall 1"
 *                     totalSeats: 2
 *                     totalPrice: 36
 *                     status: "confirmed"
 *                     createdAt: "2026-07-09T00:00:00Z"
 *       "401":
 *         description: Unauthorized
 */

/**
 * @swagger
 * /bookings/{id}/summary:
 *   get:
 *     summary: Get booking summary before payment
 *     description: |
 *       Returns the full booking summary including populated movie and hall details.
 *       Used to render the final payment screen.
 *       - Requires authentication
 *       - Only the booking owner can view this summary
 *       - Automatically returns `isExpired: true` if the hold duration has passed
 *     tags: [Booking (User)]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Booking ID
 *         example: "665f1a2b3c4d5e6f70000050"
 *     responses:
 *       "200":
 *         description: Full booking summary
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Booking summary fetched successfully
 *               data:
 *                 bookingId: "665f1a2b3c4d5e6f70000050"
 *                 status: pending
 *                 movie:
 *                   _id: "665f1a2b3c4d5e6f70000010"
 *                   title: The Dark Knight
 *                   poster: https://example.com/posters/dark-knight.jpg
 *                 hall:
 *                   _id: "665f1a2b3c4d5e6f70000020"
 *                   name: Hall 1
 *                   screenType: imax
 *                 date: "2026-07-01T00:00:00.000Z"
 *                 startTime: "14:30"
 *                 endTime: "16:45"
 *                 seats:
 *                   - seatId: "665f1a2b3c4d5e6f70000030"
 *                     label: A1
 *                     row: A
 *                     number: 1
 *                     type: standard
 *                     status: held
 *                   - seatId: "665f1a2b3c4d5e6f70000031"
 *                     label: A2
 *                     row: A
 *                     number: 2
 *                     type: standard
 *                     status: held
 *                 ticketPrice: 120
 *                 totalSeats: 2
 *                 totalPrice: 240
 *                 expiresAt: "2026-07-01T14:35:00.000Z"
 *                 isExpired: false
 *       "401":
 *         description: Not authenticated
 *       "404":
 *         description: Booking not found (or user is not the owner)
 */
