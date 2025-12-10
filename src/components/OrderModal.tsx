import { useState, useMemo, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Product } from "@/hooks/useProducts";
import { useCreateOrder } from "@/hooks/useOrders";
import { useDeliveryAreas, useLocalSetting } from "@/hooks/useLocalSettings";
import { usePricingSettings, useColors, MaterialCategory } from "@/hooks/usePricing";
import { toast } from "@/hooks/use-toast";
import { Send, Sparkles, CheckCircle2, Copy } from "lucide-react";

interface OrderModalProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OrderModal({ product, open, onOpenChange }: OrderModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    deliveryLocation: "",
    colors: [] as string[],
    material: "standard",
    size: "small",
    customization: "",
    notes: "",
  });
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  
  const createOrder = useCreateOrder();
  const { data: deliveryAreas } = useDeliveryAreas();
  const { data: pricingSettings = [] } = usePricingSettings();
  const { data: dbColors = [] } = useColors();
  const { data: currencySymbolSetting } = useLocalSetting("business_currency_symbol");
  
  const currencySymbol = (currencySymbolSetting?.setting_value as string) || "$";
  const shippingCost = 5.00;

  // Reset colors when product changes
  useEffect(() => {
    if (product) {
      const numColors = (product as any).num_colors || 1;
      setFormData(prev => ({ ...prev, colors: Array(numColors).fill("") }));
    }
  }, [product]);

  const getSetting = (key: string) => pricingSettings.find(s => s.setting_key === key)?.setting_value || 0;

  // Get available colors for this product, grouped by category
  const availableColors = useMemo(() => {
    if (!product?.colors || !dbColors.length) return { standard: [], premium: [], ultra: [] };
    
    return dbColors
      .filter(c => product.colors?.includes(c.name))
      .reduce((acc, color) => {
        const category = (color.material?.category || "standard") as MaterialCategory;
        acc[category].push(color);
        return acc;
      }, { standard: [], premium: [], ultra: [] } as Record<MaterialCategory, typeof dbColors>);
  }, [product?.colors, dbColors]);

  // Calculate dynamic pricing based on customer selections
  const pricing = useMemo(() => {
    if (!product || pricingSettings.length === 0) return null;

    const basePrice = Number(product.price);
    
    // Material upcharge
    const materialUpcharge = formData.material === "standard" 
      ? 0 
      : formData.material === "premium"
        ? getSetting("material_premium_upcharge")
        : getSetting("material_ultra_upcharge");
    
    // Size upcharge
    const sizeUpcharge = getSetting(`size_${formData.size}_upcharge`);
    
    // Color category upcharges (check each selected color)
    let colorUpcharge = 0;
    formData.colors.forEach(colorName => {
      if (!colorName) return;
      const color = dbColors.find(c => c.name === colorName);
      if (color?.material?.category === "premium") {
        colorUpcharge += getSetting("color_premium_upcharge");
      } else if (color?.material?.category === "ultra") {
        colorUpcharge += getSetting("color_ultra_upcharge");
      }
    });
    
    // AMS fee for multiple colors
    const numColors = formData.colors.filter(c => c).length;
    const amsFee = numColors > 1 
      ? getSetting("ams_base_fee") + (numColors - 1) * getSetting("ams_per_color_fee")
      : 0;
    
    // Customization fee (if product is customizable and has input)
    const customizationFee = product.is_customizable && formData.customization ? 2 : 0;
    
    const subtotal = basePrice + materialUpcharge + sizeUpcharge + colorUpcharge + amsFee + customizationFee;
    const total = subtotal + shippingCost;

    return {
      basePrice,
      materialUpcharge,
      sizeUpcharge,
      colorUpcharge,
      amsFee,
      customizationFee,
      subtotal,
      shippingCost,
      total,
    };
  }, [product, formData, pricingSettings, dbColors]);

  const handleColorChange = (index: number, colorName: string) => {
    const newColors = [...formData.colors];
    newColors[index] = colorName;
    setFormData({ ...formData, colors: newColors });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || !pricing) return;

    const result = await createOrder.mutateAsync({
      product_id: product.id,
      customer_name: formData.name,
      customer_email: formData.email,
      customer_phone: formData.phone || undefined,
      delivery_location: formData.deliveryLocation || deliveryAreas?.[0] || "Alpharetta, GA",
      delivery_address: formData.address || undefined,
      shipping_cost: shippingCost,
      product_price: pricing.subtotal,
      total_amount: pricing.total,
      selected_color: formData.colors.filter(c => c).join(", ") || undefined,
      selected_material: formData.material || undefined,
      selected_size: formData.size || undefined,
      customization_details: formData.customization || undefined,
      notes: formData.notes || undefined,
    });

    setOrderNumber(result.order_number);
  };

  const handleClose = () => {
    setFormData({ name: "", email: "", phone: "", address: "", deliveryLocation: "", colors: [], material: "standard", size: "small", customization: "", notes: "" });
    setOrderNumber(null);
    onOpenChange(false);
  };

  const copyOrderNumber = () => {
    if (orderNumber) {
      navigator.clipboard.writeText(orderNumber);
      toast({ title: "Copied!", description: "Order number copied to clipboard." });
    }
  };

  if (!product) return null;

  const imageUrl = product.images?.[0] || "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop";
  const numColorsAllowed = (product as any).num_colors || 1;
  const allowedSizes = (product as any).allowed_sizes || ["small", "medium", "large"];
  const allowedMaterials = (product as any).allowed_materials || ["standard"];

  // Success view
  if (orderNumber) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md text-center">
          <div className="py-8 space-y-6">
            <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-foreground">Order Submitted!</h2>
              <p className="text-muted-foreground">
                Thanks {formData.name}! I'll contact you at {formData.email} soon.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-muted/50 border border-border">
              <p className="text-sm text-muted-foreground mb-2">Your Order Number</p>
              <div className="flex items-center justify-center gap-2">
                <p className="text-xl font-mono font-bold text-primary">{orderNumber}</p>
                <Button variant="ghost" size="icon" onClick={copyOrderNumber}>
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Save this number to track your order status!
              </p>
            </div>

            <Button onClick={handleClose} className="w-full">Done</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Order Request</DialogTitle>
          <DialogDescription>Configure your order and I'll contact you to complete it.</DialogDescription>
        </DialogHeader>

        <div className="flex gap-4 p-4 rounded-lg bg-muted/50 border border-border">
          <img src={imageUrl} alt={product.title} className="w-20 h-20 rounded-lg object-cover" />
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold truncate">{product.title}</h4>
            <p className="text-lg font-bold text-primary">
              {pricing ? `${currencySymbol}${pricing.subtotal.toFixed(2)}` : `${currencySymbol}${Number(product.price).toFixed(2)}`}
            </p>
            {product.is_customizable && (
              <p className="text-xs text-accent flex items-center gap-1 mt-1">
                <Sparkles className="w-3 h-3" />Customizable
              </p>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Customer Info */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Delivery Area</Label>
              <Select value={formData.deliveryLocation} onValueChange={(v) => setFormData({ ...formData, deliveryLocation: v })}>
                <SelectTrigger><SelectValue placeholder="Select area" /></SelectTrigger>
                <SelectContent>
                  {deliveryAreas?.map((area) => <SelectItem key={area} value={area}>{area}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input id="address" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
          </div>

          {/* Product Options */}
          <div className="space-y-4 pt-2 border-t">
            <h4 className="font-medium text-sm">Product Options</h4>
            
            {/* Material Selection */}
            {allowedMaterials.length > 1 && (
              <div className="space-y-2">
                <Label>Material Type</Label>
                <Select value={formData.material} onValueChange={(v) => setFormData({ ...formData, material: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {allowedMaterials.includes("standard") && (
                      <SelectItem value="standard">Standard</SelectItem>
                    )}
                    {allowedMaterials.includes("premium") && (
                      <SelectItem value="premium">Premium (+{currencySymbol}{getSetting("material_premium_upcharge")})</SelectItem>
                    )}
                    {allowedMaterials.includes("ultra") && (
                      <SelectItem value="ultra">Ultra Premium (+{currencySymbol}{getSetting("material_ultra_upcharge")})</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Size Selection */}
            {allowedSizes.length > 0 && (
              <div className="space-y-2">
                <Label>Size</Label>
                <Select value={formData.size} onValueChange={(v) => setFormData({ ...formData, size: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {allowedSizes.includes("small") && (
                      <SelectItem value="small">Small {getSetting("size_small_upcharge") > 0 ? `(+${currencySymbol}${getSetting("size_small_upcharge")})` : ""}</SelectItem>
                    )}
                    {allowedSizes.includes("medium") && (
                      <SelectItem value="medium">Medium (+{currencySymbol}{getSetting("size_medium_upcharge")})</SelectItem>
                    )}
                    {allowedSizes.includes("large") && (
                      <SelectItem value="large">Large (+{currencySymbol}{getSetting("size_large_upcharge")})</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-2">
                <Label>Colors ({numColorsAllowed} selection{numColorsAllowed > 1 ? "s" : ""})</Label>
                <div className="space-y-2">
                  {Array.from({ length: numColorsAllowed }).map((_, index) => (
                    <Select 
                      key={index} 
                      value={formData.colors[index] || ""} 
                      onValueChange={(v) => handleColorChange(index, v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={`Select color ${index + 1}`} />
                      </SelectTrigger>
                      <SelectContent>
                        {availableColors.standard.length > 0 && (
                          <>
                            <div className="px-2 py-1 text-xs text-muted-foreground font-medium">Standard Colors</div>
                            {availableColors.standard.map(c => {
                              const stock = c.stock_quantity ?? 1000;
                              const isOutOfStock = stock < 100;
                              console.log(`Color: ${c.name}, Stock: ${stock}, Disabled: ${isOutOfStock}`);
                              return (
                                <SelectItem key={c.id} value={c.name} disabled={isOutOfStock} className={isOutOfStock ? "opacity-50 pointer-events-none" : ""}>
                                  <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full border" style={{ backgroundColor: c.hex_color }} />
                                    {c.name} {isOutOfStock ? "(Out of Stock)" : `(${stock}g)`}
                                  </div>
                                </SelectItem>
                              );
                            })}
                          </>
                        )}
                        {availableColors.premium.length > 0 && (
                          <>
                            <div className="px-2 py-1 text-xs text-muted-foreground font-medium mt-1">Premium Colors (+{currencySymbol}{getSetting("color_premium_upcharge")})</div>
                            {availableColors.premium.map(c => {
                              const stock = c.stock_quantity ?? 1000;
                              const isOutOfStock = stock < 100;
                              return (
                                <SelectItem key={c.id} value={c.name} disabled={isOutOfStock} className={isOutOfStock ? "opacity-50 pointer-events-none" : ""}>
                                  <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full border" style={{ backgroundColor: c.hex_color }} />
                                    {c.name} {isOutOfStock ? "(Out of Stock)" : `(${stock}g)`}
                                  </div>
                                </SelectItem>
                              );
                            })}
                          </>
                        )}
                        {availableColors.ultra.length > 0 && (
                          <>
                            <div className="px-2 py-1 text-xs text-muted-foreground font-medium mt-1">Ultra Colors (+{currencySymbol}{getSetting("color_ultra_upcharge")})</div>
                            {availableColors.ultra.map(c => {
                              const stock = c.stock_quantity ?? 1000;
                              const isOutOfStock = stock < 100;
                              return (
                                <SelectItem key={c.id} value={c.name} disabled={isOutOfStock} className={isOutOfStock ? "opacity-50 pointer-events-none" : ""}>
                                  <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full border" style={{ backgroundColor: c.hex_color }} />
                                    {c.name} {isOutOfStock ? "(Out of Stock)" : `(${stock}g)`}
                                  </div>
                                </SelectItem>
                              );
                            })}
                          </>
                        )}
                      </SelectContent>
                    </Select>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Customization */}
          {product.is_customizable && (
            <div className="space-y-2">
              <Label htmlFor="customization">Customization Details (+{currencySymbol}2)</Label>
              <Input 
                id="customization" 
                value={formData.customization} 
                onChange={(e) => setFormData({ ...formData, customization: e.target.value })} 
                placeholder={product.personalization_options || "Enter details..."} 
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} rows={2} />
          </div>

          {/* Pricing Summary */}
          {pricing && (
            <div className="p-3 rounded-lg bg-muted text-sm space-y-1">
              <div className="flex justify-between"><span>Base Price</span><span>{currencySymbol}{pricing.basePrice.toFixed(2)}</span></div>
              {pricing.materialUpcharge > 0 && (
                <div className="flex justify-between text-muted-foreground"><span>Material Upgrade</span><span>+{currencySymbol}{pricing.materialUpcharge.toFixed(2)}</span></div>
              )}
              {pricing.sizeUpcharge > 0 && (
                <div className="flex justify-between text-muted-foreground"><span>Size</span><span>+{currencySymbol}{pricing.sizeUpcharge.toFixed(2)}</span></div>
              )}
              {pricing.colorUpcharge > 0 && (
                <div className="flex justify-between text-muted-foreground"><span>Premium Colors</span><span>+{currencySymbol}{pricing.colorUpcharge.toFixed(2)}</span></div>
              )}
              {pricing.amsFee > 0 && (
                <div className="flex justify-between text-muted-foreground"><span>Multi-Color</span><span>+{currencySymbol}{pricing.amsFee.toFixed(2)}</span></div>
              )}
              {pricing.customizationFee > 0 && (
                <div className="flex justify-between text-muted-foreground"><span>Customization</span><span>+{currencySymbol}{pricing.customizationFee.toFixed(2)}</span></div>
              )}
              <div className="flex justify-between border-t pt-1 mt-1"><span>Subtotal</span><span>{currencySymbol}{pricing.subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Shipping</span><span>{currencySymbol}{pricing.shippingCost.toFixed(2)}</span></div>
              <div className="flex justify-between font-bold border-t pt-1 mt-1"><span>Total</span><span>{currencySymbol}{pricing.total.toFixed(2)}</span></div>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={createOrder.isPending}>
              {createOrder.isPending ? "Sending..." : <><Send className="w-4 h-4" /> Submit Order</>}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}