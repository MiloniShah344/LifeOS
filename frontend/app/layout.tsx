import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/shared/Providers";

// Load Inter font from Google Fonts (built into Next.js)
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",  // makes it available as CSS variable
});

// SEO metadata — Next.js handles <head> for you
export const metadata: Metadata = {
  title: {
    default: "LifeOS",
    template: "%s | LifeOS",   // pages can set their own title
  },
  description: "Your personal life management system. Track tasks, habits, mood, and level up your life.",
  keywords: ["productivity", "habits", "tasks", "gamification"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body id="root" className={`${inter.variable} font-sans antialiased`}>
        {/* Providers wraps everything — Redux, MUI, TanStack Query */}
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
