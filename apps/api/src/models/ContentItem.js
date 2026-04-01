import mongoose from "mongoose";

const ContentItemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    type: { type: String, enum: ["gallery", "event"], required: true },
    imageUrl: { type: String, default: "" },
    order: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export const ContentItem = mongoose.model("ContentItem", ContentItemSchema);
