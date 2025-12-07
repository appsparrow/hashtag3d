import { useState } from "react";
import { Heart, ShoppingBag, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Product } from "@/hooks/useProducts";

interface ProductCardProps {
  product: Product;
  onOrder: (product: Product) => void;
}

export function ProductCard({ product, onOrder }: ProductCardProps) {
  const [likes, setLikes] = useState(product.likes_count);
  const [liked, setLiked] = useState(false);

  const handleLike = () => {
    setLikes(liked ? likes - 1 : likes + 1);
    setLiked(!liked);
  };

  const imageUrl =
    product.images?.[0] ||
    "https://images.unsplash.com/https://unsplash.com/photos/a-green-toy-dinosaur-7Nm3E3Dz0io?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=400&h=400&fit=crop";

  return (
    <Card className="group overflow-hidden card-hover">
      <div className="relative aspect-square overflow-hidden">
        <img
          src={imageUrl}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {product.is_customizable && (
          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent text-accent-foreground text-xs font-semibold">
            <Sparkles className="w-3 h-3" />
            Customizable
          </div>
        )}

        <button
          onClick={handleLike}
          className={`absolute top-3 right-3 p-2.5 rounded-full transition-all duration-300 ${
            liked
              ? "bg-terracotta text-primary-foreground scale-110"
              : "bg-card/90 backdrop-blur-sm text-muted-foreground hover:text-terracotta hover:scale-110"
          }`}
        >
          <Heart className={`w-4 h-4 ${liked ? "fill-current" : ""}`} />
        </button>
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
          <Button variant="order" size="sm" onClick={() => onOrder(product)}>
            <ShoppingBag className="w-4 h-4" />
            Order
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
