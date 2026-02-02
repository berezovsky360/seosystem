import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import { connectDatabase } from "./db.js";
import siteRoutes from "./routes/sites.js";
import wpRoutes from "./routes/wordpress.js";
import aiRoutes from "./routes/ai.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
app.use(express.json({ limit: "2mb" }));
app.use(morgan("dev"));

app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/sites", siteRoutes);
app.use("/api/wp", wpRoutes);
app.use("/api/ai", aiRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || "Server error" });
});

await connectDatabase();

app.listen(port, () => {
  console.log(`SEO system backend listening on port ${port}`);
});
