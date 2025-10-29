import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
  {
    reviewerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    revieweeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: String,
    reviewType: {
      type: String,
      enum: ["business", "user"],
      required: true,
    },
  },
  { timestamps: true },
);

ReviewSchema.index({ revieweeId: 1 });
ReviewSchema.index({ jobId: 1 });

export const Review = mongoose.model("Review", ReviewSchema);
