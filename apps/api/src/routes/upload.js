import { Router } from "express";
import multer from "multer";
import path from "node:path";
import sharp from "sharp";
import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.post("/", requireAuth, upload.single("image"), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });

  const fileName = `${Date.now()}-${req.file.originalname.replace(/\s+/g, "-")}.webp`;
  const outputDir = path.resolve(__dirname, "../../uploads");
  const outputPath = path.join(outputDir, fileName);
  await fs.mkdir(outputDir, { recursive: true });

  // Optimization hook: admin UI captures crop/zoom; server stores compressed WebP.
  await sharp(req.file.buffer).resize({ width: 1920, withoutEnlargement: true }).webp({ quality: 82 }).toFile(outputPath);

  res.status(201).json({ imageUrl: `/uploads/${fileName}` });
});

export default router;
