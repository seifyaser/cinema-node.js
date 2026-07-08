// ─── Authentication ─────────────────────────────────────────────────────────

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     description: |
 *       Creates a new user account and returns a JWT token.
 *       - Email must be unique
 *       - Phone must be unique
 *       - Password is hashed before storage (never returned)
 *       - Default role is `user`
 *     tags: [Authentication]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - phone
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Ahmed Hassan
 *               email:
 *                 type: string
 *                 format: email
 *                 example: ahmed@example.com
 *               phone:
 *                 type: string
 *                 example: "+201234567890"
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 example: myPassword123
 *           example:
 *             name: Ahmed Hassan
 *             email: ahmed@example.com
 *             phone: "+201234567890"
 *             password: myPassword123
 *     responses:
 *       "201":
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Registration successful
 *               data:
 *                 user:
 *                   _id: "665f1a2b3c4d5e6f70000001"
 *                   name: Ahmed Hassan
 *                   email: ahmed@example.com
 *                   phone: "+201234567890"
 *                   role: user
 *                   avatar: null
 *                   isActive: true
 *                   createdAt: "2026-07-01T10:00:00.000Z"
 *                   updatedAt: "2026-07-01T10:00:00.000Z"
 *                 token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       "400":
 *         description: Validation failed — missing or invalid fields
 *       "409":
 *         description: Duplicate email or phone number
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     description: |
 *       Authenticates a user with email and password.
 *       Returns a JWT token valid for 7 days.
 *       - Deactivated accounts cannot log in
 *     tags: [Authentication]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: ahmed@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: myPassword123
 *           example:
 *             email: ahmed@example.com
 *             password: myPassword123
 *     responses:
 *       "200":
 *         description: Login successful
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Login successful
 *               data:
 *                 user:
 *                   _id: "665f1a2b3c4d5e6f70000001"
 *                   name: Ahmed Hassan
 *                   email: ahmed@example.com
 *                   phone: "+201234567890"
 *                   role: user
 *                   isActive: true
 *                 token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       "401":
 *         description: Incorrect email or password, or account deactivated
 */

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get current user profile
 *     description: Returns the profile of the currently authenticated user.
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: User profile fetched
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: User fetched successfully
 *               data:
 *                 user:
 *                   _id: "665f1a2b3c4d5e6f70000001"
 *                   name: Ahmed Hassan
 *                   email: ahmed@example.com
 *                   phone: "+201234567890"
 *                   role: user
 *                   avatar: null
 *                   isActive: true
 *       "401":
 *         description: Not authenticated — missing or invalid token
 */
