import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { usePricingSettings, useMaterials, MaterialCategory } from "@/hooks/usePricing";
import { useLocalSetting } from "@/hooks/useLocalSettings";
import { Calculator, ChevronDown, Info, TrendingUp, TrendingDown, Package, Percent } from "lucide-react";

export function StandalonePricingCalculator() {
  const { data: pricingSettings = [] } = usePricingSettings();
  const { data: materials = [] } = useMaterials();
  const { data: currencySymbolSetting } = useLocalSetting("business_currency_symbol");
  const currencySymbol = (currencySymbolSetting?.setting_value as string) || "$";

  const [basePrice, setBasePrice] = useState(10);
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialCategory>("standard");
  const [selectedSize, setSelectedSize] = useState<"small" | "medium" | "large">("small");
  const [numColors, setNumColors] = useState(1);
  const [colorCategory, setColorCategory] = useState<MaterialCategory>("standard");
  const [estimatedGrams, setEstimatedGrams] = useState({ small: 50, medium: 100, large: 200 });
  const [accessoriesCost, setAccessoriesCost] = useState(0);
  const [showDetails, setShowDetails] = useState(false);

  const getSetting = (key: string) => pricingSettings.find(s => s.setting_key === key)?.setting_value || 0;
  const profitMargin = getSetting("profit_margin") || 50; // Default 50%

  // Get cost per gram for all material categories
  const materialCostsPerGram = useMemo(() => {
    const getCostForCategory = (category: MaterialCategory) => {
      const mat = materials.find(m => m.category === category);
      return mat?.cost_per_gram || (category === 'standard' ? 0.03 : category === 'premium' ? 0.05 : 0.08);
    };
    return {
      standard: getCostForCategory('standard'),
      premium: getCostForCategory('premium'),
      ultra: getCostForCategory('ultra'),
    };
  }, [materials]);

  // Calculate price
  const calculatedPrice = useMemo(() => {
    const grams = estimatedGrams[selectedSize];
    const costPerGram = materialCostsPerGram[selectedMaterial];
    const sizeMaterialCost = grams * costPerGram;
    
    // Color upcharges
    const colorUpcharge = colorCategory === "standard" 
      ? 0 
      : colorCategory === "premium" 
        ? getSetting("color_premium_upcharge") * numColors
        : getSetting("color_ultra_upcharge") * numColors;
    
    // AMS fee
    const amsFee = numColors > 1 
      ? getSetting("ams_base_fee") + (numColors - 1) * getSetting("ams_per_color_fee")
      : 0;

    const totalCost = basePrice + sizeMaterialCost + colorUpcharge + amsFee + accessoriesCost;
    
    // Calculate suggested retail price with profit margin
    const marginMultiplier = 1 + (profitMargin / 100);
    const suggestedRetailPrice = totalCost * marginMultiplier;
    
    // Calculate what base price should be to achieve target profit
    // If we want suggestedRetailPrice = (basePrice + otherCosts) * marginMultiplier
    // Then basePrice = (suggestedRetailPrice / marginMultiplier) - otherCosts
    const otherCosts = sizeMaterialCost + colorUpcharge + amsFee + accessoriesCost;
    const suggestedBasePrice = (suggestedRetailPrice / marginMultiplier) - otherCosts;
    
    return {
      basePrice,
      sizeMaterialCost,
      colorUpcharge,
      amsFee,
      accessoriesCost,
      totalCost,
      suggestedRetailPrice,
      suggestedBasePrice,
      profitMargin,
      profitAmount: suggestedRetailPrice - totalCost,
      grams,
      costPerGram,
      materialCostsPerGram,
    };
  }, [basePrice, selectedSize, selectedMaterial, numColors, colorCategory, estimatedGrams, materialCostsPerGram, accessoriesCost, pricingSettings, profitMargin]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
          <Calculator className="w-8 h-8 text-primary" />
          Pricing Calculator
        </h1>
        <p className="text-muted-foreground mt-2">
          Calculate product pricing based on size, material, colors, and other factors.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <Card>
          <CardHeader>
            <CardTitle>Product Configuration</CardTitle>
            <CardDescription>Enter product details to calculate pricing</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Base Price ({currencySymbol})</Label>
              <Input
                type="number"
                value={basePrice}
                onChange={(e) => setBasePrice(Number(e.target.value))}
                min={0}
                step={0.01}
              />
              <p className="text-xs text-muted-foreground">Base product price before options</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Size</Label>
                <Select value={selectedSize} onValueChange={(v) => setSelectedSize(v as "small" | "medium" | "large")}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Material Category</Label>
                <Select value={selectedMaterial} onValueChange={(v) => setSelectedMaterial(v as MaterialCategory)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                    <SelectItem value="ultra">Ultra</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Grams per Size */}
            <div className="space-y-3">
              <Label>Estimated Grams per Size</Label>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Small</Label>
                  <Input
                    type="number"
                    value={estimatedGrams.small}
                    onChange={(e) => setEstimatedGrams({ ...estimatedGrams, small: Number(e.target.value) || 0 })}
                    min={0}
                    step={1}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Medium</Label>
                  <Input
                    type="number"
                    value={estimatedGrams.medium}
                    onChange={(e) => setEstimatedGrams({ ...estimatedGrams, medium: Number(e.target.value) || 0 })}
                    min={0}
                    step={1}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Large</Label>
                  <Input
                    type="number"
                    value={estimatedGrams.large}
                    onChange={(e) => setEstimatedGrams({ ...estimatedGrams, large: Number(e.target.value) || 0 })}
                    min={0}
                    step={1}
                    placeholder="0"
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">Filament weight in grams for each size</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Number of Colors</Label>
                <Select value={String(numColors)} onValueChange={(v) => setNumColors(Number(v))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map(n => (
                      <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Color Category</Label>
                <Select value={colorCategory} onValueChange={(v) => setColorCategory(v as MaterialCategory)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="premium">Premium (+{currencySymbol}{getSetting("color_premium_upcharge")})</SelectItem>
                    <SelectItem value="ultra">Ultra (+{currencySymbol}{getSetting("color_ultra_upcharge")})</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Accessories Cost ({currencySymbol})</Label>
              <Input
                type="number"
                value={accessoriesCost}
                onChange={(e) => setAccessoriesCost(Number(e.target.value))}
                min={0}
                step={0.01}
              />
              <p className="text-xs text-muted-foreground">Additional costs (key rings, cases, etc.)</p>
            </div>
          </CardContent>
        </Card>

        {/* Result Panel */}
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-primary" />
              Calculated Price
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center py-4 space-y-2">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Cost</p>
                <p className="text-3xl font-bold text-foreground">
                  {currencySymbol}{calculatedPrice.totalCost.toFixed(2)}
                </p>
              </div>
              <div className="pt-3 border-t">
                <p className="text-sm text-muted-foreground mb-1">Suggested Retail Price ({profitMargin}% profit)</p>
                <p className="text-4xl font-bold text-primary">
                  {currencySymbol}{calculatedPrice.suggestedRetailPrice.toFixed(2)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Profit: {currencySymbol}{calculatedPrice.profitAmount.toFixed(2)}
                </p>
              </div>
              <div className="pt-3 border-t">
                <p className="text-xs text-muted-foreground mb-1">Suggested Base Price</p>
                <p className="text-lg font-semibold text-amber-600">
                  {currencySymbol}{calculatedPrice.suggestedBasePrice.toFixed(2)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Set this as base price to achieve {profitMargin}% profit
                </p>
              </div>
            </div>

            <Collapsible open={showDetails} onOpenChange={setShowDetails}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-between">
                  <span className="flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    Price Breakdown
                  </span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${showDetails ? "rotate-180" : ""}`} />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-2 pt-2 text-sm">
                <div className="flex justify-between py-1 border-b">
                  <span className="text-muted-foreground">Base Price</span>
                  <span className="font-medium">{currencySymbol}{calculatedPrice.basePrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-1 border-b">
                  <span className="text-muted-foreground">
                    Material ({calculatedPrice.grams}g × {currencySymbol}{calculatedPrice.costPerGram.toFixed(3)}/g)
                  </span>
                  <span className="font-medium">{currencySymbol}{calculatedPrice.sizeMaterialCost.toFixed(2)}</span>
                </div>
                {calculatedPrice.colorUpcharge > 0 && (
                  <div className="flex justify-between py-1 border-b">
                    <span className="text-muted-foreground">Color Upcharge ({numColors} colors)</span>
                    <span className="font-medium text-amber-600">+{currencySymbol}{calculatedPrice.colorUpcharge.toFixed(2)}</span>
                  </div>
                )}
                {calculatedPrice.amsFee > 0 && (
                  <div className="flex justify-between py-1 border-b">
                    <span className="text-muted-foreground">AMS Fee</span>
                    <span className="font-medium text-amber-600">+{currencySymbol}{calculatedPrice.amsFee.toFixed(2)}</span>
                  </div>
                )}
                {calculatedPrice.accessoriesCost > 0 && (
                  <div className="flex justify-between py-1 border-b">
                    <span className="text-muted-foreground">Accessories</span>
                    <span className="font-medium">{currencySymbol}{calculatedPrice.accessoriesCost.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 font-semibold text-lg">
                  <span>Total</span>
                  <span className="text-primary">{currencySymbol}{calculatedPrice.totalCost.toFixed(2)}</span>
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Material Costs by Category */}
            <div className="pt-4 border-t space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Material Costs by Category</p>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="p-2 rounded bg-muted/50">
                  <p className="text-muted-foreground mb-1">Standard</p>
                  <p className="font-semibold">{currencySymbol}{calculatedPrice.materialCostsPerGram.standard.toFixed(3)}/g</p>
                  {estimatedGrams[selectedSize] > 0 && (
                    <p className="text-muted-foreground mt-1">
                      {estimatedGrams[selectedSize]}g = {currencySymbol}{(estimatedGrams[selectedSize] * calculatedPrice.materialCostsPerGram.standard).toFixed(2)}
                    </p>
                  )}
                </div>
                <div className="p-2 rounded bg-primary/10 border border-primary/20">
                  <p className="text-muted-foreground mb-1">Premium</p>
                  <p className="font-semibold text-primary">{currencySymbol}{calculatedPrice.materialCostsPerGram.premium.toFixed(3)}/g</p>
                  {estimatedGrams[selectedSize] > 0 && (
                    <p className="text-muted-foreground mt-1">
                      {estimatedGrams[selectedSize]}g = {currencySymbol}{(estimatedGrams[selectedSize] * calculatedPrice.materialCostsPerGram.premium).toFixed(2)}
                    </p>
                  )}
                </div>
                <div className="p-2 rounded bg-destructive/10 border border-destructive/20">
                  <p className="text-muted-foreground mb-1">Ultra</p>
                  <p className="font-semibold text-destructive">{currencySymbol}{calculatedPrice.materialCostsPerGram.ultra.toFixed(3)}/g</p>
                  {estimatedGrams[selectedSize] > 0 && (
                    <p className="text-muted-foreground mt-1">
                      {estimatedGrams[selectedSize]}g = {currencySymbol}{(estimatedGrams[selectedSize] * calculatedPrice.materialCostsPerGram.ultra).toFixed(2)}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t">
              <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900">
                <div className="flex items-center gap-1 mb-1">
                  <TrendingDown className="w-4 h-4 text-green-600" />
                  <span className="text-xs font-medium text-green-700 dark:text-green-400">Material Cost</span>
                </div>
                <p className="text-lg font-bold text-green-700 dark:text-green-400">
                  {currencySymbol}{calculatedPrice.sizeMaterialCost.toFixed(2)}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900">
                <div className="flex items-center gap-1 mb-1">
                  <Package className="w-4 h-4 text-amber-600" />
                  <span className="text-xs font-medium text-amber-700 dark:text-amber-400">Filament</span>
                </div>
                <p className="text-lg font-bold text-amber-700 dark:text-amber-400">
                  {calculatedPrice.grams}g
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

