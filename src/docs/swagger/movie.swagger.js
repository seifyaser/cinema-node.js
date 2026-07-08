// ─── Movies (Public) ────────────────────────────────────────────────────────

/**
 * @swagger
 * /movies:
 *   get:
 *     summary: Get all active movies (paginated)
 *     description: |
 *       Returns paginated list of active movies.
 *       Supports filtering by status and genre, and sorting.
 *       - Only active movies are returned (`isActive: true`)
 *       - Default sort: releaseDate descending
 *     tags: [Movies (Public)]
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
 *           maximum: 100
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
 *         description: Filter by genre (e.g. "Action")
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           example: releaseDate:desc
 *         description: "Sort field and order (e.g. releaseDate:desc, duration:asc)"
 *     responses:
 *       "200":
 *         description: Paginated list of movies
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Movies fetched successfully
 *               data:
 *                 - _id: "665f1a2b3c4d5e6f70000010"
 *                   title: The Dark Knight
 *                   poster: https://example.com/posters/dark-knight.jpg
 *                   genre: ["Action", "Thriller"]
 *                   duration: 152
 *                   ageRating: PG-13
 *                   status: now_showing
 *                   releaseDate: "2026-07-01"
 *               pagination:
 *                 total: 25
 *                 page: 1
 *                 limit: 10
 *                 totalPages: 3
 *                 hasNext: true
 *                 hasPrev: false
 *       "400":
 *         description: Validation failed
 */

/**
 * @swagger
 * /movies/search:
 *   get:
 *     summary: Search movies by title, actor, or genre
 *     description: |
 *       Case-insensitive search across title, actors, and genre fields.
 *       Returns paginated results.
 *       - Only searches active movies
 *     tags: [Movies (Public)]
 *     security: []
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *           minLength: 1
 *         description: Search query
 *         example: knight
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
 *     responses:
 *       "200":
 *         description: Search results
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Search results fetched successfully
 *               data:
 *                 - _id: "665f1a2b3c4d5e6f70000010"
 *                   title: The Dark Knight
 *                   genre: ["Action", "Thriller"]
 *               pagination:
 *                 total: 1
 *                 page: 1
 *                 limit: 10
 *                 totalPages: 1
 *                 hasNext: false
 *                 hasPrev: false
 *       "400":
 *         description: Missing search query
 */

/**
 * @swagger
 * /movies/{id}:
 *   get:
 *     summary: Get movie details by ID
 *     description: |
 *       Returns full details of a single active movie.
 *       - Returns 404 if movie is inactive or does not exist
 *     tags: [Movies (Public)]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Movie ID
 *         example: "665f1a2b3c4d5e6f70000010"
 *     responses:
 *       "200":
 *         description: Movie details
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Movie fetched successfully
 *               data:
 *                 movie:
 *                   _id: "665f1a2b3c4d5e6f70000010"
 *                   title: The Dark Knight
 *                   description: When the menace known as the Joker wreaks havoc on Gotham...
 *                   poster: https://example.com/posters/dark-knight.jpg
 *                   gallery: []
 *                   trailerUrl: https://youtube.com/watch?v=example
 *                   genre: ["Action", "Thriller"]
 *                   duration: 152
 *                   ageRating: PG-13
 *                   releaseDate: "2026-07-01"
 *                   actors:
 *                     - name: Christian Bale
 *                       image: https://example.com/images/bale.jpg
 *                     - name: Heath Ledger
 *                       image: https://example.com/images/ledger.jpg
 *                   status: now_showing
 *                   isActive: true
 *       "404":
 *         description: Movie not found
 */

// ─── Movies (Admin) ─────────────────────────────────────────────────────────

/**
 * @swagger
 * /movies:
 *   post:
 *     summary: Create a new movie
 *     description: |
 *       Creates a new movie in the system.
 *       - Requires Admin authentication
 *       - All required fields must be provided
 *       - Default status is `coming_soon`
 *     tags: [Movies (Admin)]
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
 *                 example: The Dark Knight
 *               description:
 *                 type: string
 *                 example: When the menace known as the Joker wreaks havoc...
 *               poster:
 *                 type: string
 *                 format: uri
 *                 example: https://example.com/posters/dark-knight.jpg
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
 *                 example: ["Action", "Thriller"]
 *               duration:
 *                 type: integer
 *                 description: Duration in minutes
 *                 example: 152
 *               ageRating:
 *                 type: string
 *                 enum: [G, PG, PG-13, R, NC-17]
 *               releaseDate:
 *                 type: string
 *                 format: date
 *                 example: "2026-07-01"
 *               actors:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - name
 *                     - image
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: Christian Bale
 *                     image:
 *                       type: string
 *                       format: uri
 *                       example: https://example.com/images/bale.jpg
 *               status:
 *                 type: string
 *                 enum: [now_showing, coming_soon]
 *     responses:
 *       "201":
 *         description: Movie created successfully
 *       "400":
 *         description: Validation failed
 *       "401":
 *         description: Not authenticated
 *       "403":
 *         description: Forbidden — Admin role required
 */

/**
 * @swagger
 * /movies/{id}:
 *   put:
 *     summary: Update a movie
 *     description: |
 *       Updates an existing movie by ID.
 *       - Requires Admin authentication
 *       - At least one field must be provided
 *       - Can update isActive to soft-delete/restore
 *     tags: [Movies (Admin)]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "665f1a2b3c4d5e6f70000010"
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
 *               ageRating:
 *                 type: string
 *                 enum: [G, PG, PG-13, R, NC-17]
 *               releaseDate:
 *                 type: string
 *                 format: date
 *               actors:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - name
 *                     - image
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: Christian Bale
 *                     image:
 *                       type: string
 *                       format: uri
 *                       example: https://example.com/images/bale.jpg
 *               status:
 *                 type: string
 *                 enum: [now_showing, coming_soon]
 *               isActive:
 *                 type: boolean
 *           example:
 *             status: now_showing
 *     responses:
 *       "200":
 *         description: Movie updated successfully
 *       "400":
 *         description: Validation failed
 *       "401":
 *         description: Not authenticated
 *       "403":
 *         description: Forbidden — Admin role required
 *       "404":
 *         description: Movie not found
 */

/**
 * @swagger
 * /movies/{id}:
 *   delete:
 *     summary: Soft-delete a movie
 *     description: |
 *       Sets `isActive = false` on the movie.
 *       The movie is not physically removed from the database.
 *       - Requires Admin authentication
 *     tags: [Movies (Admin)]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "665f1a2b3c4d5e6f70000010"
 *     responses:
 *       "200":
 *         description: Movie deleted successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Movie deleted successfully
 *               data: {}
 *       "401":
 *         description: Not authenticated
 *       "403":
 *         description: Forbidden — Admin role required
 *       "404":
 *         description: Movie not found
 */
