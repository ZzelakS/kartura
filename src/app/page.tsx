import FragranceFeature from "@/components/sections/FragranceFeature";
import KarturaHero from "@/components/hero/KarturaHero";
import FragranceSection from "@/components/sections/FragranceSection";
import BagsSection from "@/components/sections/BagsSection";
import HouseSection from "@/components/sections/HouseSection";
import SiteFooter from "@/components/sections/SiteFooter";
import SiteHeader from "@/components/ui/SiteHeader";
import CartDrawer from "@/components/ui/CartDrawer";
import WhatsAppButton from "@/components/ui/WhatsAppButton";

export default function Home() {
  return (
    <div id="top" className="bg-ink">
      <SiteHeader />
      <main id="main-content">
        <KarturaHero />
        <FragranceFeature />
        <FragranceSection />
        <BagsSection />
        <HouseSection />
      </main>
      <SiteFooter />
      <CartDrawer />
      <WhatsAppButton />
    </div>
  );
}
