import { useState } from "react";
import { FeedStyleProductGrid } from "@/components/FeedStyleProductGrid";
import { Footer } from "@/components/Footer";
import { CartButton } from "@/components/CartButton";
import { OrderTracker } from "@/components/OrderTracker";
import { DonationBanner } from "@/components/DonationBanner";
import { Button } from "@/components/ui/button";
import { Settings, Search } from "lucide-react";
import { Link } from "react-router-dom";

export default function FeedHome() {
  const [trackerOpen, setTrackerOpen] = useState(false);

  return (
    <main className="min-h-screen relative bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Header with Logo */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img 
              src="/logomark.png" 
              alt="hashtag3D" 
              className="h-8 w-8 md:h-10 md:w-10"
            />
            <span className="font-bold text-lg md:text-xl text-foreground">hashtag3D</span>
          </Link>
          
          <div className="flex items-center gap-2">
            <CartButton />
            <Link 
              to="/auth" 
              className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
              aria-label="Admin"
            >
              <Settings className="w-5 h-5 text-muted-foreground" />
            </Link>
          </div>
        </div>
      </header>

      {/* Feed Style Product Grid */}
      <FeedStyleProductGrid trackerOpen={trackerOpen} setTrackerOpen={setTrackerOpen} />

      {/* Footer */}
      <div className="relative z-10 mt-10">
        <Footer />
      </div>

      {/* Order Tracker Modal */}
      <OrderTracker open={trackerOpen} onOpenChange={setTrackerOpen} />
    </main>
  );
}

