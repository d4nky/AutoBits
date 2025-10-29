import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./db";
import { handleDemo } from "./routes/demo";
import { handleSignup, handleLogin, handleGetCurrentUser } from "./routes/auth";
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
  } catch (error) {
    console.error("Failed to connect to database:", error);
    process.exit(1);
  }

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health check
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  // Demo route
  app.get("/api/demo", handleDemo);

  // Auth routes
  app.post("/api/auth/signup", handleSignup);
  app.post("/api/auth/login", handleLogin);
  app.get("/api/auth/me", handleGetCurrentUser);

  // Job routes
  app.get("/api/jobs", handleListJobs);
  app.get("/api/jobs/:id", handleGetJobDetail);
  app.post("/api/jobs", handleCreateJob);
  app.patch("/api/jobs/:id", handleUpdateJob);
  app.delete("/api/jobs/:id", handleDeleteJob);

  // Favorites routes
  app.post("/api/jobs/save", handleSaveJob);
  app.delete("/api/jobs/:jobId/save", handleUnsaveJob);
  app.get("/api/favorites", handleGetSavedJobs);

  return app;
}
