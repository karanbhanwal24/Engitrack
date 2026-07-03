"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { FormEvent, useState } from "react";

export function LoginForm({ registered = false }: { registered?: boolean }) {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email")?.toString() ?? "";
    const password = formData.get("password")?.toString() ?? "";

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl: "/dashboard",
    });

    setPending(false);

    if (result?.error) {
      setError("Invalid email or password.");
      return;
    }

    window.location.href = result?.url ?? "/dashboard";
  }

  return (
    <form onSubmit={handleSubmit} className="stack">
      {registered ? (
        <p className="success">Account created. Log in with your new credentials.</p>
      ) : null}
      <label className="field">
        <span>Email</span>
        <input type="email" name="email" required />
      </label>
      <label className="field">
        <span>Password</span>
        <input type="password" name="password" required />
      </label>
      {error ? <p className="error">{error}</p> : null}
      <button type="submit" className="button" disabled={pending}>
        {pending ? "Logging in..." : "Log in"}
      </button>
      <p className="muted">
        Need an account? <Link href="/signup">Sign up</Link>
      </p>
    </form>
  );
}
