import mongoose from "mongoose";

const FavoriteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    jobTitle: String,
    businessName: String,
    price: Number,
  },
  { timestamps: true },
);

FavoriteSchema.index({ userId: 1, jobId: 1 }, { unique: true });

export const Favorite = mongoose.model("Favorite", FavoriteSchema);
