import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap", // Improves perceived loading speed
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Happy 30th Birthday! | Interactive Birthday Card",
  description: "A special interactive birthday card created just for you. Open it to see your personalized birthday message!",
  keywords: ["birthday", "card", "greeting", "animation", "interactive"],
  authors: [{ name: "Digital Card Maker" }],
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ff6b8a' },
    { media: '(prefers-color-scheme: dark)', color: '#ff9eb1' }
  ],
  openGraph: {
    title: "Happy 30th Birthday! | Interactive Birthday Card",
    description: "A special interactive birthday card created just for you. Open it to see your personalized birthday message!",
    type: "website",
    locale: "en_US",
    url: "https://birthday-card.example.com",
    siteName: "Digital Birthday Cards",
    images: [
      {
        url: "/api/placeholder/800/600",
        width: 800,
        height: 600,
        alt: "Birthday Card Preview",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen overflow-x-hidden`}
      >
        {children}
      </body>
    </html>
  );
}