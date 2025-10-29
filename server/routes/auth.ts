import { RequestHandler } from "express";
import { z } from "zod";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import { User } from "../models/User";
import {
  SignupRequest,
  LoginRequest,
  AuthResponse,
  UserProfile,
} from "@shared/api";

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";

const signupSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string(),
  address: z.string(),
  userType: z.enum(["user", "business"]),
  businessName: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  city: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

export const handleSignup: RequestHandler = async (req, res) => {
  try {
    const data = signupSchema.parse(req.body);

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
      userType: data.userType,
      businessName: data.businessName,
      location: {
        latitude: data.latitude,
        longitude: data.longitude,
        city: data.city,
        address: data.address,
      },
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
      message: "Account created successfully",
      token,
      user: userProfile,
    };

    res.status(201).json(response);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors[0].message });
    } else {
      console.error(error);
      res.status(500).json({ error: "Signup failed" });
    }
  }
};

export const handleLogin: RequestHandler = async (req, res) => {
  try {
    const data = loginSchema.parse(req.body);

    const user = await User.findOne({ email: data.email });
    if (!user) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const isPasswordValid = await bcryptjs.compare(
      data.password,
      user.passwordHash,
    );
    if (!isPasswordValid) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

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
      message: "Login successful",
      token,
      user: userProfile,
    };

    res.json(response);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors[0].message });
    } else {
      console.error(error);
      res.status(500).json({ error: "Login failed" });
    }
  }
};

export const handleGetCurrentUser: RequestHandler = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res
        .status(401)
        .json({ error: "Missing or invalid authorization header" });
      return;
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string;
      email: string;
      userType: string;
    };

    const user = await User.findById(decoded.userId);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

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

    res.json({
      success: true,
      user: userProfile,
    });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ error: "Invalid or expired token" });
    } else {
      console.error(error);
      res.status(500).json({ error: "Failed to get current user" });
    }
  }
};
