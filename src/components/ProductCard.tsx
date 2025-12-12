import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Eye, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Product } from "@/hooks/useProducts";
import { supabase } from "@/integrations/supabase/client";
import defaultProductImage from "@/assets/default-product.jpg";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const navigate = useNavigate();
  const [likes, setLikes] = useState(product.likes_count);
  const [liked, setLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = product.images && product.images.length > 0 ? product.images : [defaultProductImage];
  const hasMultipleImages = images.length > 1;
  const currentImage = images[currentImageIndex] || defaultProductImage;

  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasMultipleImages) {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLiking) return;

    setIsLiking(true);
    const newLikeCount = liked ? likes - 1 : likes + 1;

    try {
      const { error } = await supabase.from("products").update({ likes_count: newLikeCount }).eq("id", product.id);

      if (!error) {
        setLikes(newLikeCount);
        setLiked(!liked);
      }
    } catch (error) {
      console.error("Error updating likes:", error);
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <Card className="group overflow-hidden card-hover">
      <div 
        className="relative aspect-square overflow-hidden"
        onClick={() => !hasMultipleImages && navigate(`/product/${product.id}`)}
      >
        <img
          src={currentImage}
          alt={product.title}
          onClick={hasMultipleImages ? handleImageClick : undefined}
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${hasMultipleImages ? 'cursor-pointer' : 'cursor-pointer'}`}
        />

        {product.is_customizable && (
          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent text-accent-foreground text-xs font-semibold">
            <Sparkles className="w-3 h-3" />
            Customizable
          </div>
        )}

        <button
          onClick={handleLike}
          className={`absolute top-3 right-3 p-2.5 rounded-full transition-all duration-300 z-10 ${
            liked
              ? "bg-terracotta text-primary-foreground scale-110"
              : "bg-card/90 backdrop-blur-sm text-muted-foreground hover:text-terracotta hover:scale-110"
          }`}
        >
          <Heart className={`w-4 h-4 ${liked ? "fill-current" : ""}`} />
        </button>

        {/* Image Dots Indicator */}
        {hasMultipleImages && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex(index);
                }}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  index === currentImageIndex
                    ? "bg-white w-4"
                    : "bg-white/50 hover:bg-white/75"
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      <CardContent className="p-5 space-y-4">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-lg leading-tight text-foreground group-hover:text-primary transition-colors">
              {product.title}
            </h3>
            <span className="text-lg font-bold text-primary whitespace-nowrap">
              ${Number(product.price).toFixed(2)}
            </span>
          </div>
          {product.description && <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>}
        </div>

        {product.personalization_options && (
          <p className="text-xs font-medium text-accent">✨ {product.personalization_options}</p>
        )}

        <div className="flex items-center justify-between pt-2">
          <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Heart className="w-4 h-4" />
            {likes}
          </span>
          <Button variant="order" size="sm" onClick={() => navigate(`/product/${product.id}`)}>
            <Eye className="w-4 h-4" />
            View
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
