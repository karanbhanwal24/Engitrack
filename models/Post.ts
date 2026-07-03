import { Schema, model, models } from "mongoose";

export interface PostDocument {
  _id: string;
  title: string;
  slug: string;
  body: string;
  author: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const postSchema = new Schema<PostDocument>(
  {
    title: { type: String, required: true, trim: true, minlength: 1, maxlength: 200 },
    slug: { type: String, required: true, unique: true, trim: true },
    body: { type: String, required: true, minlength: 1, maxlength: 10000 },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
  }
);

export const Post = models.Post || model<PostDocument>("Post", postSchema);
