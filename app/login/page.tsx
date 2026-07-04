import { LoginForm } from "@/app/components/login-form";
import { SetupNotice } from "@/app/components/setup-notice";
import { getAuthConfigError } from "@/lib/auth";
import { getMongoConfigError } from "@/lib/mongodb";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ registered?: string }>;
}) {
  const params = await searchParams;
  const authError = getAuthConfigError();
  const configError = getMongoConfigError();

  return (
    <section className="auth-page">
      <div className="auth-card">
        <div className="page-heading">
          <p className="eyebrow">Account</p>
          <h1>Log in</h1>
        </div>
        {authError ? (
          <SetupNotice title="Authentication setup required" message={authError} />
        ) : configError ? (
          <SetupNotice title="Database setup required for login" message={configError} />
        ) : (
          <LoginForm registered={params.registered === "1"} />
        )}
      </div>
    </section>
  );
}
