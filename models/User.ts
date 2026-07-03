import { Schema, model, models } from "mongoose";

export interface UserDocument {
  _id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<UserDocument>(
  {
    name: { type: String, required: true, trim: true, minlength: 1, maxlength: 80 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export const User = models.User || model<UserDocument>("User", userSchema);
