import SmoothScroll from "@/components/motion/SmoothScroll";
import SiteNav from "@/components/site/SiteNav";

// Marketing pages share smooth scroll + nav. Auth/QR routes stay outside
// this group on purpose — they must not grow marketing JS.
export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SmoothScroll>
      <SiteNav />
      <main className="bg-cream-50">{children}</main>
    </SmoothScroll>
  );
}
