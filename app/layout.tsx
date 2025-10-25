import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

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
    default: "TeslaMR - MRI Technologist Curriculum",
    template: "%s | TeslaMR"
  },
  description: "Complete MRI technologist training curriculum with interactive lessons, quizzes, and hands-on preparation for clinical readiness.",
  keywords: ["MRI", "MRI technologist", "curriculum", "radiology", "medical training", "Tesla", "MRI certification"],
  authors: [{ name: "TeslaMR" }],
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://teslamr.com',
    siteName: 'TeslaMR',
    title: 'TeslaMR - MRI Technologist Curriculum',
    description: 'Complete MRI technologist training curriculum with interactive lessons, quizzes, and hands-on preparation for clinical readiness.',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'TeslaMR - MRI Technologist Curriculum',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TeslaMR - MRI Technologist Curriculum',
    description: 'Complete MRI technologist training curriculum with interactive lessons, quizzes, and hands-on preparation.',
    images: ['/opengraph-image'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
