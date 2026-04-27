import { Router } from "express";
import { Announcement } from "../models/Announcement.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

const defaultPinned = [
  "Online Prayer at 9 p.m. every Tuesday",
  "Women's Prayer at 5 p.m. every Saturday",
  "Youth's Prayer at 8 p.m. every Saturday",
  "Nambikkai TV - Sunday 6.00 p.m & midnight 12.00 a.m., Thursday 8.30 p.m., Saturday 7.45 p.m.  & midnight 12.00 a.m."
];

let defaultsEnsured = false;

async function ensureDefaultAnnouncements() {
  if (defaultsEnsured) return;
  for (let idx = 0; idx < defaultPinned.length; idx += 1) {
    const title = defaultPinned[idx];
    const existing = await Announcement.findOne({ title }).lean();
    if (!existing) {
      await Announcement.create({ title, pinned: true, order: idx });
    }
  }
  defaultsEnsured = true;
}

router.get("/", async (req, res) => {
  await ensureDefaultAnnouncements();
  const items = await Announcement.find().sort({ pinned: -1, order: 1, createdAt: -1 }).lean();
  res.json(items);
});

router.post("/", requireAuth, async (req, res) => {
  const item = await Announcement.create(req.body);
  res.status(201).json(item);
});

router.put("/:id", requireAuth, async (req, res) => {
  const item = await Announcement.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!item) return res.status(404).json({ message: "Not found" });
  res.json(item);
});

router.delete("/:id", requireAuth, async (req, res) => {
  await Announcement.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

router.post("/reorder", requireAuth, async (req, res) => {
  const updates = req.body.items ?? [];
  await Promise.all(
    updates.map((item, idx) => Announcement.findByIdAndUpdate(item.id, { order: idx }))
  );
  res.json({ ok: true });
});

export default router;
