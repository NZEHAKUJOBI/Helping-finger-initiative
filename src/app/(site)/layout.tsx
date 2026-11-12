import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Logo } from "@/components/layout/Logo";
import { TopBar } from "@/components/layout/TopBar";
import { content } from "@/lib/content";

export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const [site, nav] = await Promise.all([content.getSite(), content.getNav()]);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:font-semibold"
      >
        Skip to content
      </a>
      <TopBar contact={site.contact} />
      <Header nav={nav} logo={<Logo />} />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer site={site} nav={nav} />
    </>
  );
}
