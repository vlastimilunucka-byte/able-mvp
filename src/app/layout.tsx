import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Able Ops MVP",
  description: "Tasks + reliability ops demo for Able to compete challenge.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="min-h-screen bg-slate-950 text-slate-100">
          <header className="border-b border-slate-800 bg-slate-950/80">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
              <div>
                <p className="text-sm font-semibold text-white">Able Ops MVP</p>
                <p className="text-xs text-slate-400">Tasks, incidents, alerts, audit & analytics</p>
              </div>
              <nav className="flex flex-wrap gap-4 text-xs text-slate-300">
                <Link className="hover:text-white" href="/">
                  Overview
                </Link>
                <Link className="hover:text-white" href="/board">
                  Board
                </Link>
                <Link className="hover:text-white" href="/incidents">
                  Incidents
                </Link>
                <Link className="hover:text-white" href="/alerts">
                  Alerts
                </Link>
                <Link className="hover:text-white" href="/logs">
                  Logs
                </Link>
                <Link className="hover:text-white" href="/audit">
                  Audit
                </Link>
                <Link className="hover:text-white" href="/analytics">
                  Analytics
                </Link>
                <Link className="hover:text-white" href="/releases">
                  Releases
                </Link>
                <Link className="hover:text-white" href="/settings">
                  Settings
                </Link>
              </nav>
            </div>
          </header>
          <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
        </div>
      </body>
    </html>
  );
}
