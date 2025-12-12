import { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Minus, Plus, ShoppingCart, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useProducts } from "@/hooks/useProducts";
import { usePricingSettings, useColors, useMaterials, MaterialCategory } from "@/hooks/usePricing";
import { useLocalSetting } from "@/hooks/useLocalSettings";
import { useCart } from "@/contexts/CartContext";
import { toast } from "@/hooks/use-toast";
import { ColorSwatchModal } from "@/components/ColorSwatchModal";
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
  const { data: materials = [] } = useMaterials();
  const { data: currencySymbolSetting } = useLocalSetting("business_currency_symbol");
  const { addToCart } = useCart();

  const currencySymbol = (currencySymbolSetting?.setting_value as string) || "$";
  const product = products?.find(p => p.id === id);

  const [quantity, setQuantity] = useState(1);
  const [selectedMaterial, setSelectedMaterial] = useState("standard");
  const [selectedSize, setSelectedSize] = useState("small");
  const [colorSelections, setColorSelections] = useState<Record<string, string>>({});
  const [customization, setCustomization] = useState("");
  const [openColorSlot, setOpenColorSlot] = useState<string | null>(null);

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

  // Get cost_per_gram for the selected material category (determined by color selection)
  const getMaterialCostPerGram = (category: MaterialCategory) => {
    const mat = materials.find(m => m.category === category);
    return mat?.cost_per_gram || (category === 'standard' ? 0.03 : category === 'premium' ? 0.05 : 0.08);
  };

  // Get estimated grams for the selected size
  const getGramsForSize = (size: string) => {
    if (!product) return 0;
    const prod = product as any;
    if (size === 'small') return prod.estimated_grams_small || 0;
    if (size === 'medium') return prod.estimated_grams_medium || 0;
    if (size === 'large') return prod.estimated_grams_large || 0;
    return 0;
  };

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

  // Determine the highest material category from selected colors
  const selectedMaterialCategory = useMemo((): MaterialCategory => {
    let highest: MaterialCategory = 'standard';
    selectedColorsArray.forEach(colorName => {
      const color = dbColors.find(c => c.name === colorName);
      if (color?.material?.category === 'ultra') highest = 'ultra';
      else if (color?.material?.category === 'premium' && highest !== 'ultra') highest = 'premium';
    });
    return highest;
  }, [selectedColorsArray, dbColors]);

  const unitPrice = useMemo(() => {
    if (!product || pricingSettings.length === 0) return 0;

    const basePrice = Number(product.price);
    
    // Size-based pricing: grams × cost_per_gram for the material category
    const gramsForSize = getGramsForSize(selectedSize);
    const costPerGram = getMaterialCostPerGram(selectedMaterialCategory);
    const sizeMaterialCost = gramsForSize * costPerGram;
    
    // Color upcharges (flat fee per premium/ultra color)
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

    return basePrice + sizeMaterialCost + colorUpcharge + amsFee;
  }, [product, selectedSize, selectedColorsArray, pricingSettings, dbColors, materials, selectedMaterialCategory]);

  // Validation: customization required for customizable products
  const isCustomizationValid = !product?.is_customizable || customization.trim().length > 0;

  const handleColorChange = (slotId: string, colorName: string) => {
    setColorSelections(prev => ({ ...prev, [slotId]: colorName }));
    setOpenColorSlot(null); // Close all accordions after selection
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
      <div className="container mx-auto max-w-6xl px-3 sm:px-4 py-4 sm:py-8">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 sm:mb-8 text-sm sm:text-base">
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Back to Shop</span>
          <span className="sm:hidden">Back</span>
        </Link>

        <div className="grid md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 lg:gap-12">
          {/* Product Image */}
          <div className="relative aspect-square rounded-xl sm:rounded-2xl overflow-hidden bg-muted">
            <img src={imageUrl} alt={product.title} className="w-full h-full object-cover" />
            {product.is_customizable && (
              <div className="absolute top-2 left-2 sm:top-4 sm:left-4 flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-accent text-accent-foreground text-xs sm:text-sm font-semibold">
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Customizable</span>
              </div>
            )}
          </div>

          {/* Product Options */}
          <div className="space-y-4 sm:space-y-6">
            <div>
              <p className="text-xs sm:text-sm text-muted-foreground">#{product.product_number}</p>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mt-1">{product.title}</h1>
              {product.description && (
                <p className="text-sm sm:text-base text-muted-foreground mt-2">{product.description}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="text-2xl sm:text-3xl font-bold text-primary">
                {currencySymbol}{unitPrice.toFixed(2)}
                <span className="text-xs sm:text-sm font-normal text-muted-foreground ml-2">each</span>
              </div>
              {/* Price Breakdown - Mobile Visible */}
              <div className="text-xs sm:text-sm text-muted-foreground space-y-1 p-2 sm:p-3 rounded-lg bg-muted/50 border border-border">
                <div className="flex justify-between">
                  <span>Base Price:</span>
                  <span>{currencySymbol}{Number(product.price).toFixed(2)}</span>
                </div>
                {selectedColorsArray.length > 0 && (
                  <>
                    {selectedColorsArray.map((colorName, idx) => {
                      const color = dbColors.find(c => c.name === colorName);
                      const upcharge = color?.material?.category === "premium" 
                        ? getSetting("color_premium_upcharge")
                        : color?.material?.category === "ultra"
                        ? getSetting("color_ultra_upcharge")
                        : 0;
                      if (upcharge === 0) return null;
                      return (
                        <div key={idx} className="flex justify-between">
                          <span>{colorName} (Premium):</span>
                          <span>+{currencySymbol}{upcharge.toFixed(2)}</span>
                        </div>
                      );
                    })}
                  </>
                )}
                {selectedColorsArray.length > 1 && (
                  <div className="flex justify-between">
                    <span>Multi-color (AMS):</span>
                    <span>+{currencySymbol}{(
                      getSetting("ams_base_fee") + (selectedColorsArray.length - 1) * getSetting("ams_per_color_fee")
                    ).toFixed(2)}</span>
                  </div>
                )}
                {(() => {
                  const gramsForSize = getGramsForSize(selectedSize);
                  const costPerGram = getMaterialCostPerGram(selectedMaterialCategory);
                  const sizeMaterialCost = gramsForSize * costPerGram;
                  if (sizeMaterialCost > 0) {
                    return (
                      <div className="flex justify-between">
                        <span>Material ({selectedSize}):</span>
                        <span>+{currencySymbol}{sizeMaterialCost.toFixed(2)}</span>
                      </div>
                    );
                  }
                  return null;
                })()}
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4 pt-3 sm:pt-4 border-t">

              {/* Size Selection - Toggle Buttons */}
              {allowedSizes.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm">Size</Label>
                  <div className="flex gap-1.5 sm:gap-2">
                    {allowedSizes.includes("small") && (
                      <Button
                        type="button"
                        variant={selectedSize === "small" ? "default" : "outline"}
                        onClick={() => setSelectedSize("small")}
                        className="flex-1 text-xs sm:text-sm py-2"
                      >
                        Small
                      </Button>
                    )}
                    {allowedSizes.includes("medium") && (
                      <Button
                        type="button"
                        variant={selectedSize === "medium" ? "default" : "outline"}
                        onClick={() => setSelectedSize("medium")}
                        className="flex-1 text-xs sm:text-sm py-2"
                      >
                        Medium
                      </Button>
                    )}
                    {allowedSizes.includes("large") && (
                      <Button
                        type="button"
                        variant={selectedSize === "large" ? "default" : "outline"}
                        onClick={() => setSelectedSize("large")}
                        className="flex-1 text-xs sm:text-sm py-2"
                      >
                        Large
                      </Button>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">Size affects pricing based on material used</p>
                </div>
              )}

              {/* Color Selection - Simplified */}
              {colorSlots.length > 0 && product.colors && product.colors.length > 0 && (
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <Label className="text-sm">Select Colors</Label>
                    <ColorSwatchModal
                      availableColors={availableColors}
                      currencySymbol={currencySymbol}
                      premiumUpcharge={getSetting("color_premium_upcharge")}
                      ultraUpcharge={getSetting("color_ultra_upcharge")}
                    />
                  </div>

                  {/* Color Selection per Element */}
                  <div className="space-y-2 sm:space-y-3">
                    {colorSlots.map((slot, index) => {
                      const selectedColor = colorSelections[slot.id];
                      const selectedColorData = dbColors.find(c => c.name === selectedColor);
                      const isOpen = openColorSlot === slot.id;
                      
                      // Combine all colors for this slot
                      const allColors = [
                        ...availableColors.standard.map(c => ({ ...c, category: 'standard' as const })),
                        ...availableColors.premium.map(c => ({ ...c, category: 'premium' as const })),
                        ...availableColors.ultra.map(c => ({ ...c, category: 'ultra' as const })),
                      ];
                      
                      return (
                        <div key={slot.id} className="space-y-2">
                          {/* Single Accordion with All Colors */}
                          {allColors.length > 0 && (
                            <Accordion 
                              type="single" 
                              collapsible 
                              className="w-full"
                              value={openColorSlot === slot.id ? slot.id : undefined}
                              onValueChange={(value) => {
                                // Only allow one accordion open at a time
                                setOpenColorSlot(value === slot.id ? slot.id : null);
                              }}
                            >
                              <AccordionItem value={slot.id} className="border-0">
                                <AccordionTrigger className="py-2.5 hover:no-underline px-0 w-full cursor-pointer">
                                  <div className="flex items-center gap-2.5 w-full">
                                    <Label className="text-sm font-medium cursor-pointer">
                                      {slot.label}
                                    </Label>
                                    {selectedColorData ? (
                                      <Badge variant="secondary" className="flex items-center gap-1.5 text-sm py-1.5 px-3 cursor-pointer">
                                        <span 
                                          className="w-4 h-4 rounded-full border border-border/50" 
                                          style={{ backgroundColor: selectedColorData.hex_color }}
                                        />
                                        {selectedColor}
                                      </Badge>
                                    ) : (
                                      <span className="text-sm text-muted-foreground">Choose Color</span>
                                    )}
                                  </div>
                                </AccordionTrigger>
                                <AccordionContent className="pt-2 pb-0">
                                  {/* All Colors in One Grid */}
                                  <div className="space-y-3">
                                    {/* Standard Section */}
                                    {availableColors.standard.length > 0 && (
                                      <div className="space-y-1.5">
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                          <Badge variant="secondary" className="text-[10px]">Standard</Badge>
                                          <span>({availableColors.standard.length})</span>
                                        </div>
                                        <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-1.5">
                                          {availableColors.standard.map(c => {
                                            const stock = c.stock_quantity ?? 1000;
                                            const isOutOfStock = stock < 100;
                                            const isSelected = selectedColor === c.name;
                                            return (
                                              <button
                                                key={c.id}
                                                type="button"
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  if (!isOutOfStock) {
                                                    handleColorChange(slot.id, c.name);
                                                  }
                                                }}
                                                disabled={isOutOfStock}
                                                className={`relative aspect-square rounded border transition-all ${
                                                  isSelected
                                                    ? "border-primary ring-1 ring-primary scale-110"
                                                    : isOutOfStock
                                                    ? "opacity-40 border-dashed cursor-not-allowed"
                                                    : "border-border hover:border-primary hover:scale-105 cursor-pointer"
                                                }`}
                                                style={{ backgroundColor: c.hex_color }}
                                                title={isOutOfStock ? `${c.name} - Out of Stock` : `${c.name} (${stock}g)`}
                                              >
                                                {isSelected && (
                                                  <div className="absolute inset-0 flex items-center justify-center">
                                                    <div className="w-2.5 h-2.5 rounded-full bg-white/90 flex items-center justify-center">
                                                      <span className="text-[8px]">✓</span>
                                                    </div>
                                                  </div>
                                                )}
                                                {isOutOfStock && (
                                                  <div className="absolute inset-0 flex items-center justify-center">
                                                    <span className="text-[7px] font-bold text-destructive bg-white/90 px-0.5 rounded">OOS</span>
                                                  </div>
                                                )}
                                              </button>
                                            );
                                          })}
                                        </div>
                                      </div>
                                    )}
                                    
                                    {/* Premium Section */}
                                    {availableColors.premium.length > 0 && (
                                      <div className="space-y-1.5">
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                          <Badge variant="default" className="text-[10px]">Premium +{currencySymbol}{getSetting("color_premium_upcharge")}</Badge>
                                          <span>({availableColors.premium.length})</span>
                                        </div>
                                        <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-1.5">
                                          {availableColors.premium.map(c => {
                                            const stock = c.stock_quantity ?? 1000;
                                            const isOutOfStock = stock < 100;
                                            const isSelected = selectedColor === c.name;
                                            return (
                                              <button
                                                key={c.id}
                                                type="button"
                                                onClick={() => !isOutOfStock && handleColorChange(slot.id, c.name)}
                                                disabled={isOutOfStock}
                                                className={`relative aspect-square rounded border transition-all ${
                                                  isSelected
                                                    ? "border-primary ring-1 ring-primary scale-110"
                                                    : isOutOfStock
                                                    ? "opacity-40 border-dashed cursor-not-allowed"
                                                    : "border-primary/50 hover:border-primary hover:scale-105 cursor-pointer"
                                                }`}
                                                style={{ backgroundColor: c.hex_color }}
                                                title={isOutOfStock ? `${c.name} - Out of Stock` : `${c.name} (${stock}g) - Premium`}
                                              >
                                                {isSelected && (
                                                  <div className="absolute inset-0 flex items-center justify-center">
                                                    <div className="w-2.5 h-2.5 rounded-full bg-white/90 flex items-center justify-center">
                                                      <span className="text-[8px]">✓</span>
                                                    </div>
                                                  </div>
                                                )}
                                                {isOutOfStock && (
                                                  <div className="absolute inset-0 flex items-center justify-center">
                                                    <span className="text-[7px] font-bold text-destructive bg-white/90 px-0.5 rounded">OOS</span>
                                                  </div>
                                                )}
                                              </button>
                                            );
                                          })}
                                        </div>
                                      </div>
                                    )}
                                    
                                    {/* Ultra Section */}
                                    {availableColors.ultra.length > 0 && (
                                      <div className="space-y-1.5">
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                          <Badge variant="destructive" className="text-[10px]">Ultra +{currencySymbol}{getSetting("color_ultra_upcharge")}</Badge>
                                          <span>({availableColors.ultra.length})</span>
                                        </div>
                                        <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-1.5">
                                          {availableColors.ultra.map(c => {
                                            const stock = c.stock_quantity ?? 1000;
                                            const isOutOfStock = stock < 100;
                                            const isSelected = selectedColor === c.name;
                                            return (
                                              <button
                                                key={c.id}
                                                type="button"
                                                onClick={() => !isOutOfStock && handleColorChange(slot.id, c.name)}
                                                disabled={isOutOfStock}
                                                className={`relative aspect-square rounded border transition-all ${
                                                  isSelected
                                                    ? "border-destructive ring-1 ring-destructive scale-110"
                                                    : isOutOfStock
                                                    ? "opacity-40 border-dashed cursor-not-allowed"
                                                    : "border-destructive/50 hover:border-destructive hover:scale-105 cursor-pointer"
                                                }`}
                                                style={{ backgroundColor: c.hex_color }}
                                                title={isOutOfStock ? `${c.name} - Out of Stock` : `${c.name} (${stock}g) - Ultra`}
                                              >
                                                {isSelected && (
                                                  <div className="absolute inset-0 flex items-center justify-center">
                                                    <div className="w-2.5 h-2.5 rounded-full bg-white/90 flex items-center justify-center">
                                                      <span className="text-[8px]">✓</span>
                                                    </div>
                                                  </div>
                                                )}
                                                {isOutOfStock && (
                                                  <div className="absolute inset-0 flex items-center justify-center">
                                                    <span className="text-[7px] font-bold text-destructive bg-white/90 px-0.5 rounded">OOS</span>
                                                  </div>
                                                )}
                                              </button>
                                            );
                                          })}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </AccordionContent>
                              </AccordionItem>
                            </Accordion>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Customization */}
              {product.is_customizable && (
                <div className="space-y-2">
                  <Label className="text-sm">Customization <span className="text-destructive">*</span></Label>
                  {product.personalization_options && (
                    <p className="text-xs sm:text-sm text-muted-foreground">{product.personalization_options}</p>
                  )}
                  <Input
                    value={customization}
                    onChange={(e) => setCustomization(e.target.value)}
                    placeholder="Enter your customization details..."
                    className={`text-sm ${!isCustomizationValid ? "border-destructive" : ""}`}
                  />
                  {!isCustomizationValid && (
                    <p className="text-xs sm:text-sm text-destructive">Customization is required for this product</p>
                  )}
                </div>
              )}
            </div>

            {/* Quantity and Add to Cart */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-3 sm:pt-4">
              <div className="flex items-center border rounded-lg w-full sm:w-auto justify-center sm:justify-start">
                <Button variant="ghost" size="icon" className="h-10 w-10" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="w-12 text-center font-medium text-sm sm:text-base">{quantity}</span>
                <Button variant="ghost" size="icon" className="h-10 w-10" onClick={() => setQuantity(quantity + 1)}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              <Button 
                className="flex-1 w-full sm:w-auto text-sm sm:text-base py-6" 
                size="lg" 
                onClick={handleAddToCart}
                disabled={!isCustomizationValid}
              >
                <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                <span className="hidden sm:inline">Add to Cart - </span>
                <span>{currencySymbol}{(unitPrice * quantity).toFixed(2)}</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
