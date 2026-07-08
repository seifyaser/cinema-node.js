// ─── Showtimes (Public) ──────────────────────────────────────────────────────

/**
 * @swagger
 * /movies/{movieId}/available-dates:
 *   get:
 *     summary: Get available dates for a movie
 *     description: |
 *       Returns all future dates that contain active showtimes for the selected movie.
 *       - Returns only active showtimes
 *       - Excludes dates with no available showtimes
 *       - Sorts dates in ascending order
 *       - If the selected date is today, excludes it if all showtimes have started
 *     tags: [Showtimes (Public)]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: movieId
 *         required: true
 *         schema:
 *           type: string
 *         description: Movie ID
 *         example: "665f1a2b3c4d5e6f70000010"
 *     responses:
 *       "200":
 *         description: List of available dates
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Available dates fetched successfully
 *               data:
 *                 dates: ["2026-07-01", "2026-07-02", "2026-07-03"]
 *                 total: 3
 *       "404":
 *         description: Movie not found or inactive
 */

/**
 * @swagger
 * /movies/{movieId}/showtimes:
 *   get:
 *     summary: Get showtimes for a movie on a specific date
 *     description: |
 *       Returns all available showtimes for the selected movie on the selected date.
 *       - Sorts by startTime
 *       - If the selected date is today, returns only future showtimes (startTime > now)
 *       - Populates Hall information
 *     tags: [Showtimes (Public)]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: movieId
 *         required: true
 *         schema:
 *           type: string
 *         description: Movie ID
 *         example: "665f1a2b3c4d5e6f70000010"
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Date to query
 *         example: "2026-07-01"
 *     responses:
 *       "200":
 *         description: List of showtimes
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Showtimes fetched successfully
 *               data:
 *                 showtimes:
 *                   - _id: "665f1a2b3c4d5e6f70000040"
 *                     movie: "665f1a2b3c4d5e6f70000010"
 *                     date: "2026-07-01T00:00:00.000Z"
 *                     startTime: "14:30"
 *                     endTime: "16:45"
 *                     ticketPrice: 120
 *                     isActive: true
 *                     hall:
 *                       _id: "665f1a2b3c4d5e6f70000020"
 *                       name: Hall 1
 *                       screenType: imax
 *                       totalRows: 10
 *                       totalColumns: 15
 *                       totalSeats: 150
 *                 total: 1
 *       "400":
 *         description: Validation failed (e.g. missing date)
 *       "404":
 *         description: Movie not found or inactive
 */

/**
 * @swagger
 * /showtimes/{id}:
 *   get:
 *     summary: Get complete showtime details
 *     description: |
 *       Returns complete showtime details including populated Movie and Hall.
 *       Used by the Booking module to display information before seat selection.
 *       - Returns 404 if showtime, movie, or hall is inactive
 *     tags: [Showtimes (Public)]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Showtime ID
 *         example: "665f1a2b3c4d5e6f70000040"
 *     responses:
 *       "200":
 *         description: Complete showtime details
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Showtime details fetched successfully
 *               data:
 *                 showtime:
 *                   _id: "665f1a2b3c4d5e6f70000040"
 *                   date: "2026-07-01T00:00:00.000Z"
 *                   startTime: "14:30"
 *                   endTime: "16:45"
 *                   ticketPrice: 120
 *                   isActive: true
 *                   movie:
 *                     _id: "665f1a2b3c4d5e6f70000010"
 *                     title: The Dark Knight
 *                     poster: https://example.com/posters/dark-knight.jpg
 *                     duration: 152
 *                   hall:
 *                     _id: "665f1a2b3c4d5e6f70000020"
 *                     name: Hall 1
 *                     screenType: imax
 *                     totalRows: 10
 *                     totalColumns: 15
 *                     totalSeats: 150
 *       "404":
 *         description: Showtime not found
 */

/**
 * @swagger
 * /showtimes/{id}/seats:
 *   get:
 *     summary: Get seat map with availability
 *     description: |
 *       Returns every seat in the hall with its current status.
 *       - Status can be: `available`, `held`, `reserved`
 *       - Backend ignores expired holds automatically
 *       - Flutter client should use this to render the seat map
 *     tags: [Showtimes (Public)]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Showtime ID
 *         example: "665f1a2b3c4d5e6f70000040"
 *     responses:
 *       "200":
 *         description: Seat map fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Seat map fetched successfully
 *               data:
 *                 seats:
 *                   - seatId: "665f1a2b3c4d5e6f70000030"
 *                     label: A1
 *                     row: A
 *                     number: 1
 *                     type: standard
 *                     status: available
 *                   - seatId: "665f1a2b3c4d5e6f70000031"
 *                     label: A2
 *                     row: A
 *                     number: 2
 *                     type: standard
 *                     status: held
 *                 total: 150
 *       "404":
 *         description: Showtime not found
 */

// ─── Showtimes (Admin) ───────────────────────────────────────────────────────

/**
 * @swagger
 * /showtimes:
 *   post:
 *     summary: Create a new showtime
 *     description: |
 *       Creates a new showtime.
 *       - Requires Admin authentication
 *       - Validates that movie and hall exist and are active
 *       - Ensures endTime > startTime
 *       - Checks for overlapping showtimes in the same hall
 *     tags: [Showtimes (Admin)]
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
 *               hall:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               startTime:
 *                 type: string
 *               endTime:
 *                 type: string
 *               ticketPrice:
 *                 type: number
 *           example:
 *             movie: "665f1a2b3c4d5e6f70000010"
 *             hall: "665f1a2b3c4d5e6f70000020"
 *             date: "2026-07-01"
 *             startTime: "14:30"
 *             endTime: "16:45"
 *             ticketPrice: 120
 *     responses:
 *       "201":
 *         description: Showtime created
 *       "400":
 *         description: Validation failed (e.g. invalid time format, endTime <= startTime)
 *       "401":
 *         description: Not authenticated
 *       "403":
 *         description: Forbidden — Admin role required
 *       "404":
 *         description: Movie or Hall not found
 *       "409":
 *         description: Time conflict — Overlapping showtime exists
 */

/**
 * @swagger
 * /showtimes:
 *   get:
 *     summary: Get all showtimes (paginated)
 *     description: |
 *       Returns a paginated list of all showtimes.
 *       - Requires Admin authentication
 *       - Supports filtering by movie, hall, and date
 *     tags: [Showtimes (Admin)]
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
 *           default: 10
 *       - in: query
 *         name: movie
 *         schema:
 *           type: string
 *       - in: query
 *         name: hall
 *         schema:
 *           type: string
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       "200":
 *         description: Paginated list of showtimes
 *       "401":
 *         description: Not authenticated
 *       "403":
 *         description: Forbidden — Admin role required
 */

/**
 * @swagger
 * /showtimes/{id}:
 *   put:
 *     summary: Update a showtime
 *     description: |
 *       Updates an existing showtime.
 *       - Requires Admin authentication
 *       - Re-validates overlap and time constraints if scheduling fields change
 *     tags: [Showtimes (Admin)]
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
 *               endTime:
 *                 type: string
 *               ticketPrice:
 *                 type: number
 *               isActive:
 *                 type: boolean
 *           example:
 *             ticketPrice: 150
 *     responses:
 *       "200":
 *         description: Showtime updated successfully
 *       "400":
 *         description: Validation failed
 *       "401":
 *         description: Not authenticated
 *       "403":
 *         description: Forbidden — Admin role required
 *       "404":
 *         description: Showtime not found
 *       "409":
 *         description: Time conflict — Overlapping showtime exists
 */

/**
 * @swagger
 * /showtimes/{id}:
 *   delete:
 *     summary: Soft-delete a showtime
 *     description: |
 *       Sets `isActive = false` on the showtime.
 *       - Requires Admin authentication
 *     tags: [Showtimes (Admin)]
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
 *         description: Showtime deleted successfully
 *       "401":
 *         description: Not authenticated
 *       "403":
 *         description: Forbidden — Admin role required
 *       "404":
 *         description: Showtime not found
 */
