import fs from 'fs';
import * as fileService from './file.service.js';
import mime from 'mime-types';

const uploadFile = async (req, res, next) => {
  try {
    const { uploadedBy } = req.body;

    const savedFile = await fileService.uploadFile(req.file, uploadedBy);

    res.status(201).json({
      success: true,
      status: 201,
      message: 'File uploaded successfully',
      data: {
        id: savedFile._id,
        fileName: savedFile.fileName,
        uploadedBy: savedFile.uploadedBy,
        createdAt: savedFile.createdAt
      }
    });
  } catch (error) {
    // Delete uploaded file on any error
    if (req.file?.path && fs.existsSync(req.file.path)) {
      fileService.deleteFile(req.file.path);
    }

    if (error.message === 'User not found') {
      return res.status(404).json({ 
        success: false,
        status: 404,
        message: error.message,
        
      });
    }
    next(error);
  }
};

const downloadFile = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { file, stats } = await fileService.downloadFile(id);
  
      // Dynamically detect MIME type (e.g., application/pdf, image/png, etc.)
      const contentType = mime.lookup(file.fileName) || 'application/octet-stream';
  
      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Disposition', `attachment; filename="${file.fileName}"`);
      res.setHeader('Content-Length', stats.size);
  
      const fileStream = fs.createReadStream(file.filePath);
  
      fileStream.on('error', (err) => {
        if (!res.headersSent) {
          res.status(500).json({
            success: false,
            status: 500,
            message: 'Error reading file',
            error: err.message
          });
        }
      });
  
      fileStream.pipe(res);
  
    } catch (error) {
      if (error.message === 'File not found' || error.message === 'File not found on disk') {
        return res.status(404).json({
          success: false,
          status: 404,
          message: error.message,
        });
      }
      next(error);
    }
  };

export { uploadFile, downloadFile };
