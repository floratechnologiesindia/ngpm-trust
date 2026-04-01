import { Router } from "express";
import { Event } from "../models/Event.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", async (req, res) => {
  const events = await Event.find().sort({ order: 1, date: -1 }).lean();
  res.json(events);
});

router.post("/", requireAuth, async (req, res) => {
  const event = await Event.create(req.body);
  res.status(201).json(event);
});

router.put("/:id", requireAuth, async (req, res) => {
  const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!event) return res.status(404).json({ message: "Not found" });
  res.json(event);
});

router.delete("/:id", requireAuth, async (req, res) => {
  await Event.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

router.post("/reorder", requireAuth, async (req, res) => {
  const updates = req.body.items ?? [];
  await Promise.all(updates.map((item, idx) => Event.findByIdAndUpdate(item.id, { order: idx })));
  res.json({ ok: true });
});

export default router;
