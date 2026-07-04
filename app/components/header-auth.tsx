import Link from "next/link";

import { authSafe } from "@/lib/auth";

import { LogoutButton } from "./logout-button";

export async function HeaderAuth() {
  const { session } = await authSafe();

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
      <LogoutButton />
    </div>
  );
}
