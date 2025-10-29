import mongoose, { Document, Model } from "mongoose";

// Define the interface for the User document
export interface IUser extends Document {
  email: string;
  passwordHash: string;
  fullName: string;
  userType: "user" | "business" | "admin";
  phone: string;
  address: string;
  location?: {
    city?: string;
    address?: string;
    mapUrl?: string;
  };
  avatar?: string;
  coverPhoto?: string;
  bio?: string;
  skills: string[];
  languages: Array<{
    language: string;
    level: "basic" | "intermediate" | "fluent" | "native";
  }>;
  businessName?: string;
  businessInfo?: {
    registrationNumber?: string;
    taxId?: string;
    website?: string;
    foundedYear?: number;
    employeeCount?: "1-10" | "11-50" | "51-200" | "201-500" | "500+";
    services?: string[];
    certifications?: string[];
  };
  portfolio?: Array<{
    title: string;
    description: string;
    images: string[];
    date: Date;
    category: string;
  }>;
  rating: number;
  reviewCount: number;
  completedJobs: number;
  isVerified: boolean;
  settings: {
    notifications: {
      email: {
        messages: boolean;
        jobUpdates: boolean;
        marketing: boolean;
      };
      push: {
        messages: boolean;
        jobUpdates: boolean;
      };
    };
    privacy: {
      showPhone: boolean;
      showEmail: boolean;
      profileVisibility: "public" | "private" | "business-only";
    };
    availability: {
      status: "available" | "busy" | "unavailable";
      workHours: Array<{
        day: "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";
        start: string;
        end: string;
      }>;
    };
  };
  isActive: boolean;
}

const UserSchema = new mongoose.Schema<IUser>(
  {
    // Basic Info
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    userType: {
      type: String,
      enum: ["user", "business", "admin"],
      required: true,
      default: "user"
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },


    // Profile
    avatar: {
      type: String, // GridFS file ID
    },
    coverPhoto: {
      type: String, // GridFS file ID
    },
    bio: String,
    skills: [String],
    languages: [{
      language: String,
      level: {
        type: String,
        enum: ["basic", "intermediate", "fluent", "native"],
      }
    }],

    // Business Specific
    businessName: {
      type: String,
      required: function () {
        return this.userType === "business";
      },
    },
    businessInfo: {
      type: {
        registrationNumber: String,
        taxId: String,
        website: String,
        foundedYear: Number,
        employeeCount: {
          type: String,
          enum: ["1-10", "11-50", "51-200", "201-500", "500+"],
        },
        services: [String],
        certifications: [String],
      },
      required: function () {
        return this.userType === "business";
      },
    },
    portfolio: [{
      title: String,
      description: String,
      images: [String], // GridFS file IDs
      date: Date,
      category: String,
    }],

    // Ratings & Verification
    rating: {
      type: Number,
      default: 0,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    completedJobs: {
      type: Number,
      default: 0,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },

    // Settings & Preferences
    settings: {
      notifications: {
        email: {
          messages: { type: Boolean, default: true },
          jobUpdates: { type: Boolean, default: true },
          marketing: { type: Boolean, default: false },
        },
        push: {
          messages: { type: Boolean, default: true },
          jobUpdates: { type: Boolean, default: true },
        },
      },
      privacy: {
        showPhone: { type: Boolean, default: false },
        showEmail: { type: Boolean, default: false },
        profileVisibility: {
          type: String,
          enum: ["public", "private", "business-only"],
          default: "public",
        },
      },
      availability: {
        status: {
          type: String,
          enum: ["available", "busy", "unavailable"],
          default: "available",
        },
        workHours: [{
          day: {
            type: String,
            enum: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"],
          },
          start: String, // HH:mm format
          end: String,   // HH:mm format
        }],
      },
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

// Check if the model is already registered to prevent recompilation errors
export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
