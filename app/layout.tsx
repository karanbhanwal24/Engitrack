import Link from "next/link";
import { ReactNode } from "react";

import { AuthButtons } from "@/app/components/auth-buttons";
import { Providers } from "@/app/components/providers";

import "./globals.css";

export const metadata = {
  title: "Engitrack Blog",
  description: "A full-stack multi-page blog with auth and MongoDB.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <div className="shell">
            <header className="site-header">
              <div className="site-header__inner">
                <Link href="/" className="brand">
                  Engitrack Blog
                </Link>
                <AuthButtons />
              </div>
            </header>
            <main className="content">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
