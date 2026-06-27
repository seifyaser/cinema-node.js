/**
 * @swagger
 * tags:
 *   name: Movies
 *   description: Movie management and browsing
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Movie:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         poster:
 *           type: string
 *           format: uri
 *         gallery:
 *           type: array
 *           items:
 *             type: string
 *             format: uri
 *         trailerUrl:
 *           type: string
 *           format: uri
 *         genre:
 *           type: array
 *           items:
 *             type: string
 *         duration:
 *           type: integer
 *           description: Duration in minutes
 *         ageRating:
 *           type: string
 *           enum: [G, PG, PG-13, R, NC-17]
 *         releaseDate:
 *           type: string
 *           format: date
 *         actors:
 *           type: array
 *           items:
 *             type: string
 *         status:
 *           type: string
 *           enum: [now_showing, coming_soon]
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
 * /movies:
 *   get:
 *     summary: Get all active movies (paginated)
 *     tags: [Movies]
 *     security: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Items per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [now_showing, coming_soon]
 *         description: Filter by movie status
 *       - in: query
 *         name: genre
 *         schema:
 *           type: string
 *         description: Filter by genre
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           example: releaseDate:desc
 *         description: Sort field and order (e.g. releaseDate:desc)
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Search term — matches title, actors, or genre (case-insensitive)
 *     responses:
 *       "200":
 *         description: Paginated list of movies
 *       "400":
 *         description: Validation failed
 */

/**
 * @swagger
 * /movies/{id}:
 *   get:
 *     summary: Get movie details by ID
 *     tags: [Movies]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Movie ID
 *     responses:
 *       "200":
 *         description: Movie details
 *       "404":
 *         description: Movie not found
 */

/**
 * @swagger
 * /movies:
 *   post:
 *     summary: Create a new movie (Admin only)
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - poster
 *               - genre
 *               - duration
 *               - releaseDate
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               poster:
 *                 type: string
 *                 format: uri
 *               gallery:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uri
 *               trailerUrl:
 *                 type: string
 *                 format: uri
 *               genre:
 *                 type: array
 *                 items:
 *                   type: string
 *               duration:
 *                 type: integer
 *                 description: Duration in minutes
 *               ageRating:
 *                 type: string
 *                 enum: [G, PG, PG-13, R, NC-17]
 *               releaseDate:
 *                 type: string
 *                 format: date
 *               actors:
 *                 type: array
 *                 items:
 *                   type: string
 *               status:
 *                 type: string
 *                 enum: [now_showing, coming_soon]
 *     responses:
 *       "201":
 *         description: Movie created
 *       "400":
 *         description: Validation failed
 *       "401":
 *         description: Unauthorized
 *       "403":
 *         description: Forbidden — Admin only
 */

/**
 * @swagger
 * /movies/{id}:
 *   put:
 *     summary: Update a movie by ID (Admin only)
 *     tags: [Movies]
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
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               poster:
 *                 type: string
 *                 format: uri
 *               status:
 *                 type: string
 *                 enum: [now_showing, coming_soon]
 *               isActive:
 *                 type: boolean
 *     responses:
 *       "200":
 *         description: Movie updated
 *       "400":
 *         description: Validation failed
 *       "401":
 *         description: Unauthorized
 *       "403":
 *         description: Forbidden — Admin only
 *       "404":
 *         description: Movie not found
 */

/**
 * @swagger
 * /movies/{id}:
 *   delete:
 *     summary: Soft-delete a movie (Admin only)
 *     tags: [Movies]
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
 *         description: Movie deleted
 *       "401":
 *         description: Unauthorized
 *       "403":
 *         description: Forbidden — Admin only
 *       "404":
 *         description: Movie not found
 */
