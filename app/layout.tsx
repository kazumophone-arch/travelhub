import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteNavigation } from "@/components/SiteNavigation";
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
  metadataBase: new URL("https://travelhub-murex.vercel.app"),
  title: {
    default: "TravelHub | Find travel links by city",
    template: "%s",
  },
  description:
    "Discover travel cities, featured spots, hotel links, and tour links from short travel videos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <SiteNavigation />

        <div className="travelhub-site-page-shell">
          {children}
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
