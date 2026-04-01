import mongoose from "mongoose";

const AdminUserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    passwordHash: { type: String, required: true },
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const AdminUser = mongoose.model("AdminUser", AdminUserSchema);
