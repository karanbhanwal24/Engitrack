import Link from "next/link";
import { ReactNode } from "react";

import { HeaderAuth } from "@/app/components/header-auth";

import "./globals.css";

export const metadata = {
  title: "Engitrack Blog",
  description: "A full-stack multi-page blog with auth and MongoDB.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <div className="shell">
          <header className="site-header">
            <div className="site-header__inner">
              <Link href="/" className="brand">
                Engitrack Blog
              </Link>
              <HeaderAuth />
            </div>
          </header>
          <main className="content">{children}</main>
        </div>
      </body>
    </html>
  );
}
