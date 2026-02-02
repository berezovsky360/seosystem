import mongoose from "mongoose";

const SiteSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    url: { type: String, required: true },
    username: { type: String, required: true },
    appPasswordEncrypted: { type: String, required: true },
    status: {
      type: String,
      enum: ["unknown", "online", "offline", "unauthorized"],
      default: "unknown",
    },
    lastCheckedAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model("Site", SiteSchema);
