import GallerySection from "@/components/sections/GallerySection";
import GoldWaves from "@/components/effects/GoldWaves";

import AtelierHero from "@/components/sections/AtelierHero";
import FragranceSection from "@/components/sections/FragranceSection";
import FragranceBarSection from "@/components/sections/FragranceBarSection";
import CustomFavorsSection from "@/components/sections/CustomFavorsSection";
import BagsSection from "@/components/sections/BagsSection";
import HouseSection from "@/components/sections/HouseSection";
import FaqSection from "@/components/sections/FaqSection";
import ContactSection from "@/components/sections/ContactSection";
import SiteFooter from "@/components/sections/SiteFooter";
import SiteHeader from "@/components/ui/SiteHeader";
import WhatsAppButton from "@/components/ui/WhatsAppButton";

export default function Home() {
  return (
    <div id="top" className="bg-ink">
      <GoldWaves />
      <SiteHeader />
      <main id="main-content">
        <AtelierHero />
        <FragranceSection />
        <FragranceBarSection />
        <CustomFavorsSection />
        <BagsSection />
        <HouseSection />
        <GallerySection />
        <FaqSection />
        <ContactSection />
      </main>
      <SiteFooter />
      <WhatsAppButton />
    </div>
  );
}
