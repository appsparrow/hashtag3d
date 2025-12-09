import { useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Copy, Truck, MapPin, Tag, PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCart } from "@/contexts/CartContext";
import { useDeliveryAreas, useLocalSetting } from "@/hooks/useLocalSettings";
import { useCreateOrder } from "@/hooks/useOrders";
import { toast } from "@/hooks/use-toast";
import defaultProductImage from "@/assets/default-product.jpg";

export default function Checkout() {
  const navigate = useNavigate();
  const { items, clearCart } = useCart();
  const { data: deliveryAreas } = useDeliveryAreas();
  const { data: currencySymbolSetting } = useLocalSetting("business_currency_symbol");
  const { data: deliveryFeeSetting } = useLocalSetting("delivery_fee");
  const { data: promoCodeSetting } = useLocalSetting("free_delivery_promo_code");
  const createOrder = useCreateOrder();

  const currencySymbol = (currencySymbolSetting?.setting_value as string) || "$";
  const deliveryFee = (deliveryFeeSetting?.setting_value as number) || 5.00;
  const validPromoCode = ((promoCodeSetting?.setting_value as string) || "").toUpperCase();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    deliveryArea: "",
    notes: "",
  });
  const [fulfillmentType, setFulfillmentType] = useState<"pickup" | "delivery">("pickup");
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [orderNumbers, setOrderNumbers] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isInDeliveryArea = formData.deliveryArea && deliveryAreas?.includes(formData.deliveryArea);
  
  const shippingCost = useMemo(() => {
    if (fulfillmentType === "pickup") return 0;
    if (promoApplied) return 0;
    return deliveryFee;
  }, [fulfillmentType, promoApplied, deliveryFee]);

  const subtotal = items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0);
  const total = subtotal + shippingCost;

  const handleApplyPromo = () => {
    if (promoCode.toUpperCase() === validPromoCode && validPromoCode) {
      setPromoApplied(true);
      toast({ title: "Promo Applied!", description: "Delivery fee waived!" });
    } else {
      toast({ title: "Invalid Code", description: "Please check and try again.", variant: "destructive" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    setIsSubmitting(true);
    const createdOrderNumbers: string[] = [];

    try {
      for (const item of items) {
        for (let i = 0; i < item.quantity; i++) {
          const result = await createOrder.mutateAsync({
            product_id: item.product_id,
            customer_name: formData.name,
            customer_email: formData.email,
            customer_phone: formData.phone || undefined,
            delivery_location: formData.deliveryArea || deliveryAreas?.[0] || "Alpharetta, GA",
            delivery_address: fulfillmentType === "delivery" ? formData.address : `PICKUP - ${formData.deliveryArea}`,
            shipping_cost: i === 0 && items.indexOf(item) === 0 ? shippingCost : 0,
            product_price: item.unit_price,
            total_amount: item.unit_price + (i === 0 && items.indexOf(item) === 0 ? shippingCost : 0),
            selected_color: item.selected_colors.join(", ") || undefined,
            selected_material: item.selected_material || undefined,
            selected_size: item.selected_size || undefined,
            customization_details: item.customization_details || undefined,
            notes: formData.notes || undefined,
          });
          createdOrderNumbers.push(result.order_number || "");
        }
      }

      setOrderNumbers(createdOrderNumbers.filter(n => n));
      await clearCart();
    } catch (error) {
      toast({ title: "Error", description: "Failed to submit order", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyOrderNumbers = () => {
    navigator.clipboard.writeText(orderNumbers.join(", "));
    toast({ title: "Copied!", description: "Order numbers copied to clipboard." });
  };

  // Success view
  if (orderNumbers.length > 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10 text-green-500" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-foreground">Order Submitted!</h2>
            <p className="text-muted-foreground">
              Thanks {formData.name}! We'll contact you at {formData.email} soon.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-muted/50 border border-border">
            <p className="text-sm text-muted-foreground mb-2">Your Order Number{orderNumbers.length > 1 ? "s" : ""}</p>
            <div className="flex items-center justify-center gap-2 flex-wrap">
              {orderNumbers.map((num, i) => (
                <span key={i} className="text-lg font-mono font-bold text-primary">{num}</span>
              ))}
              <Button variant="ghost" size="icon" onClick={copyOrderNumbers}>
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Save these to track your order status!
            </p>
          </div>

          <Button onClick={() => navigate("/")} className="w-full">
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    navigate("/cart");
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <Link to="/cart" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Cart
        </Link>

        <h1 className="text-3xl font-bold text-foreground mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
            <div className="p-6 rounded-xl border bg-card space-y-4">
              <h2 className="text-lg font-semibold text-foreground">Contact Information</h2>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>

            {/* Delivery Area Selection */}
            <div className="p-6 rounded-xl border bg-card space-y-4">
              <h2 className="text-lg font-semibold text-foreground">Select Your Area</h2>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {deliveryAreas?.map((area) => (
                  <Button
                    key={area}
                    type="button"
                    variant={formData.deliveryArea === area ? "default" : "outline"}
                    className="justify-start"
                    onClick={() => setFormData({ ...formData, deliveryArea: area })}
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    {area}
                  </Button>
                ))}
              </div>

              {/* Woohoo message for local areas */}
              {isInDeliveryArea && (
                <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20 flex items-start gap-3">
                  <PartyPopper className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-green-700 dark:text-green-400">
                      Woohoo! You're in {formData.deliveryArea}!
                    </p>
                    <p className="text-sm text-green-600 dark:text-green-500">
                      You can pick it up for FREE, or get it delivered for {currencySymbol}{deliveryFee.toFixed(2)}.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Fulfillment Options - only show if in delivery area */}
            {isInDeliveryArea && (
              <div className="p-6 rounded-xl border bg-card space-y-4">
                <h2 className="text-lg font-semibold text-foreground">How would you like to receive your order?</h2>
                
                <RadioGroup value={fulfillmentType} onValueChange={(v) => setFulfillmentType(v as "pickup" | "delivery")}>
                  <div className="flex items-center space-x-3 p-4 rounded-lg border hover:bg-muted/50 cursor-pointer">
                    <RadioGroupItem value="pickup" id="pickup" />
                    <Label htmlFor="pickup" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span className="font-medium">Free Pickup</span>
                        <span className="ml-auto text-green-600 font-semibold">FREE</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">Pick up from our location in {formData.deliveryArea}</p>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-4 rounded-lg border hover:bg-muted/50 cursor-pointer">
                    <RadioGroupItem value="delivery" id="delivery" />
                    <Label htmlFor="delivery" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <Truck className="w-4 h-4 text-primary" />
                        <span className="font-medium">Local Delivery</span>
                        <span className="ml-auto font-semibold">
                          {promoApplied ? (
                            <span className="text-green-600">FREE</span>
                          ) : (
                            <span>{currencySymbol}{deliveryFee.toFixed(2)}</span>
                          )}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">We'll deliver to your address in {formData.deliveryArea}</p>
                    </Label>
                  </div>
                </RadioGroup>

                {/* Delivery address and promo code - only for delivery */}
                {fulfillmentType === "delivery" && (
                  <div className="space-y-4 pt-4 border-t">
                    <div className="space-y-2">
                      <Label htmlFor="address">Delivery Address *</Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        placeholder="Enter your full address"
                        required={fulfillmentType === "delivery"}
                      />
                    </div>

                    {/* Promo Code */}
                    {!promoApplied && validPromoCode && (
                      <div className="space-y-2">
                        <Label htmlFor="promo">Have a promo code?</Label>
                        <div className="flex gap-2">
                          <Input
                            id="promo"
                            value={promoCode}
                            onChange={(e) => setPromoCode(e.target.value)}
                            placeholder="Enter code to waive delivery fee"
                          />
                          <Button type="button" variant="outline" onClick={handleApplyPromo}>
                            <Tag className="w-4 h-4 mr-2" />
                            Apply
                          </Button>
                        </div>
                      </div>
                    )}

                    {promoApplied && (
                      <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-700 dark:text-green-400 text-sm">
                        ✓ Promo code applied! Delivery fee waived.
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Notes */}
            <div className="p-6 rounded-xl border bg-card space-y-4">
              <div className="space-y-2">
                <Label htmlFor="notes">Order Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  placeholder="Any special instructions..."
                />
              </div>
            </div>

            <Button 
              type="submit" 
              size="lg" 
              className="w-full" 
              disabled={isSubmitting || !formData.deliveryArea}
            >
              {isSubmitting ? "Submitting..." : `Place Order - ${currencySymbol}${total.toFixed(2)}`}
            </Button>
          </form>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 p-6 rounded-xl border bg-card space-y-4">
              <h2 className="text-lg font-semibold text-foreground">Order Summary</h2>
              
              <div className="space-y-3">
                {items.map((item) => {
                  const imageUrl = item.product?.images?.[0] || defaultProductImage;
                  return (
                    <div key={item.id} className="flex gap-3">
                      <img
                        src={imageUrl}
                        alt={item.product?.title || "Product"}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground text-sm truncate">
                          {item.product?.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Qty: {item.quantity}
                        </p>
                        <p className="text-sm font-medium text-primary">
                          {currencySymbol}{(item.unit_price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-4 border-t space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground">{currencySymbol}{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {fulfillmentType === "pickup" ? "Pickup" : "Delivery"}
                  </span>
                  <span className={shippingCost === 0 ? "text-green-600 font-medium" : "text-foreground"}>
                    {shippingCost === 0 ? "FREE" : `${currencySymbol}${shippingCost.toFixed(2)}`}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span className="text-primary">{currencySymbol}{total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
