import fs from 'fs';
import { validate } from '../../middleware/validate.js';
import { objectId } from '../../middleware/objectId.js';
import Joi from 'joi';
import * as fileService from './file.service.js';

// File upload validation schema
const fileUploadSchema = Joi.object({
  uploadedBy: objectId.required().messages({
    'string.empty': 'uploadedBy (user ID) is required',
    'any.required': 'uploadedBy (user ID) is required',
    'any.invalid': 'Invalid user ID format'
  })
});

// File download validation schema
const fileDownloadSchema = Joi.object({
  id: objectId.required().messages({
    'string.empty': 'File ID is required',
    'any.required': 'File ID is required',
    'any.invalid': 'Invalid file ID format'
  })
});

// Error handler to delete file on validation error
const deleteFileOnError = (req, res, error) => {
  if (req.file?.path && fs.existsSync(req.file.path)) {
    fileService.deleteFile(req.file.path);
  }
};

// File upload validation with file existence check
const validateFileUploadWithCheck = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      status: 400,
      message: 'No file uploaded',
      details: ['File is required']
    });
  }
  return validate(fileUploadSchema, 'body', deleteFileOnError)(req, res, next);
};

export const validateFileUpload = validateFileUploadWithCheck;
export const validateFileDownload = validate(fileDownloadSchema, 'params');
