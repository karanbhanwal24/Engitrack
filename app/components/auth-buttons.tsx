"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

export function AuthButtons() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <span className="muted">Loading...</span>;
  }

  if (!session?.user) {
    return (
      <div className="nav-actions">
        <Link href="/login">Log in</Link>
        <Link href="/signup" className="button">
          Sign up
        </Link>
      </div>
    );
  }

  return (
    <div className="nav-actions">
      <Link href="/dashboard">Dashboard</Link>
      <button type="button" className="ghost-button" onClick={() => signOut({ callbackUrl: "/" })}>
        Log out
      </button>
    </div>
  );
}
