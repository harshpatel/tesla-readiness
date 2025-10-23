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
  title: {
    default: "TeslaMR - MRI Readiness Quiz",
    template: "%s | TeslaMR"
  },
  description: "Master medical terminology and MRI concepts with interactive quizzes. Learn prefixes, suffixes, root words, abbreviations, and patient positioning for MRI readiness.",
  keywords: ["MRI", "medical terminology", "quiz", "radiology", "medical training", "Tesla", "MRI certification"],
  authors: [{ name: "TeslaMR" }],
  icons: {
    icon: '/favicon.ico',
  },
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
        {children}
      </body>
    </html>
  );
}
