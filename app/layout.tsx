import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteNavigation } from "@/components/SiteNavigation";
import {
  DEFAULT_SITE_DESCRIPTION,
  SITE_NAME,
  getSiteUrl,
} from "@/lib/site-metadata";
import "./globals.css";
import { TemporaryAdminTab } from "@/components/TemporaryAdminTab";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: getSiteUrl(),
  title: {
    default: SITE_NAME,
    template: "%s",
  },
  description: DEFAULT_SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  openGraph: {
    title: SITE_NAME,
    description: DEFAULT_SITE_DESCRIPTION,
    type: "website",
    siteName: SITE_NAME,
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: DEFAULT_SITE_DESCRIPTION,
  },
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
        <TemporaryAdminTab />
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}



