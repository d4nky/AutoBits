import mongoose from "mongoose";

const workHistorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    // Not required if current position
  },
  isCurrent: {
    type: Boolean,
    default: false,
  },
  description: String,
  skills: [String],
  // For verification purposes
  referenceContact: {
    name: String,
    email: String,
    phone: String,
  },
}, { timestamps: true });

export const WorkHistory = mongoose.model("WorkHistory", workHistorySchema);