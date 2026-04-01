import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { connectDb } from "../db.js";
import { AdminUser } from "../models/AdminUser.js";

dotenv.config();

async function run() {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;
  const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/ngpm";

  if (!username || !password) {
    throw new Error("ADMIN_USERNAME and ADMIN_PASSWORD are required");
  }

  await connectDb(mongoUri);
  const passwordHash = await bcrypt.hash(password, 12);

  const result = await AdminUser.findOneAndUpdate(
    { username },
    { username, passwordHash, active: true },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  console.log(`Admin user ready: ${result.username}`);
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error("Failed to seed admin:", err.message);
  process.exit(1);
});
