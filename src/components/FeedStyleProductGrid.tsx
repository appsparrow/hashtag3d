import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Sparkles } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import defaultProductImage from "@/assets/default-product.jpg";
import { useLocalSetting } from "@/hooks/useLocalSettings";

export function FeedStyleProductGrid() {
  const navigate = useNavigate();
  const { data: products = [], isLoading } = useProducts();
  const { data: currencySymbolSetting } = useLocalSetting("business_currency_symbol");
  const currencySymbol = (currencySymbolSetting?.setting_value as string) || "$";
  
  const [likedProducts, setLikedProducts] = useState<Set<string>>(new Set());
  const [productImageIndices, setProductImageIndices] = useState<Record<string, number>>({});

  const activeProducts = products.filter(p => p.is_active).slice(0, 20);

  const handleLike = async (productId: string, currentLikes: number) => {
    const isLiked = likedProducts.has(productId);
    const newLikes = isLiked ? currentLikes - 1 : currentLikes + 1;

    try {
      await supabase.from("products").update({ likes_count: newLikes }).eq("id", productId);
      
      setLikedProducts(prev => {
        const newSet = new Set(prev);
        if (isLiked) {
          newSet.delete(productId);
        } else {
          newSet.add(productId);
        }
        return newSet;
      });
    } catch (error) {
      console.error("Error updating likes:", error);
    }
  };

  const handlePrintThis = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  // Generate casual, conversational text for each product
  const getCasualDescription = (product: typeof activeProducts[0], index: number) => {
    const templates = [
      `Check out this awesome ${product.title.toLowerCase()}! Want me to print one in your favorite color?`,
      `Found this cool ${product.title.toLowerCase()}! Should I print one for you?`,
      `🐉 This ${product.title.toLowerCase()} looks amazing! Ready to print it?`,
      `😍 Love this ${product.title.toLowerCase()}! Want one printed?`,
      `✨ Just discovered this ${product.title.toLowerCase()}! Should we print it?`,
      `This ${product.title.toLowerCase()} is so cool! Want me to make one?`,
    ];
    return templates[index % templates.length];
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen">
      {/* Hero Section */}
      <section className="w-full bg-card rounded-2xl shadow-lg flex flex-col justify-center items-center text-center p-6 md:p-16 mx-auto max-w-4xl mt-6 mb-10 relative overflow-hidden border border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-[#3e47e0]/10 via-[#e0469a]/10 to-[#ffcc49]/10" />
        <div className="relative z-10 w-full">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img 
              src="/logo.png" 
              alt="hashtag3D" 
              className="h-12 md:h-16 w-auto"
            />
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-foreground">
            Discover. Scroll. Print.
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto mb-6">
            A fun, casual feed of cool 3D-printable finds. Tap to print — no catalog browsing needed.
          </p>
          <Button
            onClick={() => {
              document.getElementById("feed-start")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="px-6 py-3 bg-gradient-to-r from-[#3e47e0] to-[#e0469a] text-white rounded-xl text-base md:text-lg shadow-md hover:from-[#4e57f0] hover:to-[#f056aa] hover:scale-105 transition-all"
          >
            Show Me Something Cool ✨
          </Button>
        </div>
      </section>

      {/* Feed Cards */}
      <div id="feed-start" className="w-full max-w-xl mx-auto space-y-6 md:space-y-8 px-4 pb-10">
        {activeProducts.map((product, index) => {
          const isLiked = likedProducts.has(product.id);
          const likes = product.likes_count || 0;
          const images = product.images && product.images.length > 0 ? product.images : [defaultProductImage];
          const hasMultipleImages = images.length > 1;
          const casualText = getCasualDescription(product, index);

          const currentImageIndex = productImageIndices[product.id] || 0;
          const currentImage = images[currentImageIndex] || defaultProductImage;

          const handleImageClick = (e: React.MouseEvent) => {
            e.stopPropagation();
            if (hasMultipleImages) {
              const nextIndex = (currentImageIndex + 1) % images.length;
              setProductImageIndices(prev => ({ ...prev, [product.id]: nextIndex }));
            } else {
              handlePrintThis(product.id);
            }
          };

          const handleDotClick = (imgIndex: number, e: React.MouseEvent) => {
            e.stopPropagation();
            setProductImageIndices(prev => ({ ...prev, [product.id]: imgIndex }));
          };

          return (
            <div
              key={product.id}
              className="bg-card rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-border"
            >
              {/* Product Image */}
              <div
                className="h-64 md:h-80 bg-muted relative overflow-hidden cursor-pointer group"
                onClick={() => handlePrintThis(product.id)}
              >
                <img
                  src={currentImage}
                  alt={product.title}
                  onClick={handleImageClick}
                  className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${hasMultipleImages ? 'cursor-pointer' : ''}`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                {/* Customizable Badge */}
                {product.is_customizable && (
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent text-accent-foreground text-xs font-semibold z-10">
                    <Sparkles className="w-3 h-3" />
                    Customizable
                  </div>
                )}

                {/* Image Dots Indicator */}
                {hasMultipleImages && (
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                    {images.map((_, imgIndex) => (
                      <button
                        key={imgIndex}
                        onClick={(e) => handleDotClick(imgIndex, e)}
                        className={`w-1.5 h-1.5 rounded-full transition-all ${
                          imgIndex === currentImageIndex
                            ? "bg-white w-4"
                            : "bg-white/50 hover:bg-white/75"
                        }`}
                        aria-label={`Go to image ${imgIndex + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Text + Actions */}
              <div className="p-4 md:p-5 space-y-3 md:space-y-4">
                <p className="text-base md:text-lg text-foreground leading-relaxed">
                  {casualText}
                </p>

                <div className="flex items-center justify-between gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLike(product.id, likes);
                    }}
                    className="hover:scale-110 transition-transform duration-200 flex-shrink-0 p-1"
                    aria-label="Like"
                  >
                    <Heart 
                      className={`w-5 h-5 md:w-6 md:h-6 ${isLiked ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`}
                    />
                  </button>

                  <div className="text-sm md:text-base font-semibold text-primary">
                    {currencySymbol}{Number(product.price).toFixed(2)}
                  </div>

                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrintThis(product.id);
                    }}
                    className="bg-gradient-to-r from-[#3e47e0] to-[#e0469a] text-white px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-sm md:text-base hover:from-[#4e57f0] hover:to-[#f056aa] hover:scale-105 transition-all flex-shrink-0"
                  >
                    Print This
                  </Button>
                </div>

                {/* Likes count */}
                {likes > 0 && (
                  <div className="text-xs md:text-sm text-muted-foreground flex items-center gap-1">
                    <Heart className="w-3 h-3 md:w-4 md:h-4 fill-red-500 text-red-500" />
                    <span>{likes} {likes === 1 ? 'like' : 'likes'}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Material Preview Section */}
      {activeProducts.length > 0 && (
        <section className="w-full max-w-xl mx-auto bg-card rounded-2xl shadow-lg p-4 md:p-6 mb-10 border border-border">
          <h2 className="text-xl md:text-2xl font-semibold mb-4 text-foreground">Available Materials & Colors</h2>
          <div className="grid grid-cols-5 md:grid-cols-10 gap-2 md:gap-3">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="h-12 md:h-16 rounded-xl bg-gradient-to-br from-muted to-muted/80 flex items-center justify-center text-xs font-medium text-muted-foreground hover:scale-105 transition-transform cursor-pointer border border-border"
              >
                PLA
              </div>
            ))}
          </div>
          <p className="text-xs md:text-sm text-muted-foreground mt-4 text-center">
            Choose from a wide variety of colors and materials when you order
          </p>
        </section>
      )}

      {/* Empty State */}
      {activeProducts.length === 0 && !isLoading && (
        <div className="text-center py-20 px-4">
          <p className="text-muted-foreground text-base md:text-lg">No products available yet. Check back soon!</p>
        </div>
      )}
    </div>
  );
}

