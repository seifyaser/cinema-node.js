/**
 * @swagger
 * tags:
 *   name: Halls
 *   description: Cinema hall management (Admin only)
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Hall:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *           example: Hall 1
 *         screenType:
 *           type: string
 *           enum: [standard, imax, vip]
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
 *         isActive:
 *           type: boolean
 */

/**
 * @swagger
 * /halls:
 *   post:
 *     summary: Create a new hall with automatic seat generation (Admin only)
 *     tags: [Halls]
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
 *     responses:
 *       "201":
 *         description: Hall created with seats auto-generated
 *       "400":
 *         description: Validation failed
 *       "401":
 *         description: Unauthorized
 *       "403":
 *         description: Forbidden — Admin only
 *       "409":
 *         description: Hall name already exists
 */

/**
 * @swagger
 * /halls:
 *   get:
 *     summary: Get all halls (Admin only)
 *     tags: [Halls]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: List of all halls
 *       "401":
 *         description: Unauthorized
 *       "403":
 *         description: Forbidden — Admin only
 */

/**
 * @swagger
 * /halls/{id}:
 *   get:
 *     summary: Get hall details by ID (Admin only)
 *     tags: [Halls]
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
 *         description: Hall details
 *       "404":
 *         description: Hall not found
 */

/**
 * @swagger
 * /halls/{id}:
 *   put:
 *     summary: Update a hall (Admin only)
 *     tags: [Halls]
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
 *               name:
 *                 type: string
 *               screenType:
 *                 type: string
 *                 enum: [standard, imax, vip]
 *               isActive:
 *                 type: boolean
 *     responses:
 *       "200":
 *         description: Hall updated
 *       "400":
 *         description: Validation failed
 *       "404":
 *         description: Hall not found
 */

/**
 * @swagger
 * /halls/{id}:
 *   delete:
 *     summary: Soft-delete a hall (Admin only)
 *     tags: [Halls]
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
 *         description: Hall deleted
 *       "404":
 *         description: Hall not found
 */

/**
 * @swagger
 * /halls/{id}/seats:
 *   get:
 *     summary: Get all seats for a hall (Admin only)
 *     tags: [Halls]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Hall ID
 *     responses:
 *       "200":
 *         description: Hall details with seat list
 *       "404":
 *         description: Hall not found
 */
