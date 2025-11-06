import fs from 'fs';
import File from './file.model.js';
import User from '../user/user.model.js';

const uploadFile = async (fileData, uploadedBy) => {
  const user = await User.findById(uploadedBy);
  if (!user) {
    throw new Error('User not found');
  }

  const file = new File({
    fileName: fileData.originalname,
    filePath: fileData.path,
    uploadedBy: uploadedBy
  });

  const savedFile = await file.save();
  await savedFile.populate('uploadedBy');
  return savedFile;
};

const downloadFile = async (fileId) => {
  const file = await File.findById(fileId).populate('uploadedBy');
  if (!file) {
    throw new Error('File not found');
  }

  if (!fs.existsSync(file.filePath)) {
    throw new Error('File not found on disk');
  }

  const stats = fs.statSync(file.filePath);
  
  return {
    file,
    stats
  };
};

const deleteFile = (filePath) => {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

export { uploadFile, downloadFile, deleteFile };
