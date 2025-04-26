import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import AuthInitializer from "./utils/initAuth";
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
  title: "真人 AI 偶像平台",
  description: "與專屬於您的AI偶像互動，體驗個人化情感陪伴與創新應用",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hant">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthInitializer />
        {children}
      </body>
    </html>
  );
}
