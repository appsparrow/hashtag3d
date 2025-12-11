import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useLocalSetting } from "@/hooks/useLocalSettings";
import defaultProductImage from "@/assets/default-product.jpg";

export default function Cart() {
  const navigate = useNavigate();
  const { items, itemCount, isLoading, updateQuantity, removeItem } = useCart();
  const { data: currencySymbolSetting } = useLocalSetting("business_currency_symbol");
  const currencySymbol = (currencySymbolSetting?.setting_value as string) || "$";

  const subtotal = items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0);
  const shippingCost = 5.00;
  const total = subtotal + shippingCost;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto max-w-4xl px-3 sm:px-4 py-4 sm:py-8">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 sm:mb-8">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm sm:text-base">Continue Shopping</span>
          </Link>

          <div className="text-center py-12 sm:py-20 px-4">
            <ShoppingBag className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-muted-foreground/50 mb-4" />
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">Your cart is empty</h2>
            <p className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8">Add some items to get started!</p>
            <Button onClick={() => navigate("/")} className="text-sm sm:text-base">Browse Products</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-4xl px-3 sm:px-4 py-4 sm:py-8">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 sm:mb-6 md:mb-8">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm sm:text-base">Continue Shopping</span>
        </Link>

        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-4 sm:mb-6 md:mb-8">
          Your Cart ({itemCount} item{itemCount !== 1 ? "s" : ""})
        </h1>

        <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-3 md:space-y-4 order-2 lg:order-1">
            {items.map((item) => {
              const imageUrl = item.product?.images?.[0] || defaultProductImage;
              return (
                <div key={item.id} className="flex gap-3 md:gap-4 p-3 md:p-4 rounded-xl border bg-card">
                  <img
                    src={imageUrl}
                    alt={item.product?.title || "Product"}
                    className="w-16 h-16 md:w-24 md:h-24 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm md:text-base text-foreground truncate">
                      {item.product?.title || "Product"}
                    </h3>
                    <div className="text-xs md:text-sm text-muted-foreground mt-1 space-y-0.5">
                      <p>Size: {item.selected_size} | Material: {item.selected_material}</p>
                      {item.selected_colors.length > 0 && (
                        <p className="truncate">Colors: {item.selected_colors.join(", ")}</p>
                      )}
                      {item.customization_details && (
                        <p className="truncate">Custom: {item.customization_details}</p>
                      )}
                    </div>
                    <p className="text-primary font-medium mt-1 md:mt-2 text-sm md:text-base">
                      {currencySymbol}{item.unit_price.toFixed(2)} each
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-destructive h-8 w-8"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className="w-3 h-3 md:w-4 md:h-4" />
                    </Button>

                    <div className="flex items-center border rounded-lg">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 md:h-8 md:w-8"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="w-6 md:w-8 text-center text-xs md:text-sm font-medium">{item.quantity}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 md:h-8 md:w-8"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>

                    <p className="font-semibold text-foreground text-sm md:text-base">
                      {currencySymbol}{(item.unit_price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1 order-1 lg:order-2">
            <div className="lg:sticky lg:top-8 p-3 sm:p-4 md:p-6 rounded-xl border bg-card space-y-3 sm:space-y-4">
              <h2 className="text-sm sm:text-base md:text-lg font-semibold text-foreground">Order Summary</h2>
              
              <div className="space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground font-medium">{currencySymbol}{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-foreground font-medium">{currencySymbol}{shippingCost.toFixed(2)}</span>
                </div>
              </div>

              <div className="pt-3 sm:pt-4 border-t">
                <div className="flex justify-between text-base sm:text-lg font-semibold">
                  <span>Total</span>
                  <span className="text-primary">{currencySymbol}{total.toFixed(2)}</span>
                </div>
              </div>

              <Button className="w-full text-sm sm:text-base py-5 sm:py-6" size="lg" onClick={() => navigate("/checkout")}>
                Proceed to Checkout
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
