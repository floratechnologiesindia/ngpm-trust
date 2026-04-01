import mongoose from "mongoose";

const EventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    date: { type: Date, required: true },
    imageUrls: { type: [String], default: [] },
    order: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export const Event = mongoose.model("Event", EventSchema);
