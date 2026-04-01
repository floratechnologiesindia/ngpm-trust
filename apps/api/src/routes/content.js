import { Router } from "express";
import { ContentItem } from "../models/ContentItem.js";

const router = Router();

router.get("/", async (req, res) => {
  const items = await ContentItem.find().sort({ order: 1, createdAt: -1 }).lean();
  res.json(items);
});

router.post("/", async (req, res) => {
  const item = await ContentItem.create(req.body);
  res.status(201).json(item);
});

router.put("/:id", async (req, res) => {
  const item = await ContentItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!item) return res.status(404).json({ message: "Not found" });
  res.json(item);
});

router.delete("/:id", async (req, res) => {
  await ContentItem.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

router.post("/reorder", async (req, res) => {
  const updates = req.body.items ?? [];
  await Promise.all(
    updates.map((item, idx) =>
      ContentItem.findByIdAndUpdate(item.id, { order: idx }, { new: false })
    )
  );
  res.json({ ok: true });
});

export default router;
