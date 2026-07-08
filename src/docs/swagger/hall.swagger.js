// ─── Halls (Admin) ──────────────────────────────────────────────────────────

/**
 * @swagger
 * /halls:
 *   post:
 *     summary: Create a new hall with automatic seat generation
 *     description: |
 *       Creates a new cinema hall and automatically generates all seats.
 *       - Requires Admin authentication
 *       - Seat names are generated automatically (e.g., A1, B12)
 *       - Total seats is computed as `totalRows × totalColumns`
 *       - If seat generation fails, the hall creation is rolled back automatically
 *     tags: [Halls (Admin)]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - totalRows
 *               - totalColumns
 *             properties:
 *               name:
 *                 type: string
 *                 example: Hall 1
 *               screenType:
 *                 type: string
 *                 enum: [standard, imax, vip]
 *                 default: standard
 *                 example: imax
 *               totalRows:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 26
 *                 example: 10
 *               totalColumns:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 50
 *                 example: 15
 *           example:
 *             name: Hall 1
 *             screenType: imax
 *             totalRows: 10
 *             totalColumns: 15
 *     responses:
 *       "201":
 *         description: Hall created with seats auto-generated
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Hall created successfully
 *               data:
 *                 hall:
 *                   _id: "665f1a2b3c4d5e6f70000020"
 *                   name: Hall 1
 *                   screenType: imax
 *                   totalRows: 10
 *                   totalColumns: 15
 *                   isActive: true
 *                   createdAt: "2026-07-01T10:00:00.000Z"
 *                   updatedAt: "2026-07-01T10:00:00.000Z"
 *                 totalSeatsGenerated: 150
 *       "400":
 *         description: Validation failed (e.g. rows/columns out of bounds)
 *       "401":
 *         description: Not authenticated
 *       "403":
 *         description: Forbidden — Admin role required
 *       "409":
 *         description: Hall name already exists
 */

/**
 * @swagger
 * /halls:
 *   get:
 *     summary: Get all halls
 *     description: |
 *       Returns a list of all halls in the system.
 *       - Requires Admin authentication
 *     tags: [Halls (Admin)]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: List of all halls
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Halls fetched successfully
 *               data:
 *                 halls:
 *                   - _id: "665f1a2b3c4d5e6f70000020"
 *                     name: Hall 1
 *                     screenType: imax
 *                     totalRows: 10
 *                     totalColumns: 15
 *                     isActive: true
 *                 total: 1
 *       "401":
 *         description: Not authenticated
 *       "403":
 *         description: Forbidden — Admin role required
 */

/**
 * @swagger
 * /halls/{id}:
 *   get:
 *     summary: Get hall details by ID
 *     description: |
 *       Returns full details of a specific hall.
 *       - Requires Admin authentication
 *     tags: [Halls (Admin)]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "665f1a2b3c4d5e6f70000020"
 *     responses:
 *       "200":
 *         description: Hall details
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Hall fetched successfully
 *               data:
 *                 hall:
 *                   _id: "665f1a2b3c4d5e6f70000020"
 *                   name: Hall 1
 *                   screenType: imax
 *                   totalRows: 10
 *                   totalColumns: 15
 *                   isActive: true
 *       "401":
 *         description: Not authenticated
 *       "403":
 *         description: Forbidden — Admin role required
 *       "404":
 *         description: Hall not found
 */

/**
 * @swagger
 * /halls/{id}:
 *   put:
 *     summary: Update a hall
 *     description: |
 *       Updates an existing hall.
 *       - Requires Admin authentication
 *       - `totalRows` and `totalColumns` cannot be updated (seat regeneration not supported yet)
 *     tags: [Halls (Admin)]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "665f1a2b3c4d5e6f70000020"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               screenType:
 *                 type: string
 *                 enum: [standard, imax, vip]
 *               isActive:
 *                 type: boolean
 *           example:
 *             name: Hall 1 Updated
 *             screenType: standard
 *     responses:
 *       "200":
 *         description: Hall updated successfully
 *       "400":
 *         description: Validation failed (e.g. attempted to change rows/columns)
 *       "401":
 *         description: Not authenticated
 *       "403":
 *         description: Forbidden — Admin role required
 *       "404":
 *         description: Hall not found
 */

/**
 * @swagger
 * /halls/{id}:
 *   delete:
 *     summary: Soft-delete a hall
 *     description: |
 *       Sets `isActive = false` on the hall.
 *       - Requires Admin authentication
 *       - Does not delete the generated seats
 *     tags: [Halls (Admin)]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "665f1a2b3c4d5e6f70000020"
 *     responses:
 *       "200":
 *         description: Hall deleted successfully
 *       "401":
 *         description: Not authenticated
 *       "403":
 *         description: Forbidden — Admin role required
 *       "404":
 *         description: Hall not found
 */

/**
 * @swagger
 * /halls/{id}/seats:
 *   get:
 *     summary: Get all seats for a hall
 *     description: |
 *       Returns the physical seat layout for a hall.
 *       - Requires Admin authentication
 *       - This does NOT include availability (see `GET /showtimes/{id}/seats` for bookings)
 *     tags: [Halls (Admin)]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Hall ID
 *         example: "665f1a2b3c4d5e6f70000020"
 *     responses:
 *       "200":
 *         description: Hall details with physical seat list
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Hall seats fetched successfully
 *               data:
 *                 hall:
 *                   _id: "665f1a2b3c4d5e6f70000020"
 *                   name: Hall 1
 *                 seats:
 *                   - _id: "665f1a2b3c4d5e6f70000030"
 *                     label: A1
 *                     row: A
 *                     number: 1
 *                     type: standard
 *                     isActive: true
 *                 totalSeats: 150
 *       "401":
 *         description: Not authenticated
 *       "403":
 *         description: Forbidden — Admin role required
 *       "404":
 *         description: Hall not found
 */
