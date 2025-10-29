import { RequestHandler } from "express";
import { User } from "../models/User";
import { authMiddleware, requireUserType } from "../middleware/auth";

// List all users with pagination and filtering
export const handleListUsers: RequestHandler = async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const userType = req.query.userType as "user" | "business" | undefined;
    const verificationStatus = req.query.verificationStatus as "pending" | "verified" | undefined;

    const query: any = {};
    if (userType) query.userType = userType;
    if (verificationStatus === "pending") query.isVerified = false;
    if (verificationStatus === "verified") query.isVerified = true;
    
    const users = await User.find(query)
      .select("-passwordHash")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      users,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to list users" });
  }
};

// Get detailed user information
export const handleGetUserDetails: RequestHandler = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId)
      .select("-passwordHash")
      .lean();
      
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to get user details" });
  }
};

// Update user verification status
export const handleUpdateVerification: RequestHandler = async (req, res) => {
  try {
    const { userId } = req.params;
    const { isVerified } = req.body;

    if (typeof isVerified !== "boolean") {
      return res.status(400).json({ error: "Invalid verification status" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.isVerified = isVerified;
    await user.save();

    res.json({
      success: true,
      message: `User ${isVerified ? "verified" : "unverified"} successfully`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update verification status" });
  }
};

// Update user active status (suspend/activate account)
export const handleUpdateActiveStatus: RequestHandler = async (req, res) => {
  try {
    const { userId } = req.params;
    const { isActive } = req.body;

    if (typeof isActive !== "boolean") {
      return res.status(400).json({ error: "Invalid active status" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.isActive = isActive;
    await user.save();

    res.json({
      success: true,
      message: `User ${isActive ? "activated" : "suspended"} successfully`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update active status" });
  }
};

// Delete user account (admin only)
export const handleDeleteUser: RequestHandler = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Instead of actually deleting, we'll mark as inactive and anonymize
    user.isActive = false;
    user.email = `deleted_${user._id}@deleted.com`;
    user.fullName = "Deleted User";
    user.phone = "";
    user.address = "";
    await user.save();

    res.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete user" });
  }
};