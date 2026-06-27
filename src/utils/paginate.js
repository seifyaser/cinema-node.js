/**
 * Returns skip/limit values for Mongoose queries.
 * @param {number|string} page - Current page number (1-based)
 * @param {number|string} limit - Items per page
 */
const getPagination = (page = 1, limit = 10) => {
  const parsedPage = Math.max(1, parseInt(page));
  const parsedLimit = Math.min(100, Math.max(1, parseInt(limit)));
  const skip = (parsedPage - 1) * parsedLimit;
  return { skip, limit: parsedLimit, page: parsedPage };
};

/**
 * Builds the pagination metadata object for API responses.
 */
const getPaginationMeta = (total, page, limit) => {
  const totalPages = Math.ceil(total / limit);
  return {
    total,
    page,
    limit,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
};

module.exports = { getPagination, getPaginationMeta };
