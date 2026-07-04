import { SignUpForm } from "@/app/components/signup-form";
import { SetupNotice } from "@/app/components/setup-notice";
import { getAuthConfigError } from "@/lib/auth";
import { getMongoConfigError } from "@/lib/mongodb";

export default function SignUpPage() {
  const authError = getAuthConfigError();
  const configError = getMongoConfigError();

  return (
    <section className="auth-page">
      <div className="auth-card">
        <div className="page-heading">
          <p className="eyebrow">Account</p>
          <h1>Sign up</h1>
        </div>
        {authError ? (
          <SetupNotice title="Authentication setup required" message={authError} />
        ) : configError ? (
          <SetupNotice title="Database setup required for sign up" message={configError} />
        ) : (
          <SignUpForm />
        )}
      </div>
    </section>
  );
}
