import { useState, useMemo, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Copy, Truck, MapPin, Tag, PartyPopper, Package, Instagram, Youtube, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useCart } from "@/contexts/CartContext";
import { useDeliveryAreas, useLocalSetting } from "@/hooks/useLocalSettings";
import { useCreateOrder } from "@/hooks/useOrders";
import { toast } from "@/hooks/use-toast";
import defaultProductImage from "@/assets/default-product.jpg";

type FulfillmentType = "pickup" | "delivery" | "shipping";

export default function Checkout() {
  const navigate = useNavigate();
  const { items, clearCart } = useCart();
  const { data: deliveryAreas } = useDeliveryAreas();
  const { data: currencySymbolSetting } = useLocalSetting("business_currency_symbol");
  const { data: deliveryFeeSetting } = useLocalSetting("delivery_fee");
  const { data: promoCodeSetting } = useLocalSetting("free_delivery_promo_code");
  const { data: freeShippingThresholdSetting } = useLocalSetting("free_shipping_threshold");
  const { data: shippingFeeSetting } = useLocalSetting("shipping_fee");
  const { data: promoEnabledSetting } = useLocalSetting("promo_enabled");
  const { data: promoMessageSetting } = useLocalSetting("promo_message");
  const { data: instagramSetting } = useLocalSetting("instagram_url");
  const { data: tiktokSetting } = useLocalSetting("tiktok_url");
  const { data: youtubeSetting } = useLocalSetting("youtube_url");
  const { data: defaultCountrySetting } = useLocalSetting("default_country");
  const createOrder = useCreateOrder();

  const currencySymbol = (currencySymbolSetting?.setting_value as string) || "$";
  const deliveryFee = (deliveryFeeSetting?.setting_value as number) || 5.00;
  const validPromoCode = ((promoCodeSetting?.setting_value as string) || "").toUpperCase();
  const freeShippingThreshold = (freeShippingThresholdSetting?.setting_value as number) || 15;
  const baseShippingFee = (shippingFeeSetting?.setting_value as number) || 8;
  const promoEnabled = promoEnabledSetting?.setting_value !== false;
  const promoMessage = (promoMessageSetting?.setting_value as string) || "Like & follow us on Instagram/TikTok for FREE delivery! Limited time offer.";
  const instagramUrl = (instagramSetting?.setting_value as string) || "";
  const tiktokUrl = (tiktokSetting?.setting_value as string) || "";
  const youtubeUrl = (youtubeSetting?.setting_value as string) || "";
  const defaultCountry = (defaultCountrySetting?.setting_value as string) || "United States";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    addressLine1: "",
    city: "",
    state: "",
    country: "United States",
    notes: "",
  });
  const [followedForFreeShipping, setFollowedForFreeShipping] = useState(false);
  const [fulfillmentType, setFulfillmentType] = useState<FulfillmentType>("pickup");
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);

  // Set default country from settings
  useEffect(() => {
    if (defaultCountry && formData.country === "United States") {
      setFormData(prev => ({ ...prev, country: defaultCountry }));
    }
  }, [defaultCountry]);
  const [orderNumbers, setOrderNumbers] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Compute full address from parts
  const fullAddress = useMemo(() => {
    const parts = [formData.addressLine1, formData.city, formData.state, formData.country].filter(Boolean);
    return parts.join(", ");
  }, [formData.addressLine1, formData.city, formData.state, formData.country]);

  // Auto-detect if address is in delivery zone (checks both city AND state)
  const detectedZone = useMemo(() => {
    if (!formData.city || !formData.state || !deliveryAreas) return null;
    const cityLower = formData.city.toLowerCase().trim();
    const stateLower = formData.state.toLowerCase().trim();
    
    return deliveryAreas.find(area => {
      const parts = area.split(",").map(p => p.trim().toLowerCase());
      const areaCity = parts[0] || "";
      const areaState = parts[1] || "";
      // Match city name exactly and state abbreviation/name
      return cityLower === areaCity && (stateLower === areaState || stateLower.startsWith(areaState) || areaState.startsWith(stateLower));
    }) || null;
  }, [formData.city, formData.state, deliveryAreas]);

  const isInDeliveryArea = !!detectedZone;

  // Auto-set fulfillment type based on detection
  useEffect(() => {
    if (isInDeliveryArea) {
      setFulfillmentType("pickup");
    } else if (formData.city.length > 2) {
      setFulfillmentType("shipping");
    }
  }, [isInDeliveryArea, formData.city]);

  // Apply free shipping when user confirms they followed
  useEffect(() => {
    if (followedForFreeShipping && fulfillmentType === "delivery") {
      setPromoApplied(true);
    }
  }, [followedForFreeShipping, fulfillmentType]);

  const subtotal = items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0);
  
  const shippingCost = useMemo(() => {
    if (fulfillmentType === "pickup") return 0;
    if (fulfillmentType === "delivery") {
      return (promoApplied || followedForFreeShipping) ? 0 : deliveryFee;
    }
    // Shipping - check free threshold
    if (subtotal >= freeShippingThreshold) return 0;
    return baseShippingFee;
  }, [fulfillmentType, promoApplied, followedForFreeShipping, deliveryFee, subtotal, freeShippingThreshold, baseShippingFee]);

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
          const deliveryLocation = detectedZone || "Shipping";
          const deliveryAddress = fulfillmentType === "pickup" 
            ? `PICKUP - ${detectedZone}` 
            : fullAddress;

          const result = await createOrder.mutateAsync({
            product_id: item.product_id,
            customer_name: formData.name,
            customer_email: formData.email,
            customer_phone: formData.phone || undefined,
            delivery_location: deliveryLocation,
            delivery_address: deliveryAddress,
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

  const canSubmit = formData.name && formData.email && formData.addressLine1 && formData.city && formData.state;

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
            {/* Step 1: Contact Info */}
            <div className="p-6 rounded-xl border bg-card space-y-4">
              <h2 className="text-lg font-semibold text-foreground">1. Contact Information</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Your name"
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
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone (optional)</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>

            {/* Step 2: Address (Auto-detect) */}
            <div className="p-6 rounded-xl border bg-card space-y-4">
              <h2 className="text-lg font-semibold text-foreground">2. Delivery Address</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="addressLine1">Address Line 1 *</Label>
                  <Input
                    id="addressLine1"
                    value={formData.addressLine1}
                    onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                    placeholder="123 Main Street"
                    required
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="Atlanta"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      placeholder="GA"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    placeholder="United States"
                  />
                  <p className="text-xs text-muted-foreground">We currently deliver only in {defaultCountry}</p>
                </div>
              </div>

              {/* Auto-detection message */}
              {formData.city.length > 2 && (
                <>
                  {isInDeliveryArea ? (
                    <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20 flex items-start gap-3">
                      <PartyPopper className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-green-700 dark:text-green-400">
                          🎉 Good news! We deliver to your area.
                        </p>
                        <p className="text-sm text-green-600 dark:text-green-500">
                          You can choose Pickup (FREE) or Delivery ({currencySymbol}{deliveryFee.toFixed(2)}).
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-start gap-3">
                      <Package className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-blue-700 dark:text-blue-400">
                          📦 We don't deliver to your address, but we can ship it!
                        </p>
                        <p className="text-sm text-blue-600 dark:text-blue-500">
                          {subtotal >= freeShippingThreshold 
                            ? "You qualify for FREE shipping!" 
                            : `Free shipping on orders over ${currencySymbol}${freeShippingThreshold}.`}
                        </p>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Step 3: Delivery Options (only show after address entered) */}
            {formData.city.length > 2 && (
              <div className="p-6 rounded-xl border bg-card space-y-4">
                <h2 className="text-lg font-semibold text-foreground">3. Delivery Option</h2>
                
                <RadioGroup value={fulfillmentType} onValueChange={(v) => setFulfillmentType(v as FulfillmentType)}>
                  {/* Pickup - only if in delivery area */}
                  {isInDeliveryArea && (
                    <div className="flex items-center space-x-3 p-4 rounded-lg border hover:bg-muted/50 cursor-pointer">
                      <RadioGroupItem value="pickup" id="pickup" />
                      <Label htmlFor="pickup" className="flex-1 cursor-pointer">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-primary" />
                          <span className="font-medium">Pickup</span>
                          <span className="ml-auto text-green-600 font-semibold">FREE</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">Pick up from our location in {detectedZone}</p>
                      </Label>
                    </div>
                  )}
                  
                  {/* Delivery - only if in delivery area */}
                  {isInDeliveryArea && (
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
                        <p className="text-sm text-muted-foreground mt-1">We'll deliver to your address</p>
                      </Label>
                    </div>
                  )}

                  {/* Shipping - only if NOT in delivery area */}
                  {!isInDeliveryArea && (
                    <div className="flex items-center space-x-3 p-4 rounded-lg border hover:bg-muted/50 cursor-pointer">
                      <RadioGroupItem value="shipping" id="shipping" />
                      <Label htmlFor="shipping" className="flex-1 cursor-pointer">
                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4 text-primary" />
                          <span className="font-medium">Shipping</span>
                          <span className="ml-auto font-semibold">
                            {subtotal >= freeShippingThreshold ? (
                              <span className="text-green-600">FREE</span>
                            ) : (
                              <span>{currencySymbol}{baseShippingFee.toFixed(2)}</span>
                            )}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {subtotal >= freeShippingThreshold 
                            ? "Free shipping applied!" 
                            : `Add ${currencySymbol}${(freeShippingThreshold - subtotal).toFixed(2)} more for free shipping`}
                        </p>
                      </Label>
                    </div>
                  )}
                </RadioGroup>
              </div>
            )}

            {/* Step 4: Free Shipping Promo (only for local delivery when promo is enabled) */}
            {fulfillmentType === "delivery" && !promoApplied && promoEnabled && (
              <div className="p-6 rounded-xl border bg-card space-y-4">
                <h2 className="text-lg font-semibold text-foreground">4. Get FREE Delivery!</h2>
                <div className="p-4 rounded-lg bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20">
                  <p className="text-foreground mb-4">
                    🎉 <strong>One-time FREE delivery offer!</strong><br/>
                    <span className="text-sm text-muted-foreground">Like & subscribe to any of our channels and get free delivery today!</span>
                  </p>
                  
                  {/* Social Media Icons - Always show all 3 */}
                  <div className="flex items-center gap-3 mb-4">
                    {/* Instagram */}
                    <a 
                      href={instagramUrl || "#"} 
                      target={instagramUrl ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      onClick={(e) => !instagramUrl && e.preventDefault()}
                      className={`p-3 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 text-white transition-transform ${instagramUrl ? "hover:scale-110 cursor-pointer" : "opacity-50 cursor-not-allowed"}`}
                      title={instagramUrl ? "Follow us on Instagram" : "Instagram (not configured)"}
                    >
                      <Instagram className="w-6 h-6" />
                    </a>
                    
                    {/* TikTok */}
                    <a 
                      href={tiktokUrl || "#"} 
                      target={tiktokUrl ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      onClick={(e) => !tiktokUrl && e.preventDefault()}
                      className={`p-3 rounded-lg bg-black text-white transition-transform ${tiktokUrl ? "hover:scale-110 cursor-pointer" : "opacity-50 cursor-not-allowed"}`}
                      title={tiktokUrl ? "Follow us on TikTok" : "TikTok (not configured)"}
                    >
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                      </svg>
                    </a>
                    
                    {/* YouTube */}
                    <a 
                      href={youtubeUrl || "#"} 
                      target={youtubeUrl ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      onClick={(e) => !youtubeUrl && e.preventDefault()}
                      className={`p-3 rounded-lg bg-red-600 text-white transition-transform ${youtubeUrl ? "hover:scale-110 cursor-pointer" : "opacity-50 cursor-not-allowed"}`}
                      title={youtubeUrl ? "Subscribe on YouTube" : "YouTube (not configured)"}
                    >
                      <Youtube className="w-6 h-6" />
                    </a>
                  </div>

                  {/* Checkbox confirmation */}
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-background/50 border">
                    <Checkbox 
                      id="followedConfirmation"
                      checked={followedForFreeShipping}
                      onCheckedChange={(checked) => setFollowedForFreeShipping(checked === true)}
                      className="mt-0.5"
                    />
                    <Label htmlFor="followedConfirmation" className="text-sm cursor-pointer leading-relaxed">
                      <span className="font-semibold text-primary">Yes!! I just did!</span> I liked & subscribed on one of the channels above. I want my FREE delivery! 🎁
                    </Label>
                  </div>
                </div>

                {/* Manual promo code option */}
                {validPromoCode && (
                  <div className="pt-4 border-t">
                    <p className="text-xs text-muted-foreground mb-2">Or enter promo code manually:</p>
                    <div className="flex gap-2">
                      <Input
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="Enter promo code"
                        className="text-sm"
                      />
                      <Button type="button" variant="outline" size="sm" onClick={handleApplyPromo}>
                        <Tag className="w-4 h-4 mr-1" />
                        Apply
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {(promoApplied || followedForFreeShipping) && fulfillmentType === "delivery" && (
              <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-700 dark:text-green-400 flex items-center gap-2">
                <Check className="w-5 h-5" />
                <span>{followedForFreeShipping ? "Thanks for following us! FREE delivery applied! 🎉" : "Promo code applied! Delivery fee waived."}</span>
              </div>
            )}

            {/* Step 5: Order Notes */}
            <div className="p-6 rounded-xl border bg-card space-y-4">
              <h2 className="text-lg font-semibold text-foreground">{fulfillmentType === "delivery" && promoEnabled ? "5" : "4"}. Any Special Instructions?</h2>
              <Textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                placeholder="Optional notes..."
              />
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              size="lg" 
              className="w-full text-lg py-6" 
              disabled={isSubmitting || !canSubmit}
            >
              {isSubmitting ? "Submitting..." : `Place Order – ${currencySymbol}${total.toFixed(2)}`}
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
                    {fulfillmentType === "pickup" ? "Pickup" : fulfillmentType === "delivery" ? "Delivery" : "Shipping"}
                  </span>
                  <span className={shippingCost === 0 ? "text-green-600 font-medium" : "text-foreground"}>
                    {shippingCost === 0 ? "FREE" : `${currencySymbol}${shippingCost.toFixed(2)}`}
                  </span>
                </div>
                {promoApplied && (
                  <div className="flex justify-between text-green-600">
                    <span>Promo ({validPromoCode})</span>
                    <span>-{currencySymbol}{deliveryFee.toFixed(2)}</span>
                  </div>
                )}
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
