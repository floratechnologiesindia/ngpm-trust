#!/usr/bin/env node
/**
 * Regenerates navbar logo assets from apps/web/public/images/logo.png
 * Run: node scripts/optimize-logo.mjs
 */
import sharp from "sharp";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const input = path.join(root, "apps/web/public/images/logo.png");
const outWebp = path.join(root, "apps/web/public/images/logo.webp");
const outPng = path.join(root, "apps/web/public/images/logo-optimized.png");

await sharp(input)
  .resize(192, 192, { fit: "inside", withoutEnlargement: false })
  .webp({ quality: 82, effort: 6 })
  .toFile(outWebp);

await sharp(input)
  .resize(192, 192, { fit: "inside" })
  .png({ compressionLevel: 9, palette: true })
  .toFile(outPng);

console.log("Wrote", outWebp, outPng);
