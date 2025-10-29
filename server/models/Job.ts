import mongoose from "mongoose";

const JobSchema = new mongoose.Schema(
  {
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    businessName: {
      type: String,
      required: true,
    },
    businessPhone: {
      type: String,
      required: true,
    },
    businessEmail: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    tags: [String],
    price: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "DZD",
    },
    location: {
      latitude: Number,
      longitude: Number,
      city: String,
      address: String,
    },
    jobType: {
      type: String,
      enum: ["one-time", "recurring", "hourly"],
      required: true,
    },
    duration: String,
    status: {
      type: String,
      enum: ["open", "closed", "completed"],
      default: "open",
    },
    views: {
      type: Number,
      default: 0,
    },
    applicants: {
      type: Number,
      default: 0,
    },
    savedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    expiresAt: Date,
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const Job = mongoose.model("Job", JobSchema);
