import Joi from 'joi';
import mongoose from 'mongoose';

/**
 * Joi custom validator for MongoDB ObjectId
 * @param {string} value - The value to validate
 * @param {Object} helpers - Joi helpers object
 * @returns {string|Error} Valid ObjectId or error
 */
const objectId = Joi.string().custom((value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error('any.invalid');
  }
  return value;
}, 'ObjectId validation');

export { objectId };
