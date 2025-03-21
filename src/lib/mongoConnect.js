import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI; // Add this in your .env.local

if (!MONGO_URI) {
    throw new Error("MONGO_URI is missing from environment variables.");
}

export async function connectDB() {
    if (mongoose.connection.readyState >= 1) {
        return; // Already connected
    }

    try {
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("✅ MongoDB Connected");
    } catch (error) {
        console.error("❌ MongoDB Connection Error:", error);
        throw new Error("MongoDB connection failed.");
    }
}