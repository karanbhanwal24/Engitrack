import { createPost } from "@/app/actions";
import { PostForm } from "@/app/components/post-form";
import { SetupNotice } from "@/app/components/setup-notice";
import { getMongoConfigError } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

export default function NewPostPage() {
  const configError = getMongoConfigError();

  return (
    <section className="form-page">
      {configError ? (
        <SetupNotice message={configError} />
      ) : (
        <>
          <div className="page-heading">
            <p className="eyebrow">Create</p>
            <h1>New post</h1>
          </div>
          <PostForm action={createPost} submitLabel="Publish post" />
        </>
      )}
    </section>
  );
}
