import { Request, Response } from 'express';
import { UserType } from '../middleware/auth';

// Extend Express Request to include our custom user property
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        userType: UserType;
      };
    }
  }
}
import { z } from 'zod';
import { User } from '../models/User';
import { WorkHistory } from '../models/WorkHistory';
import { handleFileUpload, uploadToGridFS } from '../utils/fileUpload';

// Validation schemas
const profileUpdateSchema = z.object({
  fullName: z.string().min(2).optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  bio: z.string().optional(),
  skills: z.array(z.string()).optional(),
  languages: z.array(z.object({
    language: z.string(),
    level: z.enum(["basic", "intermediate", "fluent", "native"]),
  })).optional(),
  // Business specific fields
  businessName: z.string().optional(),
  businessInfo: z.object({
    registrationNumber: z.string(),
    taxId: z.string(),
    website: z.string().url().optional(),
    foundedYear: z.number().optional(),
    employeeCount: z.enum(["1-10", "11-50", "51-200", "201-500", "500+"]),
    services: z.array(z.string()),
    certifications: z.array(z.string()),
  }).optional(),
  location: z.object({
    coordinates: z.tuple([z.number(), z.number()]),
    city: z.string(),
    address: z.string(),
    mapUrl: z.string().url(),
  }).optional(),
});

const settingsUpdateSchema = z.object({
  notifications: z.object({
    email: z.object({
      messages: z.boolean(),
      jobUpdates: z.boolean(),
      marketing: z.boolean(),
    }),
    push: z.object({
      messages: z.boolean(),
      jobUpdates: z.boolean(),
    }),
  }).optional(),
  privacy: z.object({
    showPhone: z.boolean(),
    showEmail: z.boolean(),
    profileVisibility: z.enum(["public", "private", "business-only"]),
  }).optional(),
  availability: z.object({
    status: z.enum(["available", "busy", "unavailable"]),
    workHours: z.array(z.object({
      day: z.enum(["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]),
      start: z.string(),
      end: z.string(),
    })),
  }).optional(),
});

const workHistorySchema = z.object({
  title: z.string(),
  company: z.string(),
  startDate: z.string(), // Will be parsed to Date
  endDate: z.string().optional(),
  isCurrent: z.boolean(),
  description: z.string().optional(),
  skills: z.array(z.string()).optional(),
  referenceContact: z.object({
    name: z.string(),
    email: z.string().email(),
    phone: z.string(),
  }).optional(),
});

// Profile handlers
export const handleGetProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId || req.user?.userId;
    const user = await User.findById(userId)
      .select('-passwordHash -settings.notifications.email.marketing')
      .lean();

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // If requesting other user's profile, check privacy settings
    if (req.params.userId && req.params.userId !== req.user?.userId) {
      if (user.settings?.privacy?.profileVisibility === 'private') {
        return res.status(403).json({ error: 'Profile is private' });
      }
      if (user.settings?.privacy?.profileVisibility === 'business-only' && 
          req.user?.userType !== 'business') {
        return res.status(403).json({ error: 'Profile visible to businesses only' });
      }

      // Hide private information based on settings
      if (!user.settings?.privacy?.showPhone) delete user.phone;
      if (!user.settings?.privacy?.showEmail) delete user.email;
    }

    // Get work history if applicable
    if (user.userType === 'user') {
      const workHistory = await WorkHistory.find({ user: userId })
        .sort({ isCurrent: -1, endDate: -1, startDate: -1 });
      return res.json({ ...user, workHistory });
    }

    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};

export const handleUpdateProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const data = profileUpdateSchema.parse(req.body);
    
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Validate business-specific fields
    if (data.businessName || data.businessInfo) {
      if (user.userType !== 'business') {
        return res.status(400).json({ error: 'Only business accounts can update business information' });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: data },
      { new: true }
    ).select('-passwordHash');

    res.json(updatedUser);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

export const handleUpdateSettings = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const data = settingsUpdateSchema.parse(req.body);
    
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { settings: data } },
      { new: true }
    ).select('settings');

    res.json(updatedUser?.settings);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    console.error('Update settings error:', error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
};

// Work history handlers
export const handleAddWorkHistory = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const user = await User.findById(userId);
    if (!user || user.userType !== 'user') {
      return res.status(400).json({ error: 'Only user accounts can add work history' });
    }

    const data = workHistorySchema.parse(req.body);
    
    const workHistory = new WorkHistory({
      ...data,
      user: userId,
      startDate: new Date(data.startDate),
      endDate: data.endDate ? new Date(data.endDate) : undefined,
    });

    await workHistory.save();
    res.status(201).json(workHistory);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    console.error('Add work history error:', error);
    res.status(500).json({ error: 'Failed to add work history' });
  }
};

// Profile picture upload handler
export const handleUploadProfilePicture = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    // Handle file upload (multer middleware)
    handleFileUpload(req, res, async (err: any) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }

      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      try {
        // Upload to GridFS
        const fileId = await uploadToGridFS(req.file);

        // Update user's avatar
        const user = await User.findByIdAndUpdate(
          userId,
          { $set: { avatar: fileId } },
          { new: true }
        ).select('avatar');

        res.json({
          fileId,
          url: `/api/files/${fileId}`,
          avatar: user?.avatar
        });
      } catch (error) {
        console.error('Profile picture upload error:', error);
        res.status(500).json({ error: 'Failed to upload profile picture' });
      }
    });
  } catch (error) {
    console.error('Profile picture upload error:', error);
    res.status(500).json({ error: 'Failed to handle file upload' });
  }
};