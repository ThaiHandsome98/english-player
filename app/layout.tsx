import type { Metadata, Viewport } from "next";
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
  title: "English Shadowing Player - Luyện Nghe Tiếng Anh A-B Repeat",
  description:
    "Ứng dụng web học tiếng Anh chuyên sâu: Lặp đoạn A-B Repeat, điều chỉnh tốc độ, phát audio nền màn hình khóa điện thoại (iOS / Android).",
  keywords: [
    "english shadowing",
    "a-b repeat player",
    "học tiếng anh",
    "luyện nghe tiếng anh",
    "audio player a-b",
    "shadowing english",
  ],
  authors: [{ name: "English Player" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#09090b",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-zinc-950 text-zinc-100 selection:bg-indigo-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
