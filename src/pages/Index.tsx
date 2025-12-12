import { useState } from "react";
import { Hero } from "@/components/Hero";
import { ProductGrid } from "@/components/ProductGrid";
import { Footer } from "@/components/Footer";
import { DonationBanner } from "@/components/DonationBanner";
import { OrderTracker } from "@/components/OrderTracker";
import { CartButton } from "@/components/CartButton";
import { CustomOrderCTA } from "@/components/CustomOrderCTA";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

const Index = () => {
  const [trackerOpen, setTrackerOpen] = useState(false);

  return (
    <main className="min-h-screen">
      {/* Fixed Cart Button */}
      <div className="fixed top-4 right-4 z-50">
        <CartButton />
      </div>
      
      <Hero />
      <DonationBanner />
      
      {/* Track Order Button */}
      <div className="flex justify-center -mt-4 mb-8">
        <Button 
          variant="outline" 
          onClick={() => setTrackerOpen(true)}
          className="gap-2"
        >
          <Search className="w-4 h-4" />
          Track Your Order
        </Button>
      </div>
      
      <ProductGrid />
      
      {/* Custom Order CTA */}
      <CustomOrderCTA />
      
      <Footer />
      
      <OrderTracker open={trackerOpen} onOpenChange={setTrackerOpen} />
    </main>
  );
};

export default Index;
