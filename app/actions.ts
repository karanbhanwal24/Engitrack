"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { authSafe, getAuthConfigError } from "@/lib/auth";
import { connectToDatabase, getMongoConfigError } from "@/lib/mongodb";
import { slugify } from "@/lib/utils";
import { validatePostInput } from "@/lib/validation";
import { Post } from "@/models/Post";
import { User } from "@/models/User";

export type FormState = {
  error?: string;
};

async function requireUser() {
  const { session, error } = await authSafe();

  if (error) {
    throw new Error(error);
  }

  if (!session?.user?.id) {
    redirect("/login");
  }

  return session.user;
}

function getDatabaseActionError() {
  return getMongoConfigError() ?? "Database connection failed. Check your MongoDB Atlas configuration and restart the server.";
}

function getAuthActionError() {
  return getAuthConfigError() ?? "Authentication failed to initialize. Check your Vercel auth environment variables and redeploy.";
}

export async function signUp(_: FormState, formData: FormData): Promise<FormState> {
  const name = formData.get("name")?.toString().trim() ?? "";
  const email = formData.get("email")?.toString().toLowerCase().trim() ?? "";
  const password = formData.get("password")?.toString() ?? "";

  if (!name || !email || password.length < 8) {
    return { error: "Name, email, and a password of at least 8 characters are required." };
  }

  try {
    await connectToDatabase();
  } catch {
    return { error: getDatabaseActionError() };
  }

  const existingUser = await User.findOne({ email }).lean();

  if (existingUser) {
    return { error: "An account with that email already exists." };
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  await User.create({
    name,
    email,
    password: hashedPassword,
  });

  redirect("/login?registered=1");
}

async function uniqueSlug(baseSlug: string, excludeId?: string) {
  let candidate = baseSlug || "untitled-post";
  let counter = 1;

  while (true) {
    const existing = await Post.findOne({
      slug: candidate,
      ...(excludeId ? { _id: { $ne: excludeId } } : {}),
    }).lean();

    if (!existing) {
      return candidate;
    }

    counter += 1;
    candidate = `${baseSlug}-${counter}`;
  }
}

export async function createPost(_: FormState, formData: FormData): Promise<FormState> {
  let user;

  try {
    user = await requireUser();
  } catch {
    return { error: getAuthActionError() };
  }

  const input = {
    title: formData.get("title")?.toString() ?? "",
    body: formData.get("body")?.toString() ?? "",
  };
  const { title, body, errors } = validatePostInput(input);

  if (errors.length > 0) {
    return { error: errors[0] };
  }

  try {
    await connectToDatabase();
  } catch {
    return { error: getDatabaseActionError() };
  }

  const slug = await uniqueSlug(slugify(title));

  await Post.create({
    title,
    body,
    slug,
    author: user.id,
  });

  revalidatePath("/");
  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function updatePost(postId: string, _: FormState, formData: FormData): Promise<FormState> {
  let user;

  try {
    user = await requireUser();
  } catch {
    return { error: getAuthActionError() };
  }

  const input = {
    title: formData.get("title")?.toString() ?? "",
    body: formData.get("body")?.toString() ?? "",
  };
  const { title, body, errors } = validatePostInput(input);

  if (errors.length > 0) {
    return { error: errors[0] };
  }

  try {
    await connectToDatabase();
  } catch {
    return { error: getDatabaseActionError() };
  }

  const post = await Post.findById(postId);

  if (!post) {
    return { error: "Post not found." };
  }

  if (post.author.toString() !== user.id) {
    return { error: "You do not have permission to edit this post." };
  }

  post.title = title;
  post.body = body;
  post.slug = await uniqueSlug(slugify(title), postId);
  await post.save();

  revalidatePath("/");
  revalidatePath("/dashboard");
  revalidatePath(`/posts/${post.slug}`);
  redirect("/dashboard");
}

export async function deletePost(formData: FormData) {
  let user;

  try {
    user = await requireUser();
  } catch {
    throw new Error(getAuthActionError());
  }

  const postId = formData.get("postId")?.toString() ?? "";

  try {
    await connectToDatabase();
  } catch {
    throw new Error(getDatabaseActionError());
  }

  const post = await Post.findById(postId);

  if (!post) {
    return;
  }

  if (post.author.toString() !== user.id) {
    throw new Error("Forbidden");
  }

  const slug = post.slug;
  await Post.findByIdAndDelete(postId);

  revalidatePath("/");
  revalidatePath("/dashboard");
  revalidatePath(`/posts/${slug}`);
}
