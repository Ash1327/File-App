import Joi from 'joi';
import { validate } from '../../middleware/validate.js';

// Organization creation schema
const createOrganizationSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(3)
    .max(100)
    .required()
    .messages({
      'string.empty': 'Organization name is required',
      'string.min': 'Organization name must be at least 3 characters long',
      'string.max': 'Organization name must not exceed 100 characters',
      'any.required': 'Organization name is required'
    })
});

export const validateCreateOrganization = validate(createOrganizationSchema, 'body');
