import mongoose from "mongoose";

const GalleryItemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    imageUrl: { type: String, required: true },
    order: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export const GalleryItem = mongoose.model("GalleryItem", GalleryItemSchema);
