import mongoose from "mongoose";

const MagazineSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    month: { type: String, required: true, trim: true },
    thumbnailUrl: { type: String, required: true },
    pdfUrl: { type: String, required: true },
    order: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export const Magazine = mongoose.model("Magazine", MagazineSchema);
