import mongoose from "mongoose";

export async function connectDatabase() {
  const mongoUrl = process.env.MONGODB_URI || "mongodb://localhost:27017/seo-system";

  mongoose.connection.on("connected", () => {
    console.log("MongoDB connected");
  });

  mongoose.connection.on("error", (err) => {
    console.error("MongoDB connection error", err);
  });

  await mongoose.connect(mongoUrl, {
    autoIndex: true,
    serverSelectionTimeoutMS: 5000,
  });
}
