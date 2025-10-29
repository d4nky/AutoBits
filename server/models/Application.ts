import mongoose from "mongoose";

const ApplicationSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userName: String,
    userEmail: String,
    userPhone: String,
    coverLetter: String,
    portfolioUrl: String,
    status: {
      type: String,
      enum: ["applied", "accepted", "rejected", "completed"],
      default: "applied",
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
  },
  { timestamps: true },
);

export const Application = mongoose.model("Application", ApplicationSchema);
