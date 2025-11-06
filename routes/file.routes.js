import express from 'express';
import upload from '../config/multerConfig.js';
import { fileController, fileValidate } from '../modules/file/index.js';

const router = express.Router();

// POST /api/files/upload - Upload file using Multer with stream
router.post('/upload', 
  upload.single('file'),
  fileValidate.validateFileUpload,
  fileController.uploadFile
);

// GET /api/files/download/:id - Download file using stream
router.get('/download/:id',
  fileValidate.validateFileDownload,
  fileController.downloadFile
);

export default router;

