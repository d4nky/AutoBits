/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

// Auth Types
export interface SignupRequest {
  email: string;
  password: string;
  fullName: string;
  phone: string;
  address: string;
  userType: "user" | "business";
  businessName?: string;
  latitude?: number;
  longitude?: number;
  city?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: UserProfile;
}

export interface UserProfile {
  _id: string;
  email: string;
  fullName: string;
  userType: "user" | "business";
  phone: string;
  address: string;
  businessName?: string;
  location?: Location;
  avatar?: string;
  bio?: string;
  rating: number;
  reviewCount: number;
  isVerified: boolean;
}

export interface Location {
  latitude: number;
  longitude: number;
  city: string;
  address: string;
}

// Job Types
export interface JobPost {
  _id: string;
  businessId: string;
  businessName: string;
  businessPhone: string;
  businessEmail: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  price: number;
  currency: string;
  location: Location;
  jobType: "one-time" | "recurring" | "hourly";
  duration: string;
  status: "open" | "closed" | "completed";
  views: number;
  applicants: number;
  savedBy: string[];
  createdAt: string;
  updatedAt: string;
  expiresAt?: string;
  isActive: boolean;
}

export interface CreateJobRequest {
  title: string;
  description: string;
  category: string;
  tags: string[];
  price: number;
  jobType: "one-time" | "recurring" | "hourly";
  duration: string;
  latitude: number;
  longitude: number;
  city: string;
  address: string;
}

export interface JobsListResponse {
  success: boolean;
  jobs: JobPost[];
  total: number;
  page: number;
  limit: number;
}

// Application Types
export interface JobApplication {
  _id: string;
  jobId: string;
  userId: string;
  businessId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  coverLetter?: string;
  portfolioUrl?: string;
  status: "applied" | "accepted" | "rejected" | "completed";
  rating?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ApplyRequest {
  jobId: string;
  coverLetter?: string;
  portfolioUrl?: string;
}

// Message Types
export interface ChatMessage {
  _id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  recipientId: string;
  recipientName: string;
  message: string;
  jobId?: string;
  attachments: string[];
  isRead: boolean;
  createdAt: string;
}

export interface Conversation {
  _id: string;
  conversationId: string;
  userId: string;
  businessId: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  participants: string[];
  createdAt: string;
  updatedAt: string;
}

// Favorite/Saved Jobs
export interface SavedJob {
  _id: string;
  userId: string;
  jobId: string;
  jobTitle: string;
  businessName: string;
  price: number;
  savedAt: string;
}

// Review Types
export interface JobReview {
  _id: string;
  reviewerId: string;
  revieweeId: string;
  jobId?: string;
  rating: number;
  comment?: string;
  reviewType: "business" | "user";
  createdAt: string;
  updatedAt: string;
}

// Analytics Types
export interface DashboardStats {
  totalViews: number;
  totalApplications: number;
  totalMessages: number;
  totalEarnings: number;
  averageRating: number;
  activeJobs: number;
  completedJobs: number;
}

export interface DemoResponse {
  message: string;
}
