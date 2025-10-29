# Job Marketplace - MongoDB Database Schema

This document describes the MongoDB database structure for the temporary job marketplace platform.

## Setup Instructions

1. **Create MongoDB Database**: Use MongoDB Atlas (cloud) or local MongoDB instance
2. **Set Environment Variable**: Add `MONGODB_URI` to `.env` file
3. **Collections**: Collections will be automatically created by Mongoose when the app starts

## MongoDB Collections

### 1. Users Collection

Stores user and business account information.

```json
{
  "_id": ObjectId,
  "email": "user@example.com",
  "passwordHash": "hashed_password",
  "fullName": "John Doe",
  "userType": "user|business",
  "phone": "213XXXXXXXXX",
  "address": "123 Main St, Algiers",
  "businessName": "Business Name (only for businesses)",
  "location": {
    "latitude": 36.7372,
    "longitude": 3.0868,
    "city": "Algiers",
    "address": "123 Main St"
  },
  "avatar": "url_to_avatar",
  "bio": "User bio/business description",
  "rating": 4.5,
  "reviews": 12,
  "createdAt": ISODate,
  "updatedAt": ISODate,
  "isVerified": true,
  "isActive": true
}
```

### 2. Jobs Collection

Stores job postings/advertisements.

```json
{
  "_id": ObjectId,
  "businessId": ObjectId,
  "businessName": "Business Name",
  "businessPhone": "213XXXXXXXXX",
  "businessEmail": "business@example.com",
  "title": "Website Redesign Project",
  "description": "We need a modern website redesign...",
  "category": "web-design|writing|data-entry|etc",
  "tags": ["urgent", "flexible-hours", "remote"],
  "price": 50000,
  "currency": "DZD",
  "location": {
    "latitude": 36.7372,
    "longitude": 3.0868,
    "city": "Algiers",
    "address": "123 Main St"
  },
  "jobType": "one-time|recurring|hourly",
  "duration": "2 weeks",
  "status": "open|closed|completed",
  "views": 245,
  "applicants": 12,
  "savedBy": [ObjectId, ObjectId],
  "createdAt": ISODate,
  "updatedAt": ISODate,
  "expiresAt": ISODate,
  "isActive": true
}
```

### 3. Applications Collection

Stores job applications from users.

```json
{
  "_id": ObjectId,
  "jobId": ObjectId,
  "userId": ObjectId,
  "businessId": ObjectId,
  "userName": "John Doe",
  "userEmail": "john@example.com",
  "userPhone": "213XXXXXXXXX",
  "coverLetter": "I'm interested in this position...",
  "portfolioUrl": "https://portfolio.com",
  "status": "applied|accepted|rejected|completed",
  "rating": 4.8,
  "createdAt": ISODate,
  "updatedAt": ISODate
}
```

### 4. Messages Collection

Stores direct messages between users and businesses.

```json
{
  "_id": ObjectId,
  "conversationId": "userId-businessId",
  "senderId": ObjectId,
  "senderName": "John Doe",
  "recipientId": ObjectId,
  "recipientName": "Business Name",
  "message": "I'm interested in your job posting",
  "jobId": ObjectId,
  "attachments": ["url1", "url2"],
  "isRead": false,
  "createdAt": ISODate,
  "updatedAt": ISODate
}
```

### 5. Conversations Collection

Stores conversation metadata for real-time messaging.

```json
{
  "_id": ObjectId,
  "conversationId": "userId-businessId",
  "userId": ObjectId,
  "businessId": ObjectId,
  "lastMessage": "I'm interested in your job posting",
  "lastMessageTime": ISODate,
  "unreadCount": 3,
  "participants": [ObjectId, ObjectId],
  "createdAt": ISODate,
  "updatedAt": ISODate
}
```

### 6. Favorites Collection

Stores saved/favorited jobs by users.

```json
{
  "_id": ObjectId,
  "userId": ObjectId,
  "jobId": ObjectId,
  "jobTitle": "Website Redesign",
  "businessName": "Company Name",
  "price": 50000,
  "savedAt": ISODate
}
```

### 7. Reviews Collection

Stores reviews and ratings for businesses and users.

```json
{
  "_id": ObjectId,
  "reviewerId": ObjectId,
  "revieweeId": ObjectId,
  "jobId": ObjectId,
  "rating": 4.5,
  "comment": "Great work! Very satisfied with the result.",
  "reviewType": "business|user",
  "createdAt": ISODate,
  "updatedAt": ISODate
}
```

### 8. Analytics Collection

Stores analytics data for dashboards.

```json
{
  "_id": ObjectId,
  "businessId": ObjectId,
  "jobId": ObjectId,
  "date": ISODate,
  "views": 50,
  "clicks": 15,
  "applicants": 3,
  "messages": 2
}
```

## Indexes

```javascript
// Users
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ "location.city": 1 });
db.users.createIndex({ userType: 1 });

// Jobs
db.jobs.createIndex({ businessId: 1 });
db.jobs.createIndex({ "location.city": 1 });
db.jobs.createIndex({ category: 1 });
db.jobs.createIndex({ status: 1 });
db.jobs.createIndex({ createdAt: -1 });
db.jobs.createIndex({ price: 1 });
db.jobs.createIndex({ isActive: 1 });

// Applications
db.applications.createIndex({ jobId: 1 });
db.applications.createIndex({ userId: 1 });
db.applications.createIndex({ businessId: 1 });
db.applications.createIndex({ status: 1 });

// Messages
db.messages.createIndex({ conversationId: 1 });
db.messages.createIndex({ senderId: 1 });
db.messages.createIndex({ recipientId: 1 });
db.messages.createIndex({ createdAt: -1 });

// Conversations
db.conversations.createIndex({ conversationId: 1 }, { unique: true });
db.conversations.createIndex({ userId: 1 });
db.conversations.createIndex({ businessId: 1 });

// Favorites
db.favorites.createIndex({ userId: 1 });
db.favorites.createIndex({ jobId: 1 });
db.favorites.createIndex({ userId: 1, jobId: 1 }, { unique: true });

// Reviews
db.reviews.createIndex({ revieweeId: 1 });
db.reviews.createIndex({ jobId: 1 });
db.reviews.createIndex({ reviewerId: 1, revieweeId: 1 });
```

## Environment Variables

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/jobmarketplace
JWT_SECRET=your_jwt_secret_key_here
PORT=5000
NODE_ENV=development
```

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Register new user or business
- `POST /api/auth/login` - Login and get JWT token
- `POST /api/auth/logout` - Logout (client-side token deletion)
- `GET /api/auth/me` - Get current user (requires auth)

### Jobs

- `GET /api/jobs` - List jobs with filters (location, price, category, search)
- `GET /api/jobs/:id` - Get job details
- `POST /api/jobs` - Create job (business only)
- `PATCH /api/jobs/:id` - Update job (business owner only)
- `DELETE /api/jobs/:id` - Delete job (business owner only)

### Applications

- `POST /api/applications` - Apply for job
- `GET /api/applications/job/:jobId` - Get job applications (business owner only)
- `GET /api/applications/user` - Get user applications
- `PATCH /api/applications/:id/status` - Update application status

### Messages

- `GET /api/messages/:conversationId` - Get messages in conversation
- `POST /api/messages` - Send message (WebSocket)
- `GET /api/conversations` - Get user conversations
- `GET /api/conversations/:conversationId` - Get conversation details

### Favorites

- `POST /api/favorites` - Save job
- `DELETE /api/favorites/:jobId` - Remove saved job
- `GET /api/favorites` - Get user saved jobs

### User Profile

- `GET /api/users/:id` - Get user profile
- `PATCH /api/users/:id` - Update user profile
- `GET /api/users/:id/reviews` - Get user reviews

### Reviews

- `POST /api/reviews` - Create review
- `PATCH /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review
- `GET /api/reviews/user/:userId` - Get reviews for user

## Notes

- All timestamps are in ISO 8601 format
- Location uses latitude/longitude for Google Maps integration
- User authentication uses JWT tokens
- Real-time messaging uses Socket.io
- All sensitive data (passwords) is hashed with bcrypt
