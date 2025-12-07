import { Hero } from "@/components/Hero";
import { ProductGrid } from "@/components/ProductGrid";
import { Footer } from "@/components/Footer";
import { DonationBanner } from "@/components/DonationBanner";

const Index = () => {
  return (
    <main className="min-h-screen">
      <Hero />
      <DonationBanner />
      <ProductGrid />
      <Footer />
    </main>
  );
};

export default Index;
