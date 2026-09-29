import type { Metadata } from "next";
import localFont from "next/font/local";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import "./globals.css";
import Providers from "./providers";
import { site } from "@/lib/site.config";
import { themeBootstrapScript } from "@/lib/theme";

const display = localFont({
  src: [
    { path: "./fonts/bodoni-moda-400.ttf", weight: "400", style: "normal" },
    { path: "./fonts/bodoni-moda-500.ttf", weight: "500", style: "normal" },
  ],
  variable: "--font-display",
  display: "swap",
});

const sans = localFont({
  src: [
    { path: "./fonts/jost-300.ttf", weight: "300", style: "normal" },
    { path: "./fonts/jost-400.ttf", weight: "400", style: "normal" },
    { path: "./fonts/jost-500.ttf", weight: "500", style: "normal" },
  ],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: `${site.name} — fragrance and leather, Baltimore`,
  description:
    "A small fragrance and leather house in Baltimore, Maryland. Three scents in three sizes, and bags built to order.",
  openGraph: {
    title: site.name,
    description: site.tagline,
    url: site.url,
    type: "website",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover" as const,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ConvexAuthNextjsServerProvider>
      <html lang="en" className={`${display.variable} ${sans.variable}`} suppressHydrationWarning>
        <head>
          {/* Sets the theme class before first paint, so there is no flash. */}
          <script dangerouslySetInnerHTML={{ __html: themeBootstrapScript }} />
        </head>
        <body className="bg-ink font-sans text-linen antialiased">
          <a href="#main-content" className="skip-link">Skip to content</a>
          <Providers>{children}</Providers>
        </body>
      </html>
    </ConvexAuthNextjsServerProvider>
  );
}
