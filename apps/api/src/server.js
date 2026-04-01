import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { connectDb } from "./db.js";
import authRoutes from "./routes/auth.js";
import uploadRoutes from "./routes/upload.js";
import galleryRoutes from "./routes/gallery.js";
import eventRoutes from "./routes/events.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = Number(process.env.PORT || 6661);
const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/ngpm";

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
  })
);
app.use(cors());
app.use(express.json({ limit: "5mb" }));
app.use("/uploads", express.static(path.resolve(__dirname, "../uploads")));

app.get("/api/health", (req, res) => res.json({ ok: true }));
app.use("/api/auth", authRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/upload", uploadRoutes);

connectDb(mongoUri)
  .then(() => {
    app.listen(port, () => {
      console.log(`API running on :${port}`);
    });
  })
  .catch((err) => {
    console.error("DB connection failed:", err.message);
    process.exit(1);
  });
