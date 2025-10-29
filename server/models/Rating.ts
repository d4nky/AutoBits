import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  ratedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: String,
  type: {
    type: String,
    enum: ["job", "service", "general"],
    required: true,
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Listing",
  },
}, { timestamps: true });

// Prevent duplicate ratings from same user
ratingSchema.index({ user: 1, ratedBy: 1, jobId: 1 }, { unique: true });

// Update user's average rating when a new rating is added
ratingSchema.post("save", async function() {
  const User = mongoose.model("User");
  const ratings = await this.model("Rating")
    .find({ user: this.user })
    .select("rating");
  
  const average = ratings.reduce((acc, curr) => acc + curr.rating, 0) / ratings.length;
  
  await User.findByIdAndUpdate(this.user, {
    rating: Number(average.toFixed(1)),
    reviewCount: ratings.length,
  });
});

export const Rating = mongoose.model("Rating", ratingSchema);