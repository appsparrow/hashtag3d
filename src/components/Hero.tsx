import { Button } from "@/components/ui/button";
import { ArrowDown, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import heroBg from "@/assets/hero-bg.jpg";

export function Hero() {
  const scrollToProducts = () => {
    document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Admin Link */}
      <Link 
        to="/auth" 
        className="absolute top-4 right-4 z-20 p-2 rounded-lg bg-primary-foreground/10 backdrop-blur-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors"
      >
        <Settings className="w-5 h-5" />
      </Link>

      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/70 via-foreground/50 to-background" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Logo */}
          <div className="flex justify-center mb-4">
            <img 
              src="/logo-H3D-hero.png" 
              alt="hashtag3D" 
              className="h-16 md:h-20 w-auto"
            />
          </div>
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 text-primary-foreground animate-scale-in">
            <span className="text-sm font-medium">Custom 3D Printing Services</span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground leading-tight">
            Bring Your Ideas
            <span className="block text-amber-glow">To Life</span>
          </h1>

          <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto leading-relaxed">
            From personalized keychains to unique home décor, I craft custom 3D printed creations 
            tailored just for you. Browse my collection and find your next favorite piece.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button variant="hero" size="xl" onClick={scrollToProducts}>
              Browse Collection
            </Button>
            <Button variant="hero-outline" size="xl" onClick={scrollToProducts}>
              Custom Orders
            </Button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <button 
          onClick={scrollToProducts}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-primary-foreground/60 hover:text-primary-foreground transition-colors animate-float"
          aria-label="Scroll to products"
        >
          <ArrowDown className="w-6 h-6" />
        </button>
      </div>
    </section>
  );
}
