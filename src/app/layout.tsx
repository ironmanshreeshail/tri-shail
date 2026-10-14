import type { Metadata, Viewport } from "next";
import { site } from "@/content/site";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tri-Shail — Your next finish line starts here",
  description: site.description,
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: "Tri-Shail Performance Coaching",
    description: site.description,
    type: "website",
  },
  robots: { index: false, follow: false }, // Switch on when business copy and production domain are confirmed.
};
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#141714",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="preload"
          href="/media/barlow-1.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
