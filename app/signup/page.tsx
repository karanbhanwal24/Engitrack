import { SignUpForm } from "@/app/components/signup-form";
import { SetupNotice } from "@/app/components/setup-notice";
import { getMongoConfigError } from "@/lib/mongodb";

export default function SignUpPage() {
  const configError = getMongoConfigError();

  return (
    <section className="auth-page">
      <div className="auth-card">
        <div className="page-heading">
          <p className="eyebrow">Account</p>
          <h1>Sign up</h1>
        </div>
        {configError ? <SetupNotice title="Database setup required for sign up" message={configError} /> : <SignUpForm />}
      </div>
    </section>
  );
}
