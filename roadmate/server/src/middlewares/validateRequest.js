const ApiError = require('../utils/ApiError');

const validateRequest = (schema) => (req, res, next) => {
  try {
    if (schema && typeof schema.safeParse === 'function') {
      const result = schema.safeParse(req.body);
      if (!result.success) {
        throw new ApiError(400, 'Validation Error', result.error.errors);
      }
      // Override body with parsed data
      req.body = result.data;
    }
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = validateRequest;
