/**
 * @swagger
 * tags:
 *   - name: Authentication
 *     description: User registration, login, and profile
 *   - name: Movies (Public)
 *     description: Browse, search, and view movie details
 *   - name: Showtimes (Public)
 *     description: Browse available dates, showtimes, and seat maps
 *   - name: Booking (User)
 *     description: Seat hold and booking management (requires authentication)
 *   - name: Payments (User)
 *     description: Verify Paymob transactions and check payment statuses
 *   - name: Movies (Admin)
 *     description: Movie CRUD operations (requires Admin role)
 *   - name: Halls (Admin)
 *     description: Hall and seat management (requires Admin role)
 *   - name: Showtimes (Admin)
 *     description: Showtime CRUD operations (requires Admin role)
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     SuccessResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *         data:
 *           type: object
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *         errors:
 *           type: array
 *           nullable: true
 *           items:
 *             type: object
 *             properties:
 *               field:
 *                 type: string
 *               message:
 *                 type: string
 *     PaginatedResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *         data:
 *           type: array
 *           items: {}
 *         pagination:
 *           $ref: '#/components/schemas/Pagination'
 *     Pagination:
 *       type: object
 *       properties:
 *         total:
 *           type: integer
 *           example: 25
 *         page:
 *           type: integer
 *           example: 1
 *         limit:
 *           type: integer
 *           example: 10
 *         totalPages:
 *           type: integer
 *           example: 3
 *         hasNext:
 *           type: boolean
 *           example: true
 *         hasPrev:
 *           type: boolean
 *           example: false
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "665f1a2b3c4d5e6f70000001"
 *         name:
 *           type: string
 *           example: Ahmed Hassan
 *         email:
 *           type: string
 *           format: email
 *           example: ahmed@example.com
 *         phone:
 *           type: string
 *           example: "+201234567890"
 *         role:
 *           type: string
 *           enum: [user, admin]
 *           example: user
 *         avatar:
 *           type: string
 *           nullable: true
 *         isActive:
 *           type: boolean
 *           example: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     Movie:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "665f1a2b3c4d5e6f70000010"
 *         title:
 *           type: string
 *           example: The Dark Knight
 *         description:
 *           type: string
 *           example: When the menace known as the Joker wreaks havoc on Gotham...
 *         poster:
 *           type: string
 *           format: uri
 *           example: https://example.com/posters/dark-knight.jpg
 *         gallery:
 *           type: array
 *           items:
 *             type: string
 *             format: uri
 *         trailerUrl:
 *           type: string
 *           format: uri
 *           nullable: true
 *         genre:
 *           type: array
 *           items:
 *             type: string
 *           example: ["Action", "Thriller"]
 *         duration:
 *           type: integer
 *           description: Duration in minutes
 *           example: 152
 *         ageRating:
 *           type: string
 *           enum: [G, PG, PG-13, R, NC-17]
 *           example: PG-13
 *         releaseDate:
 *           type: string
 *           format: date
 *           example: "2026-07-01"
 *         actors:
 *           type: array
 *           items:
 *             type: string
 *           example: ["Christian Bale", "Heath Ledger"]
 *         status:
 *           type: string
 *           enum: [now_showing, coming_soon]
 *           example: now_showing
 *         isActive:
 *           type: boolean
 *           example: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     Hall:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "665f1a2b3c4d5e6f70000020"
 *         name:
 *           type: string
 *           example: Hall 1
 *         screenType:
 *           type: string
 *           enum: [standard, imax, vip]
 *           example: imax
 *         totalRows:
 *           type: integer
 *           example: 10
 *         totalColumns:
 *           type: integer
 *           example: 15
 *         totalSeats:
 *           type: integer
 *           description: Computed virtual (totalRows × totalColumns)
 *           example: 150
 *         isActive:
 *           type: boolean
 *           example: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     Seat:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "665f1a2b3c4d5e6f70000030"
 *         hall:
 *           type: string
 *           description: Hall ID reference
 *         row:
 *           type: string
 *           example: A
 *         number:
 *           type: integer
 *           example: 5
 *         label:
 *           type: string
 *           example: A5
 *         type:
 *           type: string
 *           enum: [standard, vip]
 *           example: standard
 *         isActive:
 *           type: boolean
 *           example: true
 *     Showtime:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "665f1a2b3c4d5e6f70000040"
 *         movie:
 *           oneOf:
 *             - type: string
 *             - $ref: '#/components/schemas/Movie'
 *           description: Movie ID or populated Movie object
 *         hall:
 *           oneOf:
 *             - type: string
 *             - $ref: '#/components/schemas/Hall'
 *           description: Hall ID or populated Hall object
 *         date:
 *           type: string
 *           format: date
 *           example: "2026-07-15"
 *         startTime:
 *           type: string
 *           example: "14:30"
 *           description: HH:mm format
 *         endTime:
 *           type: string
 *           example: "16:45"
 *           description: HH:mm format
 *         ticketPrice:
 *           type: number
 *           example: 120
 *         isActive:
 *           type: boolean
 *           example: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     Booking:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "665f1a2b3c4d5e6f70000050"
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
 *           example: pending
 *         expiresAt:
 *           type: string
 *           format: date-time
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     Payment:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "665f1a2b3c4d5e6f70000060"
 *         booking:
 *           type: string
 *           description: Booking ID reference
 *         provider:
 *           type: string
 *           example: "paymob"
 *         amount:
 *           type: number
 *           example: 360
 *         paymentStatus:
 *           type: string
 *           enum: [pending, paid, failed]
 *           example: paid
 *         transactionId:
 *           type: string
 *           example: "12345678"
 *         orderId:
 *           type: string
 *           example: "87654321"
 *         paymentKey:
 *           type: string
 *         paidAt:
 *           type: string
 *           format: date-time
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     SeatMapItem:
 *       type: object
 *       properties:
 *         seatId:
 *           type: string
 *           example: "665f1a2b3c4d5e6f70000030"
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
 *           example: standard
 *         status:
 *           type: string
 *           enum: [available, held, reserved]
 *           example: available
 */
