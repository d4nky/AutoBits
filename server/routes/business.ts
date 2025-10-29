import { RequestHandler } from "express";
import { z } from "zod";
import bcryptjs from "bcryptjs";
import { User } from "../models/User";
import { authMiddleware, requireUserType } from "../middleware/auth";
import { AuthResponse, UserProfile } from "@shared/api";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

const businessVerificationSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string(),
  address: z.string(),
  businessName: z.string(),
  registrationNumber: z.string(),
  taxId: z.string(),
  website: z.string().url().optional(),
  foundedYear: z.number().min(1900).max(new Date().getFullYear()),
  employeeCount: z.enum(["1-10", "11-50", "51-200", "201-500", "500+"]),
  services: z.array(z.string()),
  certifications: z.array(z.string()).optional(),
  latitude: z.number(),
  longitude: z.number(),
  city: z.string(),
});

export const handleBusinessVerification: RequestHandler = async (req, res) => {
  try {
    const data = businessVerificationSchema.parse(req.body);

    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      res.status(400).json({ error: "Email already exists" });
      return;
    }

    const passwordHash = await bcryptjs.hash(data.password, 10);

    const user = new User({
      email: data.email,
      passwordHash,
      fullName: data.fullName,
      phone: data.phone,
      address: data.address,
      userType: "business",
      businessName: data.businessName,
      businessInfo: {
        registrationNumber: data.registrationNumber,
        taxId: data.taxId,
        website: data.website,
        foundedYear: data.foundedYear,
        employeeCount: data.employeeCount,
        services: data.services,
        certifications: data.certifications || [],
      },
      location: {
        type: "Point",
        coordinates: [data.longitude, data.latitude],
        city: data.city,
        address: data.address,
      },
      // Set to false initially - requires admin approval
      isVerified: false,
    });

    await user.save();

    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        userType: user.userType,
      },
      JWT_SECRET,
      { expiresIn: "7d" },
    );

    const userProfile: UserProfile = {
      _id: user._id.toString(),
      email: user.email,
      fullName: user.fullName,
      userType: user.userType,
      phone: user.phone,
      address: user.address,
      businessName: user.businessName,
      location: user.location,
      rating: user.rating,
      reviewCount: user.reviewCount,
      isVerified: user.isVerified,
    };

    const response: AuthResponse = {
      success: true,
      message: "Business account created. Pending verification.",
      token,
      user: userProfile,
    };

    res.status(201).json(response);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors[0].message });
    } else {
      console.error(error);
      res.status(500).json({ error: "Business verification failed" });
    }
  }
};

// Admin-only route to approve business accounts
export const handleApproveBusinessAccount: RequestHandler = async (req, res) => {
  try {
    const { businessId } = req.params;
    
    const business = await User.findById(businessId);
    if (!business || business.userType !== "business") {
      return res.status(404).json({ error: "Business not found" });
    }

    business.isVerified = true;
    await business.save();

    res.json({
      success: true,
      message: "Business account approved",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to approve business account" });
  }
};