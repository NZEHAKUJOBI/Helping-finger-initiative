import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Logo } from "@/components/layout/Logo";
import { content } from "@/lib/content";
import { site } from "@/content/site";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s | ${site.shortName}`,
  },
  description: site.description,
  openGraph: {
    type: "website",
    siteName: site.name,
    title: site.name,
    description: site.description,
    images: ["/brand/logo.png"],
  },
  icons: { icon: "/brand/logo.png" },
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const [siteConfig, nav] = await Promise.all([content.getSite(), content.getNav()]);

  return (
    <html lang="en-NG" className={`${jakarta.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:font-semibold"
        >
          Skip to content
        </a>
        <Header nav={nav} logo={<Logo />} />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer site={siteConfig} nav={nav} />
      </body>
    </html>
  );
}
