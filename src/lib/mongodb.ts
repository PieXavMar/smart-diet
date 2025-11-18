// lib/mongodb.ts
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

declare global {
  var mongoose: {
    conn: mongoose.Mongoose | null;
    promise: Promise<mongoose.Mongoose> | null;
  } | undefined;
}

let cached: { conn: mongoose.Mongoose | null; promise: Promise<mongoose.Mongoose> | null } =
  global.mongoose ?? { conn: null, promise: null };
global.mongoose = cached;

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI as string, {
        dbName: "smartdiet",
        bufferCommands: false,
      })
      .then((mongoose) => {
        console.log("✔ Connected to MongoDB");
        return mongoose;
      })
      .catch((err) => {
        console.error("❌ MongoDB connection error:", err);
        throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

