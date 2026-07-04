"use client";

import { signOut } from "next-auth/react";

export function LogoutButton() {
  return (
    <button type="button" className="ghost-button" onClick={() => signOut({ callbackUrl: "/" })}>
      Log out
    </button>
  );
}
