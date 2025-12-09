import { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Minus, Plus, ShoppingCart, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useProducts } from "@/hooks/useProducts";
import { usePricingSettings, useColors, MaterialCategory } from "@/hooks/usePricing";
import { useLocalSetting } from "@/hooks/useLocalSettings";
import { useCart } from "@/contexts/CartContext";
import { toast } from "@/hooks/use-toast";
import defaultProductImage from "@/assets/default-product.jpg";

interface ColorSlot {
  id: string;
  label: string;
}

interface ColorSelection {
  slotId: string;
  slotLabel: string;
  colorName: string;
}

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: products, isLoading } = useProducts();
  const { data: pricingSettings = [] } = usePricingSettings();
  const { data: dbColors = [] } = useColors();
  const { data: currencySymbolSetting } = useLocalSetting("business_currency_symbol");
  const { addToCart } = useCart();

  const currencySymbol = (currencySymbolSetting?.setting_value as string) || "$";
  const product = products?.find(p => p.id === id);

  const [quantity, setQuantity] = useState(1);
  const [selectedMaterial, setSelectedMaterial] = useState("standard");
  const [selectedSize, setSelectedSize] = useState("small");
  const [colorSelections, setColorSelections] = useState<Record<string, string>>({});
  const [customization, setCustomization] = useState("");

  // Parse color_slots from product
  const colorSlots: ColorSlot[] = useMemo(() => {
    const rawSlots = (product as any)?.color_slots;
    if (rawSlots && Array.isArray(rawSlots)) {
      return rawSlots as ColorSlot[];
    }
    return [];
  }, [product]);

  useEffect(() => {
    if (product) {
      // Initialize color selections based on color_slots
      const initialSelections: Record<string, string> = {};
      colorSlots.forEach(slot => {
        initialSelections[slot.id] = "";
      });
      setColorSelections(initialSelections);
      
      const allowedMaterials = (product as any).allowed_materials || ["standard"];
      const allowedSizes = (product as any).allowed_sizes || ["small"];
      if (allowedMaterials.length > 0) setSelectedMaterial(allowedMaterials[0]);
      if (allowedSizes.length > 0) setSelectedSize(allowedSizes[0]);
    }
  }, [product, colorSlots]);

  const getSetting = (key: string) => pricingSettings.find(s => s.setting_key === key)?.setting_value || 0;

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

  // Get selected color names as array for cart
  const selectedColorsArray = useMemo(() => {
    return Object.values(colorSelections).filter(c => c);
  }, [colorSelections]);

  const unitPrice = useMemo(() => {
    if (!product || pricingSettings.length === 0) return 0;

    const basePrice = Number(product.price);
    const materialUpcharge = selectedMaterial === "standard" ? 0 
      : selectedMaterial === "premium" ? getSetting("material_premium_upcharge")
      : getSetting("material_ultra_upcharge");
    const sizeUpcharge = getSetting(`size_${selectedSize}_upcharge`);
    
    let colorUpcharge = 0;
    selectedColorsArray.forEach(colorName => {
      if (!colorName) return;
      const color = dbColors.find(c => c.name === colorName);
      if (color?.material?.category === "premium") colorUpcharge += getSetting("color_premium_upcharge");
      else if (color?.material?.category === "ultra") colorUpcharge += getSetting("color_ultra_upcharge");
    });

    const numColors = selectedColorsArray.length;
    const amsFee = numColors > 1 
      ? getSetting("ams_base_fee") + (numColors - 1) * getSetting("ams_per_color_fee")
      : 0;
    const customizationFee = product.is_customizable && customization ? 2 : 0;

    return basePrice + materialUpcharge + sizeUpcharge + colorUpcharge + amsFee + customizationFee;
  }, [product, selectedMaterial, selectedSize, selectedColorsArray, customization, pricingSettings, dbColors]);

  const handleColorChange = (slotId: string, colorName: string) => {
    setColorSelections(prev => ({ ...prev, [slotId]: colorName }));
  };

  // Format color selections for display/storage
  const formatColorSelectionsForStorage = (): string[] => {
    return colorSlots
      .filter(slot => colorSelections[slot.id])
      .map(slot => `${slot.label}: ${colorSelections[slot.id]}`);
  };

  const handleAddToCart = async () => {
    if (!product) return;

    await addToCart({
      product_id: product.id,
      product,
      quantity,
      selected_material: selectedMaterial,
      selected_size: selectedSize,
      selected_colors: formatColorSelectionsForStorage(),
      customization_details: customization || null,
      unit_price: unitPrice,
    });

    toast({ title: "Added to cart!", description: `${quantity}x ${product.title}` });
    navigate("/cart");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Product not found</p>
        <Button variant="outline" onClick={() => navigate("/")}>Back to Shop</Button>
      </div>
    );
  }

  const imageUrl = product.images?.[0] || defaultProductImage;
  const allowedSizes = (product as any).allowed_sizes || ["small", "medium", "large"];
  const allowedMaterials = (product as any).allowed_materials || ["standard"];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Shop
        </Link>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Image */}
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted">
            <img src={imageUrl} alt={product.title} className="w-full h-full object-cover" />
            {product.is_customizable && (
              <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent text-accent-foreground text-sm font-semibold">
                <Sparkles className="w-4 h-4" />
                Customizable
              </div>
            )}
          </div>

          {/* Product Options */}
          <div className="space-y-6">
            <div>
              <p className="text-sm text-muted-foreground">#{product.product_number}</p>
              <h1 className="text-3xl font-bold text-foreground mt-1">{product.title}</h1>
              {product.description && (
                <p className="text-muted-foreground mt-2">{product.description}</p>
              )}
            </div>

            <div className="text-3xl font-bold text-primary">
              {currencySymbol}{unitPrice.toFixed(2)}
              <span className="text-sm font-normal text-muted-foreground ml-2">each</span>
            </div>

            <div className="space-y-4 pt-4 border-t">
              {/* Material Selection */}
              {allowedMaterials.length > 1 && (
                <div className="space-y-2">
                  <Label>Material</Label>
                  <Select value={selectedMaterial} onValueChange={setSelectedMaterial}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {allowedMaterials.includes("standard") && <SelectItem value="standard">Standard</SelectItem>}
                      {allowedMaterials.includes("premium") && (
                        <SelectItem value="premium">Premium (+{currencySymbol}{getSetting("material_premium_upcharge")})</SelectItem>
                      )}
                      {allowedMaterials.includes("ultra") && (
                        <SelectItem value="ultra">Ultra (+{currencySymbol}{getSetting("material_ultra_upcharge")})</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Size Selection */}
              {allowedSizes.length > 0 && (
                <div className="space-y-2">
                  <Label>Size</Label>
                  <Select value={selectedSize} onValueChange={setSelectedSize}>
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

              {/* Color Selection with Labels */}
              {colorSlots.length > 0 && product.colors && product.colors.length > 0 && (
                <div className="space-y-3">
                  <Label>Select Colors ({colorSlots.length} selection{colorSlots.length > 1 ? "s" : ""})</Label>
                  <div className="space-y-3">
                    {colorSlots.map((slot) => (
                      <div key={slot.id} className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">{slot.label}</Badge>
                        </div>
                        <Select 
                          value={colorSelections[slot.id] || ""} 
                          onValueChange={(v) => handleColorChange(slot.id, v)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={`Select ${slot.label.toLowerCase()} color`} />
                          </SelectTrigger>
                          <SelectContent>
                            {availableColors.standard.length > 0 && (
                              <>
                                <div className="px-2 py-1 text-xs text-muted-foreground font-medium">Standard</div>
                                {availableColors.standard.map(c => (
                                  <SelectItem key={c.id} value={c.name}>
                                    <div className="flex items-center gap-2">
                                      <span className="w-3 h-3 rounded-full border" style={{ backgroundColor: c.hex_color }} />
                                      {c.name}
                                    </div>
                                  </SelectItem>
                                ))}
                              </>
                            )}
                            {availableColors.premium.length > 0 && (
                              <>
                                <div className="px-2 py-1 text-xs text-muted-foreground font-medium mt-1">Premium (+{currencySymbol}{getSetting("color_premium_upcharge")})</div>
                                {availableColors.premium.map(c => (
                                  <SelectItem key={c.id} value={c.name}>
                                    <div className="flex items-center gap-2">
                                      <span className="w-3 h-3 rounded-full border" style={{ backgroundColor: c.hex_color }} />
                                      {c.name}
                                    </div>
                                  </SelectItem>
                                ))}
                              </>
                            )}
                            {availableColors.ultra.length > 0 && (
                              <>
                                <div className="px-2 py-1 text-xs text-muted-foreground font-medium mt-1">Ultra (+{currencySymbol}{getSetting("color_ultra_upcharge")})</div>
                                {availableColors.ultra.map(c => (
                                  <SelectItem key={c.id} value={c.name}>
                                    <div className="flex items-center gap-2">
                                      <span className="w-3 h-3 rounded-full border" style={{ backgroundColor: c.hex_color }} />
                                      {c.name}
                                    </div>
                                  </SelectItem>
                                ))}
                              </>
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                    ))}
                  </div>
                  {/* Show selected colors summary */}
                  {selectedColorsArray.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {colorSlots.map(slot => {
                        const colorName = colorSelections[slot.id];
                        if (!colorName) return null;
                        const color = dbColors.find(c => c.name === colorName);
                        return (
                          <Badge key={slot.id} variant="secondary" className="flex items-center gap-1.5">
                            <span 
                              className="w-3 h-3 rounded-full border border-border/50" 
                              style={{ backgroundColor: color?.hex_color || '#ccc' }}
                            />
                            {slot.label}: {colorName}
                          </Badge>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Customization */}
              {product.is_customizable && (
                <div className="space-y-2">
                  <Label>Customization (+{currencySymbol}2)</Label>
                  <Input
                    value={customization}
                    onChange={(e) => setCustomization(e.target.value)}
                    placeholder={product.personalization_options || "Enter details..."}
                  />
                </div>
              )}
            </div>

            {/* Quantity and Add to Cart */}
            <div className="flex items-center gap-4 pt-4">
              <div className="flex items-center border rounded-lg">
                <Button variant="ghost" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <Button variant="ghost" size="icon" onClick={() => setQuantity(quantity + 1)}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              <Button className="flex-1" size="lg" onClick={handleAddToCart}>
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart - {currencySymbol}{(unitPrice * quantity).toFixed(2)}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
