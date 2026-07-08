const mongoose = require('mongoose');
const PAYMENT_STATUS = require('../constants/paymentStatus');

const paymentSchema = new mongoose.Schema(
  {
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: [true, 'Booking reference is required'],
    },
    provider: {
      type: String,
      default: 'paymob',
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0, 'Amount cannot be negative'],
    },
    paymentStatus: {
      type: String,
      enum: {
        values: [
          PAYMENT_STATUS.PENDING,
          PAYMENT_STATUS.PAID,
          PAYMENT_STATUS.FAILED,
        ],
        message: 'Payment status must be pending, paid, or failed',
      },
      default: PAYMENT_STATUS.PENDING,
    },
    transactionId: {
      type: String,
      required: [true, 'Transaction ID is required'],
      unique: true, // Prevents storing the same successful transaction twice
    },
    orderId: {
      type: String,
      required: [true, 'Order ID is required'],
    },
    paymentKey: {
      type: String,
      required: [true, 'Payment Key is required'],
    },
    paidAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Performance indexes
paymentSchema.index({ booking: 1 });
paymentSchema.index({ transactionId: 1 });

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
