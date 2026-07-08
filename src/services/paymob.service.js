const axios = require('axios');
const env = require('../config/env');
const ApiError = require('../utils/apiError');
const logger = require('../config/logger');

/**
 * Paymob Provider Service
 * Responsible for all direct communication with Paymob APIs.
 * This is kept isolated to make switching or updating verification logic easier later.
 */

// Define standard endpoints
const PAYMOB_API_BASE_URL = 'https://accept.paymob.com/api';
const ENDPOINTS = {
  // This endpoint might be updated later when Flutter integration is finalized
  TRANSACTION_VERIFICATION: (transactionId) => `${PAYMOB_API_BASE_URL}/acceptance/transactions/${transactionId}`,
};

const _ensureConfigured = () => {
  if (!env.paymob.apiKey) {
    logger.error('Paymob configuration error: PAYMOB_API_KEY is missing');
    throw new ApiError(500, 'Payment Gateway is not configured properly.');
  }
};

/**
 * Verifies a transaction directly with Paymob APIs.
 *
 * @param {string} transactionId - The transaction ID returned by the Flutter SDK
 * @param {string} orderId - The associated order ID
 * @param {string} paymentKey - The payment key used
 * @returns {Promise<boolean>} - True if payment is verified and successful
 */
const verifyTransaction = async (transactionId, orderId, paymentKey) => {
  _ensureConfigured();

  try {
    const url = ENDPOINTS.TRANSACTION_VERIFICATION(transactionId);
    
    // Perform actual HTTP call to Paymob
    // The exact query parameters/auth tokens will depend on the final chosen Paymob API
    // but the architecture isolates it here.
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${env.paymob.apiKey}`,
      },
    });

    const transactionData = response.data;

    // Verify transaction fields match our expectation
    if (String(transactionData.order.id) !== String(orderId)) {
      logger.warn(`Paymob Verification Failed: Order ID mismatch for transaction ${transactionId}`);
      return false;
    }

    if (transactionData.success !== true) {
      logger.warn(`Paymob Verification Failed: Transaction ${transactionId} not marked as success by Paymob`);
      return false;
    }

    return true;
  } catch (error) {
    if (error.response) {
      logger.error(`Paymob API Error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
      // If the transaction doesn't exist or is invalid, consider it failed verification
      if (error.response.status === 404 || error.response.status === 400) {
        return false;
      }
    } else {
      logger.error(`Paymob Network Error: ${error.message}`);
    }
    
    // Throw an error so the service layer doesn't mark it as "failed" but rather fails to verify (e.g. timeout)
    throw new ApiError(503, 'Could not reach Payment Gateway for verification.');
  }
};

module.exports = {
  verifyTransaction,
};
