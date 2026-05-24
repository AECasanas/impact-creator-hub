import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Impact Creator Hub",
  description: "Creator profiles and brand inquiry tools for impact creators."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="shell">
          <header className="nav">
            <Link href="/" className="brand" aria-label="Impact Creator Hub home">
              <span className="brand-mark">I</span>
              <span>Impact Creator Hub</span>
            </Link>
            <nav className="nav-links" aria-label="Main navigation">
              <Link href="/create-profile">Create profile</Link>
              <Link href="/dashboard">Dashboard</Link>
              <Link href="/signup/creator">Sign up</Link>
              <Link href="/login">Log in</Link>
            </nav>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
