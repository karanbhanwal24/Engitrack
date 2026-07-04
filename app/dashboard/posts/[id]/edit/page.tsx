import { redirect } from "next/navigation";

import { updatePost } from "@/app/actions";
import { PostForm } from "@/app/components/post-form";
import { SetupNotice } from "@/app/components/setup-notice";
import { authSafe } from "@/lib/auth";
import { connectToDatabase, getMongoConfigError } from "@/lib/mongodb";
import { Post } from "@/models/Post";

export const dynamic = "force-dynamic";

type EditablePost = {
  title: string;
  body: string;
  author: string;
};

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { session, error: authError } = await authSafe();

  if (authError) {
    return <SetupNotice title="Authentication setup required" message={authError} />;
  }

  if (!session?.user?.id) {
    redirect("/login");
  }

  const { id } = await params;
  const configError = getMongoConfigError();

  if (configError) {
    return <SetupNotice message={configError} />;
  }

  try {
    await connectToDatabase();
  } catch (error) {
    return <SetupNotice message={error instanceof Error ? error.message : "Failed to connect to MongoDB."} />;
  }

  const post = (await Post.findById(id).lean()) as EditablePost | null;

  if (!post || String(post.author) !== session.user.id) {
    redirect("/dashboard");
  }

  const action = updatePost.bind(null, id);

  return (
    <section className="form-page">
      <div className="page-heading">
        <p className="eyebrow">Edit</p>
        <h1>{post.title}</h1>
      </div>
      <PostForm
        action={action}
        submitLabel="Save changes"
        defaultValues={{ title: post.title, body: post.body }}
      />
    </section>
  );
}
