import type { Metadata } from "next";
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
  title: "Ali Zargari | Software Engineer",
  description: "The digital core of a machine built to keep chaos at bay, but just barely.",
  keywords: ["systems engineer", "portfolio", "innovation", "technology"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="scanline" aria-hidden="true"></div>
        {children}
        <div className="fixed bottom-1 w-full text-center text-[0.4rem] opacity-30 pointer-events-none" aria-hidden="true">
          Nothing good comes from playing it safe.
        </div>
      </body>
    </html>
  );
}
