// ─── Payments (User) ────────────────────────────────────────────────────────

/**
 * @swagger
 * /payments/verify:
 *   post:
 *     summary: Verify a completed payment
 *     description: |
 *       Verifies a Paymob transaction and confirms the associated booking.
 *       - Requires authentication.
 *       - The booking must be owned by the user, pending, and not expired.
 *       - This endpoint is idempotent. If the transaction was already successfully verified, it returns success without duplicating records.
 *       - Validates the transaction directly with Paymob APIs.
 *     tags: [Payments (User)]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bookingId
 *               - transactionId
 *               - orderId
 *               - paymentKey
 *             properties:
 *               bookingId:
 *                 type: string
 *               transactionId:
 *                 type: string
 *               orderId:
 *                 type: string
 *               paymentKey:
 *                 type: string
 *           example:
 *             bookingId: "665f1a2b3c4d5e6f70000050"
 *             transactionId: "12345678"
 *             orderId: "87654321"
 *             paymentKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *     responses:
 *       "200":
 *         description: Payment successfully verified and booking confirmed
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Payment verified and booking confirmed
 *               data:
 *                 status: paid
 *       "400":
 *         description: Verification failed (invalid request, expired booking, or failed Paymob transaction)
 *       "401":
 *         description: Not authenticated
 *       "404":
 *         description: Booking not found
 *       "409":
 *         description: Conflict - Transaction ID already used for another booking
 */

/**
 * @swagger
 * /payments/booking/{bookingId}:
 *   get:
 *     summary: Get payment status for a booking
 *     description: |
 *       Returns the latest payment status associated with a booking.
 *       - Requires authentication.
 *       - Only the booking owner can access the status.
 *     tags: [Payments (User)]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookingId
 *         required: true
 *         schema:
 *           type: string
 *         example: "665f1a2b3c4d5e6f70000050"
 *     responses:
 *       "200":
 *         description: Payment status fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Payment status fetched successfully
 *               data:
 *                 bookingId: "665f1a2b3c4d5e6f70000050"
 *                 status: paid
 *                 transactionId: "12345678"
 *                 paidAt: "2026-07-01T10:05:00.000Z"
 *       "401":
 *         description: Not authenticated
 *       "404":
 *         description: Booking not found
 */
