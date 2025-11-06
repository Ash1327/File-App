const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Multer error (file upload errors)
  if (err.name === 'MulterError') {
    let message = 'File upload error';
    let details = [err.message];

    // Handle specific multer error codes
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      message = 'Multiple files not allowed';
      details = ['Only one file can be uploaded at a time.'];
    } else if (err.code === 'LIMIT_FILE_SIZE') {
      message = 'File too large';
      details = ['File size exceeds the maximum allowed limit (10MB)'];
    } else if (err.code === 'LIMIT_FILE_COUNT') {
      message = 'Too many files';
      details = ['Only one file can be uploaded at a time'];
    } else if (err.code === 'LIMIT_FIELD_KEY') {
      message = 'Unexpected field';
      details = ['Multiple files not allowed. Only one file can be uploaded at a time.'];
    }

    return res.status(400).json({
      success: false,
      status: 400,
      message: message,
      details: details
    });
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      success: false,
      status: 400,
      message: 'Validation Error',
      details: errors
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(409).json({
      success: false,
      status: 409,
      message: `${field} already exists`,
      details: err.message
    });
  }

  // Mongoose cast error (invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      status: 400,
      message: 'Invalid ID format',
      details: err.message
    });
  }

  // Default error
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    status: status,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

export default errorHandler;
