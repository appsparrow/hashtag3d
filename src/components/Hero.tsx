import { Button } from "@/components/ui/button";

export function Hero() {
  const scrollToProducts = () => {
    document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative h-screen w-full overflow-hidden text-white">
      {/* Simple Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#3e47e0] via-[#e0469a] to-[#ffcc49]" />

      {/* Hero Content */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center z-10">
        <div className="flex justify-center mb-4">
          <img 
            src="/logo-H3D-hero.png" 
            alt="hashtag3D" 
            className="h-16 md:h-20 w-auto drop-shadow-[0_4px_15px_rgba(0,0,0,0.4)]"
          />
        </div>
        
        <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3 drop-shadow-[0_4px_15px_rgba(0,0,0,0.4)]">
          3D Print. Learn. Build. Donate.
        </h1>
        
        <p className="text-base md:text-lg lg:text-xl mb-6 max-w-[420px] mx-auto text-white/95">
          Fun toys, flexi creatures, figurines, and custom models made by a high-school maker.
        </p>
        
        <Button 
          onClick={scrollToProducts}
          className="px-7 py-3 bg-white text-black font-semibold rounded-[10px] hover:bg-[#ffe9a4] hover:-translate-y-1 transition-all duration-300 shadow-lg"
          size="lg"
        >
          Explore
        </Button>
      </div>
    </section>
  );
}
