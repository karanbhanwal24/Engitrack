import Link from "next/link";
import { redirect } from "next/navigation";

import { deletePost } from "@/app/actions";
import { SetupNotice } from "@/app/components/setup-notice";
import { auth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { getMongoConfigError } from "@/lib/mongodb";
import { formatDate } from "@/lib/utils";
import { Post } from "@/models/Post";

export const dynamic = "force-dynamic";

type DashboardPost = {
  _id: string;
  title: string;
  slug: string;
  updatedAt: Date;
};

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const configError = getMongoConfigError();

  if (configError) {
    return <SetupNotice message={configError} />;
  }

  try {
    await connectToDatabase();
  } catch (error) {
    return <SetupNotice message={error instanceof Error ? error.message : "Failed to connect to MongoDB."} />;
  }

  const posts = (await Post.find({ author: session.user.id }).sort({ updatedAt: -1 }).lean()) as unknown as DashboardPost[];

  return (
    <section className="page-section">
      <div className="section-header">
        <div>
          <p className="eyebrow">Dashboard</p>
          <h1>Your posts</h1>
        </div>
        <Link href="/dashboard/posts/new" className="button">
          New post
        </Link>
      </div>
      <div className="dashboard-list">
        {posts.length === 0 ? (
          <div className="empty-state">
            <h2>No posts yet</h2>
            <p>Create your first post to get started.</p>
          </div>
        ) : (
          posts.map((post) => (
            <div key={String(post._id)} className="dashboard-row">
              <div>
                <h2>{post.title}</h2>
                <p className="muted">Updated {formatDate(post.updatedAt)}</p>
              </div>
              <div className="row-actions">
                <Link href={`/posts/${post.slug}`} className="ghost-link">
                  View
                </Link>
                <Link href={`/dashboard/posts/${String(post._id)}/edit`} className="ghost-link">
                  Edit
                </Link>
                <form action={deletePost}>
                  <input type="hidden" name="postId" value={String(post._id)} />
                  <button type="submit" className="danger-button">
                    Delete
                  </button>
                </form>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
