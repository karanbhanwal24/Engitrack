import Link from "next/link";

import { SetupNotice } from "@/app/components/setup-notice";
import { connectToDatabase } from "@/lib/mongodb";
import { getMongoConfigError } from "@/lib/mongodb";
import { excerpt, formatDate } from "@/lib/utils";
import { Post } from "@/models/Post";

export const dynamic = "force-dynamic";

type HomePost = {
  _id: string;
  title: string;
  slug: string;
  body: string;
  createdAt: Date;
  author?: {
    name?: string;
  };
};

export default async function HomePage() {
  const configError = getMongoConfigError();

  if (configError) {
    return <SetupNotice message={configError} />;
  }

  try {
    await connectToDatabase();
  } catch (error) {
    return <SetupNotice message={error instanceof Error ? error.message : "Failed to connect to MongoDB."} />;
  }

  const posts = (await Post.find({}).sort({ createdAt: -1 }).populate("author", "name email").lean()) as unknown as HomePost[];

  return (
    <section className="page-section">
      <div className="section-header">
        <div>
          <p className="eyebrow">Public blog</p>
          <h1>Latest posts</h1>
        </div>
        <Link href="/dashboard" className="button">
          Manage posts
        </Link>
      </div>
      <div className="post-list">
        {posts.length === 0 ? (
          <div className="empty-state">
            <h2>No posts yet</h2>
            <p>The first published post will show up here.</p>
          </div>
        ) : (
          posts.map((post) => (
            <article key={String(post._id)} className="post-card">
              <div className="post-card__meta">
                <span>{post.author?.name ?? "Unknown author"}</span>
                <span>{formatDate(post.createdAt)}</span>
              </div>
              <h2>
                <Link href={`/posts/${post.slug}`}>{post.title}</Link>
              </h2>
              <p>{excerpt(post.body)}</p>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
