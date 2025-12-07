import { useState } from "react";
import { Heart, ShoppingBag, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Product } from "@/data/products";

interface ProductCardProps {
  product: Product;
  onOrder: (product: Product) => void;
}

export function ProductCard({ product, onOrder }: ProductCardProps) {
  const [likes, setLikes] = useState(product.likes);
  const [liked, setLiked] = useState(false);

  const handleLike = () => {
    if (liked) {
      setLikes(likes - 1);
    } else {
      setLikes(likes + 1);
    }
    setLiked(!liked);
  };

  return (
    <Card className="group overflow-hidden card-hover">
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Category Badge */}
        {product.category === "customizable" && (
          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent text-accent-foreground text-xs font-semibold">
            <Sparkles className="w-3 h-3" />
            Customizable
          </div>
        )}

        {/* Like Button */}
        <button
          onClick={handleLike}
          className={`absolute top-3 right-3 p-2.5 rounded-full transition-all duration-300 ${
            liked 
              ? "bg-terracotta text-primary-foreground scale-110" 
              : "bg-card/90 backdrop-blur-sm text-muted-foreground hover:text-terracotta hover:scale-110"
          }`}
          aria-label={liked ? "Unlike" : "Like"}
        >
          <Heart className={`w-4 h-4 ${liked ? "fill-current" : ""}`} />
        </button>
      </div>

      <CardContent className="p-5 space-y-4">
        {/* Product Info */}
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-lg leading-tight text-foreground group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            <span className="text-lg font-bold text-primary whitespace-nowrap">
              ${product.price.toFixed(2)}
            </span>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {product.description}
          </p>
        </div>

        {/* Customization Type */}
        {product.customizationType && (
          <p className="text-xs font-medium text-accent">
            ✨ Customize: {product.customizationType}
          </p>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Heart className="w-4 h-4" />
            {likes}
          </span>
          <Button variant="order" size="sm" onClick={() => onOrder(product)}>
            <ShoppingBag className="w-4 h-4" />
            Order
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
