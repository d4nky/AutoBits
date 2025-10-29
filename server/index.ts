import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./db";
import { initializeGridFS } from "./utils/fileUpload";
import { handleDemo } from "./routes/demo";
import filesRouter from "./routes/files";
import { rateLimit, errorHandler } from "./middleware/common";
import { handleSignup, handleLogin, handleGetCurrentUser } from "./routes/auth";
import { authMiddleware, requireUserType } from "./middleware/auth";
import {
  handleListUsers,
  handleGetUserDetails,
  handleUpdateVerification,
  handleUpdateActiveStatus,
  handleDeleteUser,
} from "./routes/admin";
import {
  handleGetAllListings,
  handleCreateListing,
  handleGetBusinessListings,
  handleDeleteListing,
} from "./routes/listings_new";
import {
  handleListJobs,
  handleGetJobDetail,
  handleCreateJob,
  handleUpdateJob,
  handleDeleteJob,
  handleSaveJob,
  handleUnsaveJob,
  handleGetSavedJobs,
} from "./routes/jobs";

export async function createServer() {
  const app = express();

  // Connect to MongoDB
  try {
    await connectDB();
    // Initialize GridFS for file storage
    await initializeGridFS();
  } catch (error) {
    console.error("Failed to connect to database:", error);
    process.exit(1);
  }

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Apply rate limiting to all routes
  app.use(rateLimit(100, 60 * 1000)); // 100 requests per minute

  // Health check
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  // Demo route
  app.get("/api/demo", handleDemo);

  // Public routes (no auth required)
  app.post("/api/auth/signup", handleSignup);
  app.post("/api/auth/login", handleLogin);
  app.get("/api/listings/all", handleGetAllListings);
  app.get("/api/jobs", handleListJobs);
  app.get("/api/jobs/:id", handleGetJobDetail);

  // Protected routes (any authenticated user)
  app.get("/api/auth/me", authMiddleware, handleGetCurrentUser);
  app.use('/api/files', authMiddleware, filesRouter);

  // Business-only routes
  app.post("/api/listings", authMiddleware, requireUserType(["business"]), handleCreateListing);
  app.get("/api/listings/business", authMiddleware, requireUserType(["business"]), handleGetBusinessListings);
  app.delete("/api/listings/:id", authMiddleware, requireUserType(["business"]), handleDeleteListing);
  app.post("/api/jobs", authMiddleware, requireUserType(["business"]), handleCreateJob);
  app.patch("/api/jobs/:id", authMiddleware, requireUserType(["business"]), handleUpdateJob);
  app.delete("/api/jobs/:id", authMiddleware, requireUserType(["business"]), handleDeleteJob);

  // User-only routes
  app.post("/api/jobs/save", authMiddleware, requireUserType(["user"]), handleSaveJob);
  app.delete("/api/jobs/:jobId/save", authMiddleware, requireUserType(["user"]), handleUnsaveJob);
  app.get("/api/favorites", authMiddleware, requireUserType(["user"]), handleGetSavedJobs);

  // Admin routes
  app.get("/api/admin/users", authMiddleware, requireUserType(["admin"]), handleListUsers);
  app.get("/api/admin/users/:userId", authMiddleware, requireUserType(["admin"]), handleGetUserDetails);
  app.patch("/api/admin/users/:userId/verify", authMiddleware, requireUserType(["admin"]), handleUpdateVerification);
  app.patch("/api/admin/users/:userId/status", authMiddleware, requireUserType(["admin"]), handleUpdateActiveStatus);
  app.delete("/api/admin/users/:userId", authMiddleware, requireUserType(["admin"]), handleDeleteUser);

  // Error handling should be the last middleware
  app.use(errorHandler);

  return app;
}
