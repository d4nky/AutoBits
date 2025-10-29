import { RequestHandler } from "express";
import { z } from "zod";
import jwt from "jsonwebtoken";
import { Job } from "../models/Job";
import { User } from "../models/User";
import { Favorite } from "../models/Favorite";
import { CreateJobRequest, JobsListResponse } from "@shared/api";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

const createJobSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  category: z.string(),
  tags: z.array(z.string()).default([]),
  price: z.number().min(0, "Price must be positive"),
  jobType: z.enum(["one-time", "recurring", "hourly"]),
  duration: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  city: z.string(),
  address: z.string(),
});

const getAuthUser = (req: any) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.substring(7);
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string;
      email: string;
      userType: string;
    };
    return decoded;
  } catch {
    return null;
  }
};

export const handleListJobs: RequestHandler = async (req, res) => {
  try {
    const {
      search,
      category,
      city,
      minPrice,
      maxPrice,
      page = 1,
      limit = 20,
    } = req.query;

    const filter: any = {
      isActive: true,
      status: "open",
    };

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (category) {
      filter.category = category;
    }

    if (city) {
      filter["location.city"] = city;
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) {
        filter.price.$gte = parseFloat(minPrice as string);
      }
      if (maxPrice) {
        filter.price.$lte = parseFloat(maxPrice as string);
      }
    }

    const pageNum = parseInt(page as string) || 1;
    const limitNum = Math.min(parseInt(limit as string) || 20, 100);
    const skip = (pageNum - 1) * limitNum;

    const jobs = await Job.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .select("-savedBy");

    const total = await Job.countDocuments(filter);

    const response: JobsListResponse = {
      success: true,
      jobs: jobs.map((job) => ({
        _id: job._id.toString(),
        businessId: job.businessId.toString(),
        businessName: job.businessName,
        businessPhone: job.businessPhone,
        businessEmail: job.businessEmail,
        title: job.title,
        description: job.description,
        category: job.category,
        tags: job.tags,
        price: job.price,
        currency: job.currency,
        location: job.location,
        jobType: job.jobType,
        duration: job.duration,
        status: job.status,
        views: job.views,
        applicants: job.applicants,
        savedBy: [],
        createdAt: job.createdAt?.toISOString() || "",
        updatedAt: job.updatedAt?.toISOString() || "",
        expiresAt: job.expiresAt?.toISOString(),
        isActive: job.isActive,
      })),
      total,
      page: pageNum,
      limit: limitNum,
    };

    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
};

export const handleGetJobDetail: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const authUser = getAuthUser(req);

    const job = await Job.findById(id);
    if (!job) {
      res.status(404).json({ error: "Job not found" });
      return;
    }

    job.views += 1;
    await job.save();

    const isSaved = authUser
      ? job.savedBy.some((id) => id.toString() === authUser.userId)
      : false;

    res.json({
      success: true,
      job: {
        _id: job._id.toString(),
        businessId: job.businessId.toString(),
        businessName: job.businessName,
        businessPhone: job.businessPhone,
        businessEmail: job.businessEmail,
        title: job.title,
        description: job.description,
        category: job.category,
        tags: job.tags,
        price: job.price,
        currency: job.currency,
        location: job.location,
        jobType: job.jobType,
        duration: job.duration,
        status: job.status,
        views: job.views,
        applicants: job.applicants,
        isSaved,
        createdAt: job.createdAt?.toISOString() || "",
        updatedAt: job.updatedAt?.toISOString() || "",
        expiresAt: job.expiresAt?.toISOString(),
        isActive: job.isActive,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch job details" });
  }
};

export const handleCreateJob: RequestHandler = async (req, res) => {
  try {
    const authUser = getAuthUser(req);
    if (!authUser) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const user = await User.findById(authUser.userId);
    if (!user || user.userType !== "business") {
      res.status(403).json({
        error: "Only business accounts can create jobs",
      });
      return;
    }

    const data = createJobSchema.parse(req.body);

    const job = new Job({
      businessId: authUser.userId,
      businessName: user.businessName || user.fullName,
      businessPhone: user.phone,
      businessEmail: user.email,
      title: data.title,
      description: data.description,
      category: data.category,
      tags: data.tags,
      price: data.price,
      jobType: data.jobType,
      duration: data.duration,
      location: {
        latitude: data.latitude,
        longitude: data.longitude,
        city: data.city,
        address: data.address,
      },
    });

    await job.save();

    res.status(201).json({
      success: true,
      message: "Job created successfully",
      job: {
        _id: job._id.toString(),
        businessId: job.businessId.toString(),
        businessName: job.businessName,
        businessPhone: job.businessPhone,
        businessEmail: job.businessEmail,
        title: job.title,
        description: job.description,
        category: job.category,
        tags: job.tags,
        price: job.price,
        currency: job.currency,
        location: job.location,
        jobType: job.jobType,
        duration: job.duration,
        status: job.status,
        views: job.views,
        applicants: job.applicants,
        savedBy: [],
        createdAt: job.createdAt?.toISOString() || "",
        updatedAt: job.updatedAt?.toISOString() || "",
        isActive: job.isActive,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors[0].message });
    } else {
      console.error(error);
      res.status(500).json({ error: "Failed to create job" });
    }
  }
};

export const handleUpdateJob: RequestHandler = async (req, res) => {
  try {
    const authUser = getAuthUser(req);
    if (!authUser) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { id } = req.params;
    const job = await Job.findById(id);

    if (!job) {
      res.status(404).json({ error: "Job not found" });
      return;
    }

    if (job.businessId.toString() !== authUser.userId) {
      res.status(403).json({ error: "Unauthorized to update this job" });
      return;
    }

    const data = createJobSchema.partial().parse(req.body);

    if (data.title) job.title = data.title;
    if (data.description) job.description = data.description;
    if (data.category) job.category = data.category;
    if (data.tags) job.tags = data.tags;
    if (data.price !== undefined) job.price = data.price;
    if (data.jobType) job.jobType = data.jobType;
    if (data.duration) job.duration = data.duration;

    if (
      data.latitude &&
      data.longitude &&
      data.city &&
      data.address
    ) {
      job.location = {
        latitude: data.latitude,
        longitude: data.longitude,
        city: data.city,
        address: data.address,
      };
    }

    await job.save();

    res.json({
      success: true,
      message: "Job updated successfully",
      job: {
        _id: job._id.toString(),
        businessId: job.businessId.toString(),
        businessName: job.businessName,
        businessPhone: job.businessPhone,
        businessEmail: job.businessEmail,
        title: job.title,
        description: job.description,
        category: job.category,
        tags: job.tags,
        price: job.price,
        currency: job.currency,
        location: job.location,
        jobType: job.jobType,
        duration: job.duration,
        status: job.status,
        views: job.views,
        applicants: job.applicants,
        savedBy: [],
        createdAt: job.createdAt?.toISOString() || "",
        updatedAt: job.updatedAt?.toISOString() || "",
        isActive: job.isActive,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors[0].message });
    } else {
      console.error(error);
      res.status(500).json({ error: "Failed to update job" });
    }
  }
};

export const handleDeleteJob: RequestHandler = async (req, res) => {
  try {
    const authUser = getAuthUser(req);
    if (!authUser) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { id } = req.params;
    const job = await Job.findById(id);

    if (!job) {
      res.status(404).json({ error: "Job not found" });
      return;
    }

    if (job.businessId.toString() !== authUser.userId) {
      res.status(403).json({ error: "Unauthorized to delete this job" });
      return;
    }

    await Job.deleteOne({ _id: id });

    res.json({
      success: true,
      message: "Job deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete job" });
  }
};

export const handleSaveJob: RequestHandler = async (req, res) => {
  try {
    const authUser = getAuthUser(req);
    if (!authUser) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { jobId } = req.body;

    const job = await Job.findById(jobId);
    if (!job) {
      res.status(404).json({ error: "Job not found" });
      return;
    }

    const existingFavorite = await Favorite.findOne({
      userId: authUser.userId,
      jobId,
    });

    if (existingFavorite) {
      res.status(400).json({ error: "Job already saved" });
      return;
    }

    const favorite = new Favorite({
      userId: authUser.userId,
      jobId,
      jobTitle: job.title,
      businessName: job.businessName,
      price: job.price,
    });

    await favorite.save();

    if (!job.savedBy.includes(authUser.userId as any)) {
      job.savedBy.push(authUser.userId as any);
      await job.save();
    }

    res.status(201).json({
      success: true,
      message: "Job saved successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to save job" });
  }
};

export const handleUnsaveJob: RequestHandler = async (req, res) => {
  try {
    const authUser = getAuthUser(req);
    if (!authUser) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { jobId } = req.params;

    await Favorite.deleteOne({
      userId: authUser.userId,
      jobId,
    });

    const job = await Job.findById(jobId);
    if (job) {
      job.savedBy = job.savedBy.filter(
        (id) => id.toString() !== authUser.userId
      );
      await job.save();
    }

    res.json({
      success: true,
      message: "Job unsaved successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to unsave job" });
  }
};

export const handleGetSavedJobs: RequestHandler = async (req, res) => {
  try {
    const authUser = getAuthUser(req);
    if (!authUser) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { page = 1, limit = 20 } = req.query;
    const pageNum = parseInt(page as string) || 1;
    const limitNum = Math.min(parseInt(limit as string) || 20, 100);
    const skip = (pageNum - 1) * limitNum;

    const favorites = await Favorite.find({ userId: authUser.userId })
      .skip(skip)
      .limit(limitNum)
      .sort({ createdAt: -1 });

    const total = await Favorite.countDocuments({ userId: authUser.userId });

    res.json({
      success: true,
      jobs: favorites,
      total,
      page: pageNum,
      limit: limitNum,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch saved jobs" });
  }
};
