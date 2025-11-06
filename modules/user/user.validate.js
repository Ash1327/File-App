import Joi from 'joi';
import { validate } from '../../middleware/validate.js';
import { objectId } from '../../middleware/objectId.js';

// User creation schema
const createUserSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(3)
    .max(50)
    .required()
    .messages({
      'string.empty': 'Name is required',
      'string.min': 'Name must be at least 3 characters long',
      'string.max': 'Name must not exceed 50 characters',
      'any.required': 'Name is required'
    }),
  
  email: Joi.string()
    .email()
    .lowercase()
    .trim()
    .required()
    .messages({
      'string.empty': 'Email is required',
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),
  
  organizationId: objectId
    .optional()
    .allow(null, '')
    .messages({
      'any.invalid': 'Invalid organization ID format'
    }),
  
  role: Joi.string()
    .valid('admin', 'user')
    .required()
    .messages({
      'any.only': 'Role must be either "admin" or "user"',
      'any.required': 'Role is required'
    })
});

export const validateCreateUser = validate(createUserSchema, 'body');
