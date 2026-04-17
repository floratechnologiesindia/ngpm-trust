import mongoose from "mongoose";

const SermonSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    youtubeUrl: { type: String, required: true, trim: true },
    order: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export const Sermon = mongoose.model("Sermon", SermonSchema);
