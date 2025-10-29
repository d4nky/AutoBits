import mongoose from "mongoose";

let isConnected = false;

export async function connectDB() {
  if (isConnected) {
    return;
  }

  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error("MONGODB_URI environment variable is not set");
  }

  try {
    await mongoose.connect(mongoUri);
    isConnected = true;
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    // In development, attempt to fall back to local MongoDB if the provided URI fails
    if (process.env.NODE_ENV === "development") {
      const localUri = "mongodb://localhost:27017/autobits";
      try {
        console.warn(`Falling back to local MongoDB at ${localUri}`);
        await mongoose.connect(localUri);
        isConnected = true;
        console.log("Connected to local MongoDB");
        return;
      } catch (localError) {
        console.warn("Failed to connect to local MongoDB as well:", localError);
        console.warn("Running in development mode without database");
        return;
      }
    }
    throw error;
  }
}

export async function disconnectDB() {
  if (!isConnected) {
    return;
  }

  try {
    await mongoose.disconnect();
    isConnected = false;
    console.log("Disconnected from MongoDB");
  } catch (error) {
    console.error("Failed to disconnect from MongoDB:", error);
    throw error;
  }
}
