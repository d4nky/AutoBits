import mongoose from "mongoose";

const listingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  currency: {
    type: String,
    default: "DZD",
    enum: ["DZD"],
  },
  location: {
    type: {
      address: String,
      // Google Maps link (copy/paste)
      mapUrl: String,
    },
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  business: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  businessName: {
    type: String,
    default: "Test Business" // For development/testing
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

listingSchema.pre("save", function(next) {
  this.updatedAt = new Date();
  next();
});

export const Listing = mongoose.model("Listing", listingSchema);