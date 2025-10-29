import { Router } from 'express';
import { Request, Response, NextFunction } from 'express';
import { requireUserType } from '../middleware/auth';
import { getFileById, handleFileUpload, uploadToGridFS } from '../utils/fileUpload';

// Extend Request type to include fileCategory
declare module 'express' {
  interface Request {
    fileCategory?: 'avatar' | 'portfolio' | 'listing' | 'message';
  }
}

const router = Router();

// Public file downloads
router.get('/:id', getFileById);

// Protected uploads for different purposes
const setFileCategory = (category: 'avatar' | 'portfolio' | 'listing' | 'message') => 
  (req: Request, _res: Response, next: NextFunction) => {
    req.fileCategory = category;
    next();
  };

router.post('/avatar', 
  requireUserType(['user', 'business']), 
  setFileCategory('avatar'),
  handleFileUpload
);

router.post('/portfolio', 
  requireUserType(['business']), 
  setFileCategory('portfolio'),
  handleFileUpload
);

router.post('/listing', 
  requireUserType(['business']), 
  setFileCategory('listing'),
  handleFileUpload
);

// Generic upload handler
router.post('/upload', handleFileUpload, async (req, res) => {
	console.log('Upload request received', { 
		contentType: req.get('Content-Type'),
		filePresent: !!req.file,
		fileName: req.file?.originalname,
		fileSize: req.file?.size
	});
	try {
		if (!req.file) {
			console.log('No file in request');
			return res.status(400).json({ error: 'No file uploaded' });
		}
		console.log('Attempting GridFS upload...');
		const fileId = await uploadToGridFS(req.file);
		console.log('File uploaded successfully', { fileId });
		res.json({ id: fileId, url: `/api/files/${fileId}` });
	} catch (error: any) {
		console.error('Upload failed:', error?.message || error);
		res.status(500).json({ error: 'Failed to upload file' });
	}
});

export default router;