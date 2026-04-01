import { Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { AdminUser } from "../models/AdminUser.js";

const router = Router();

router.post("/login", async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  const dbAdmin = await AdminUser.findOne({ username, active: true }).lean();

  // Backward-compatible fallback if DB seed not done yet.
  let isValid = false;
  if (dbAdmin?.passwordHash) {
    isValid = await bcrypt.compare(password, dbAdmin.passwordHash);
  } else {
    const adminUsername = process.env.ADMIN_USERNAME || "admin";
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
    isValid = username === adminUsername && password === adminPassword;
  }
  if (!isValid) return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign(
    { sub: username, role: "admin" },
    process.env.JWT_SECRET || "change_me",
    { expiresIn: "12h" }
  );

  return res.json({ token });
});

export default router;
