import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
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
  title: "Product Showcase",
  description: "A minimal product showcase with soft black and gray design.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-slate-100 font-sans`}
      >
        <header className="border-b border-slate-700/40 bg-slate-900/70 backdrop-blur-xl">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
            <Link
              href="/"
              className="text-lg font-medium tracking-tight text-white transition-opacity duration-300 hover:opacity-80"
            >
              Product Showcase
            </Link>
            <Link
              href="/admin"
              className="text-sm text-text-secondary transition-colors duration-300 hover:text-white"
            >
              Admin
            </Link>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
          {children}
        </main>
        <footer className="border-t border-slate-700/30 bg-slate-900/70">
          <div className="mx-auto max-w-6xl px-4 py-8 text-center text-sm text-text-muted sm:px-6">
            © {new Date().getFullYear()} Product Showcase
          </div>
        </footer>
      </body>
    </html>
  );
}
