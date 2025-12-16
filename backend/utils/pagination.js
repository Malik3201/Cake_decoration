/**
 * Parse pagination parameters from request query
 * @param {Object} query - Request query object
 * @param {Object} defaults - Default values
 * @returns {Object} Pagination options
 */
export function parsePagination(query, defaults = {}) {
  const maxLimit = defaults.maxLimit || 100;
  const defaultLimit = defaults.limit || 20;
  const defaultPage = 1;

  let page = parseInt(query.page, 10);
  let limit = parseInt(query.limit, 10);

  if (isNaN(page) || page < 1) {
    page = defaultPage;
  }

  if (isNaN(limit) || limit < 1) {
    limit = defaultLimit;
  }

  if (limit > maxLimit) {
    limit = maxLimit;
  }

  const skip = (page - 1) * limit;

  return { page, limit, skip };
}

/**
 * Build pagination metadata for response
 * @param {number} totalCount - Total number of documents
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @returns {Object} Pagination metadata
 */
export function buildPaginationMeta(totalCount, page, limit) {
  const totalPages = Math.ceil(totalCount / limit);
  
  return {
    currentPage: page,
    totalPages,
    totalCount,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
}
