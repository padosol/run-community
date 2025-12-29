import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast"; // Import Toaster
import Footer from "../components/layout/Footer";
import Header from "../components/layout/Header";
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
    default: 'Blue Circle',
    template: '%s | Blue Circle',
  },
  description: 'Blue Circle 커뮤니티. 자신을 마음껏 표현하세요.',
  keywords: ['커뮤니티', '게시판', 'Blue Circle', '자유게시판'],
  authors: [{ name: 'Blue Circle' }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://bluecircle.padosol.com'),
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    siteName: 'Blue Circle',
    title: 'Blue Circle',
    description: 'Blue Circle 커뮤니티. 자신을 마음껏 표현하세요.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="ko">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
        >
          <Toaster /> {/* Add Toaster component here */}
          <Header />
          <main className="grow container mx-auto px-2 sm:px-4 py-4">
            {children}
          </main>
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
