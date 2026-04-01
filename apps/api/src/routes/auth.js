import { Router } from "express";
import jwt from "jsonwebtoken";

const router = Router();

router.post("/login", (req, res) => {
  const { username, password } = req.body || {};
  const adminUsername = process.env.ADMIN_USERNAME || "admin";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

  if (username !== adminUsername || password !== adminPassword) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { sub: username, role: "admin" },
    process.env.JWT_SECRET || "change_me",
    { expiresIn: "12h" }
  );

  return res.json({ token });
});

export default router;
