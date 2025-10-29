import { RequestHandler } from 'express';
import multer from 'multer';
import { GridFSBucket, ObjectId } from 'mongodb';
import mongoose from 'mongoose';
import path from 'path';
import { Readable } from 'stream';

// Configure multer for file upload
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG and WebP are allowed.'));
    }
  },
});

// GridFS setup
let bucket: GridFSBucket;

// Initialize GridFS bucket
export const initializeGridFS = async () => {
  // Use mongoose's existing connection (db.ts connects before this is called)
  if (!mongoose.connection.db) {
    // If for some reason the connection isn't ready, connect using the env URI
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/autobits');
  }
  bucket = new GridFSBucket(mongoose.connection.db as any);
};

// Handler to upload file to GridFS
export const uploadToGridFS = async (file: Express.Multer.File) => {
  if (!bucket) {
    await initializeGridFS();
  }
  if (!file || !file.buffer) {
    throw new Error('No file buffer available for upload');
  }

  return new Promise<string>((resolve, reject) => {
    try {
      const filename = `${Date.now()}-${path.basename(file.originalname)}`;
      const uploadStream = bucket.openUploadStream(filename, {
        contentType: file.mimetype,
      });

      const readStream = Readable.from(file.buffer);
      readStream.pipe(uploadStream);

      uploadStream.on('finish', () => {
        resolve(uploadStream.id.toString());
      });

      uploadStream.on('error', (err: any) => {
        reject(err);
      });
    } catch (err) {
      reject(err);
    }
  });
};

// Handler to get file from GridFS by ID
export const getFileById: RequestHandler = async (req, res) => {
  if (!bucket) {
    await initializeGridFS();
  }

  try {
    const file = await bucket.find({ _id: new ObjectId(req.params.id) }).next();
    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    res.set('Content-Type', file.contentType);
    const downloadStream = bucket.openDownloadStream(new ObjectId(req.params.id));
    downloadStream.pipe(res);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve file' });
  }
};

// Middleware to handle file upload
export const handleFileUpload = upload.single('image');