import { LoginForm } from "@/app/components/login-form";
import { SetupNotice } from "@/app/components/setup-notice";
import { getMongoConfigError } from "@/lib/mongodb";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ registered?: string }>;
}) {
  const params = await searchParams;
  const configError = getMongoConfigError();

  return (
    <section className="auth-page">
      <div className="auth-card">
        <div className="page-heading">
          <p className="eyebrow">Account</p>
          <h1>Log in</h1>
        </div>
        {configError ? <SetupNotice title="Database setup required for login" message={configError} /> : <LoginForm registered={params.registered === "1"} />}
      </div>
    </section>
  );
}
