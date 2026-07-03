import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";

import { SetupNotice } from "@/app/components/setup-notice";
import { connectToDatabase, getMongoConfigError } from "@/lib/mongodb";
import { formatDate } from "@/lib/utils";
import { Post } from "@/models/Post";

export const dynamic = "force-dynamic";

type DetailPost = {
  title: string;
  body: string;
  createdAt: Date;
  updatedAt: Date;
  author?: {
    name?: string;
  };
};

export default async function PostDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const configError = getMongoConfigError();

  if (configError) {
    return <SetupNotice message={configError} />;
  }

  try {
    await connectToDatabase();
  } catch (error) {
    return <SetupNotice message={error instanceof Error ? error.message : "Failed to connect to MongoDB."} />;
  }

  const post = (await Post.findOne({ slug }).populate("author", "name email").lean()) as DetailPost | null;

  if (!post) {
    notFound();
  }

  return (
    <article className="article">
      <header className="article-header">
        <p className="eyebrow">By {post.author?.name ?? "Unknown author"}</p>
        <h1>{post.title}</h1>
        <p className="muted">
          Created {formatDate(post.createdAt)} • Updated {formatDate(post.updatedAt)}
        </p>
      </header>
      <div className="markdown-body">
        <ReactMarkdown>{post.body}</ReactMarkdown>
      </div>
    </article>
  );
}
