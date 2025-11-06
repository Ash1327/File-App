import Joi from 'joi';

/**
 * Generic validation middleware
 * @param {Joi.ObjectSchema} schema - Joi validation schema
 * @param {string} property - Request property to validate ('body', 'params', 'query')
 * @param {Function} onError - Optional callback function to execute on validation error
 * @returns {Function} Express middleware function
 */
const validate = (schema, property = 'body', onError = null) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      // Execute custom error handler if provided
      if (onError && typeof onError === 'function') {
        onError(req, res, error);
      }

      const errors = error.details.map(detail => detail.message);
      return res.status(400).json({
        success: false,
        status: 400,
        message: 'Validation error',
        details: errors
      });
    }

    // Replace req[property] with validated and sanitized value
    req[property] = value;
    next();
  };
};

export { validate };
