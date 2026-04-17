import { Router } from "express";
import { Magazine } from "../models/Magazine.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", async (req, res) => {
  const items = await Magazine.find().sort({ order: 1, createdAt: -1 }).lean();
  res.json(items);
});

router.post("/", requireAuth, async (req, res) => {
  const item = await Magazine.create(req.body);
  res.status(201).json(item);
});

router.put("/:id", requireAuth, async (req, res) => {
  const item = await Magazine.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!item) return res.status(404).json({ message: "Not found" });
  res.json(item);
});

router.delete("/:id", requireAuth, async (req, res) => {
  await Magazine.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

router.post("/reorder", requireAuth, async (req, res) => {
  const updates = req.body.items ?? [];
  await Promise.all(
    updates.map((item, idx) => Magazine.findByIdAndUpdate(item.id, { order: idx }))
  );
  res.json({ ok: true });
});

export default router;
