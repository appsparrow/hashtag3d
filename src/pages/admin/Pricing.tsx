import { useState, useMemo } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import {
  usePricingSettings,
  useComplexitySettings,
  calculatePrice,
  MaterialCategory,
  ComplexityTier,
} from "@/hooks/usePricing";
import { useLocalSetting } from "@/hooks/useLocalSettings";
import { DollarSign, ChevronDown, Loader2, Info, Clock } from "lucide-react";
import { Link } from "react-router-dom";

export default function Pricing() {
  const { data: pricingSettings = [], isLoading: loadingPricing } = usePricingSettings();
  const { data: complexitySettings = [], isLoading: loadingComplexity } = useComplexitySettings();
  const { data: currencySymbolSetting } = useLocalSetting("business_currency_symbol");

  const [calcBasePrice, setCalcBasePrice] = useState(10);
  const [calcMaterial, setCalcMaterial] = useState<MaterialCategory>("standard");
  const [calcSize, setCalcSize] = useState<"small" | "medium" | "large">("small");
  const [calcColors, setCalcColors] = useState(1);
  const [calcColorCategory, setCalcColorCategory] = useState<MaterialCategory>("standard");
  const [calcComplexity, setCalcComplexity] = useState<ComplexityTier>("simple");
  const [calcCustomization, setCalcCustomization] = useState(0);
  const [showCostDetails, setShowCostDetails] = useState(false);

  const isLoading = loadingPricing || loadingComplexity;
  const currencySymbol = (currencySymbolSetting?.setting_value as string) || "$";

  const getSetting = (key: string) => pricingSettings.find(s => s.setting_key === key)?.setting_value || 0;

  const profitMargin = useMemo(() => getSetting("profit_margin") || 40, [pricingSettings]);

  const calculatedPrice = useMemo(() => {
    if (pricingSettings.length === 0 || complexitySettings.length === 0) return null;
    
    // Base calculation
    const basePriceCalc = calculatePrice({
      basePrice: calcBasePrice,
      materialCategory: calcMaterial,
      numColors: calcColors,
      complexity: calcComplexity,
      customizationFee: calcCustomization,
      pricingSettings,
      complexitySettings,
      profitMargin,
    });

    // Add size upcharge
    const sizeUpcharge = getSetting(`size_${calcSize}_upcharge`);
    
    // Add color category upcharge (if customer picks premium/ultra colors)
    const colorCategoryUpcharge = calcColorCategory === "standard" 
      ? 0 
      : calcColorCategory === "premium" 
        ? getSetting("color_premium_upcharge") 
        : getSetting("color_ultra_upcharge");

    const totalCost = basePriceCalc.totalCost + sizeUpcharge + colorCategoryUpcharge;
    const marginMultiplier = 1 + (profitMargin / 100);

    return {
      ...basePriceCalc,
      sizeUpcharge,
      colorCategoryUpcharge,
      totalCost,
      suggestedPrice: Math.ceil(totalCost * marginMultiplier),
    };
  }, [calcBasePrice, calcMaterial, calcSize, calcColors, calcColorCategory, calcComplexity, calcCustomization, pricingSettings, complexitySettings, profitMargin]);

  const complexityInfo = useMemo(() => {
    return complexitySettings.find(c => c.tier === calcComplexity);
  }, [complexitySettings, calcComplexity]);

  const printTimeEstimate = useMemo(() => {
    if (!complexityInfo?.min_time_minutes || !complexityInfo?.max_time_minutes) return null;
    const minDays = Math.ceil(complexityInfo.min_time_minutes / 60 / 8); // 8 hour work days
    const maxDays = Math.ceil(complexityInfo.max_time_minutes / 60 / 8);
    return minDays === maxDays ? `~${minDays} day(s)` : `${minDays}-${maxDays} days`;
  }, [complexityInfo]);

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Pricing Calculator</h1>
            <p className="text-muted-foreground mt-1">Test pricing based on customer selections.</p>
          </div>
          <Button variant="outline" asChild>
            <Link to="/admin/configuration">Edit Upcharges</Link>
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Input Panel */}
          <Card>
            <CardHeader>
              <CardTitle>Simulate Customer Order</CardTitle>
              <CardDescription>Enter product details and customer choices to see final price</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Product Base Price ({currencySymbol})</Label>
                <Input
                  type="number"
                  value={calcBasePrice}
                  onChange={(e) => setCalcBasePrice(Number(e.target.value))}
                  min={0}
                  step={0.5}
                />
                <p className="text-xs text-muted-foreground">Your cost to produce this item</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Material Type</Label>
                  <Select value={calcMaterial} onValueChange={(v) => setCalcMaterial(v as MaterialCategory)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard (+{currencySymbol}0)</SelectItem>
                      <SelectItem value="premium">Premium (+{currencySymbol}{getSetting("material_premium_upcharge")})</SelectItem>
                      <SelectItem value="ultra">Ultra (+{currencySymbol}{getSetting("material_ultra_upcharge")})</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Size</Label>
                  <Select value={calcSize} onValueChange={(v) => setCalcSize(v as "small" | "medium" | "large")}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small (+{currencySymbol}{getSetting("size_small_upcharge")})</SelectItem>
                      <SelectItem value="medium">Medium (+{currencySymbol}{getSetting("size_medium_upcharge")})</SelectItem>
                      <SelectItem value="large">Large (+{currencySymbol}{getSetting("size_large_upcharge")})</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Number of Colors</Label>
                  <Select value={String(calcColors)} onValueChange={(v) => setCalcColors(Number(v))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map(n => (
                        <SelectItem key={n} value={String(n)}>{n} color{n > 1 ? "s" : ""}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Color Category</Label>
                  <Select value={calcColorCategory} onValueChange={(v) => setCalcColorCategory(v as MaterialCategory)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard (+{currencySymbol}0)</SelectItem>
                      <SelectItem value="premium">Premium (+{currencySymbol}{getSetting("color_premium_upcharge")})</SelectItem>
                      <SelectItem value="ultra">Ultra (+{currencySymbol}{getSetting("color_ultra_upcharge")})</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Complexity</Label>
                <Select value={calcComplexity} onValueChange={(v) => setCalcComplexity(v as ComplexityTier)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {complexitySettings.map(c => (
                      <SelectItem key={c.tier} value={c.tier}>
                        {c.tier.charAt(0).toUpperCase() + c.tier.slice(1)} (+{currencySymbol}{c.fee})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Customization Fee ({currencySymbol})</Label>
                <Input
                  type="number"
                  value={calcCustomization}
                  onChange={(e) => setCalcCustomization(Number(e.target.value))}
                  min={0}
                  step={0.5}
                />
              </div>
            </CardContent>
          </Card>

          {/* Result Panel */}
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-primary" />
                Customer Price
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {calculatedPrice && (
                <>
                  <div className="text-center py-4">
                    <p className="text-sm text-muted-foreground">Suggested Retail Price</p>
                    <p className="text-5xl font-bold text-primary">{currencySymbol}{calculatedPrice.suggestedPrice}</p>
                    <p className="text-sm text-muted-foreground mt-2">Cost: {currencySymbol}{calculatedPrice.totalCost.toFixed(2)}</p>
                  </div>

                  {printTimeEstimate && (
                    <div className="flex items-center justify-center gap-2 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">Est. Print Time: {printTimeEstimate}</span>
                    </div>
                  )}

                  <Collapsible open={showCostDetails} onOpenChange={setShowCostDetails}>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" className="w-full justify-between">
                        <span className="flex items-center gap-2">
                          <Info className="w-4 h-4" />
                          Cost Breakdown
                        </span>
                        <ChevronDown className={`w-4 h-4 transition-transform ${showCostDetails ? "rotate-180" : ""}`} />
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-2 pt-2 text-sm">
                      <div className="flex justify-between"><span>Base Price</span><span>{currencySymbol}{calculatedPrice.basePrice.toFixed(2)}</span></div>
                      <div className="flex justify-between"><span>Material Upcharge</span><span>{currencySymbol}{calculatedPrice.materialUpcharge.toFixed(2)}</span></div>
                      <div className="flex justify-between"><span>Size Upcharge</span><span>{currencySymbol}{calculatedPrice.sizeUpcharge.toFixed(2)}</span></div>
                      <div className="flex justify-between"><span>Color Category</span><span>{currencySymbol}{calculatedPrice.colorCategoryUpcharge.toFixed(2)}</span></div>
                      <div className="flex justify-between"><span>AMS/Multi-color</span><span>{currencySymbol}{calculatedPrice.amsFee.toFixed(2)}</span></div>
                      <div className="flex justify-between"><span>Complexity Fee</span><span>{currencySymbol}{calculatedPrice.complexityFee.toFixed(2)}</span></div>
                      <div className="flex justify-between"><span>Customization</span><span>{currencySymbol}{calculatedPrice.customizationFee.toFixed(2)}</span></div>
                      <div className="border-t pt-2 flex justify-between font-semibold">
                        <span>Total Cost</span><span>{currencySymbol}{calculatedPrice.totalCost.toFixed(2)}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Suggested price includes {profitMargin}% profit margin
                      </p>
                    </CollapsibleContent>
                  </Collapsible>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}