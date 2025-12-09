import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calculator, DollarSign, TrendingUp, TrendingDown, Percent, Package } from "lucide-react";
import { usePricingSettings, useMaterials } from "@/hooks/usePricing";

interface ProductPricingPanelProps {
  basePrice: number;
  allowedMaterials: string[];
  allowedSizes: string[];
  numColors: number;
  isCustomizable: boolean;
  estimatedGramsStandard?: number;
  estimatedGramsPremium?: number;
  estimatedGramsUltra?: number;
  accessoriesCost?: number;
}

export function ProductPricingPanel({
  basePrice,
  allowedMaterials,
  allowedSizes,
  numColors,
  isCustomizable,
  estimatedGramsStandard = 0,
  estimatedGramsPremium = 0,
  estimatedGramsUltra = 0,
  accessoriesCost = 0,
}: ProductPricingPanelProps) {
  const { data: pricingSettings } = usePricingSettings();
  const { data: materials } = useMaterials();

  const getUpcharge = (key: string) => {
    return pricingSettings?.find(s => s.setting_key === key)?.setting_value || 0;
  };

  // Get cost per gram for each material category
  const materialCostPerGram = useMemo(() => {
    if (!materials) return { standard: 0.03, premium: 0.05, ultra: 0.08 };
    
    const getCostForCategory = (category: string) => {
      const mat = materials.find(m => m.category === category);
      return mat?.cost_per_gram || (category === 'standard' ? 0.03 : category === 'premium' ? 0.05 : 0.08);
    };

    return {
      standard: getCostForCategory('standard'),
      premium: getCostForCategory('premium'),
      ultra: getCostForCategory('ultra'),
    };
  }, [materials]);

  const priceRange = useMemo(() => {
    if (!pricingSettings) return null;

    // Material upcharges
    const materialUpcharges = {
      standard: 0,
      premium: getUpcharge('material_premium_upcharge'),
      ultra: getUpcharge('material_ultra_upcharge'),
    };

    // Size upcharges
    const sizeUpcharges = {
      small: getUpcharge('size_small_upcharge'),
      medium: getUpcharge('size_medium_upcharge'),
      large: getUpcharge('size_large_upcharge'),
    };

    // Color category upcharges
    const colorPremiumUpcharge = getUpcharge('color_premium_upcharge');
    const colorUltraUpcharge = getUpcharge('color_ultra_upcharge');

    // AMS fee for multiple colors
    const amsFeePerColor = getUpcharge('ams_fee_per_color');
    const amsFee = numColors > 1 ? (numColors - 1) * amsFeePerColor : 0;

    // Customization fee
    const customizationFee = isCustomizable ? getUpcharge('customization_fee') : 0;

    // Calculate min price (smallest material + smallest size + standard colors)
    const minMaterialUpcharge = Math.min(
      ...allowedMaterials.map(m => materialUpcharges[m as keyof typeof materialUpcharges] || 0)
    );
    const minSizeUpcharge = Math.min(
      ...allowedSizes.map(s => sizeUpcharges[s as keyof typeof sizeUpcharges] || 0)
    );
    const minPrice = basePrice + minMaterialUpcharge + minSizeUpcharge + amsFee;

    // Calculate max price (largest material + largest size + ultra colors)
    const maxMaterialUpcharge = Math.max(
      ...allowedMaterials.map(m => materialUpcharges[m as keyof typeof materialUpcharges] || 0)
    );
    const maxSizeUpcharge = Math.max(
      ...allowedSizes.map(s => sizeUpcharges[s as keyof typeof sizeUpcharges] || 0)
    );
    // Max color upcharge (assuming customer picks ultra colors for all selections)
    const maxColorUpcharge = numColors * colorUltraUpcharge;
    const maxPrice = basePrice + maxMaterialUpcharge + maxSizeUpcharge + amsFee + maxColorUpcharge + customizationFee;

    // Calculate material costs based on estimated grams
    const materialCosts = {
      standard: (estimatedGramsStandard * materialCostPerGram.standard) + accessoriesCost,
      premium: (estimatedGramsPremium * materialCostPerGram.premium) + accessoriesCost,
      ultra: (estimatedGramsUltra * materialCostPerGram.ultra) + accessoriesCost,
    };

    // Calculate profit margins
    const minMaterialKey = allowedMaterials.reduce((min, curr) => 
      (materialUpcharges[curr as keyof typeof materialUpcharges] || 0) < (materialUpcharges[min as keyof typeof materialUpcharges] || 0) ? curr : min
    );
    const maxMaterialKey = allowedMaterials.reduce((max, curr) => 
      (materialUpcharges[curr as keyof typeof materialUpcharges] || 0) > (materialUpcharges[max as keyof typeof materialUpcharges] || 0) ? curr : max
    );

    const minCost = materialCosts[minMaterialKey as keyof typeof materialCosts] || 0;
    const maxCost = materialCosts[maxMaterialKey as keyof typeof materialCosts] || 0;
    
    const minProfit = minPrice - minCost;
    const maxProfit = maxPrice - maxCost;
    const minProfitMargin = minCost > 0 ? ((minProfit / minPrice) * 100) : 0;
    const maxProfitMargin = maxCost > 0 ? ((maxProfit / maxPrice) * 100) : 0;

    return {
      min: minPrice,
      max: maxPrice,
      basePrice,
      amsFee,
      customizationFee,
      minMaterialUpcharge,
      maxMaterialUpcharge,
      minSizeUpcharge,
      maxSizeUpcharge,
      maxColorUpcharge,
      materialCosts,
      minCost,
      maxCost,
      minProfit,
      maxProfit,
      minProfitMargin,
      maxProfitMargin,
    };
  }, [basePrice, allowedMaterials, allowedSizes, numColors, isCustomizable, pricingSettings, estimatedGramsStandard, estimatedGramsPremium, estimatedGramsUltra, accessoriesCost, materialCostPerGram]);

  if (!priceRange) {
    return (
      <Card className="sticky top-4">
        <CardContent className="p-4">
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-muted rounded w-3/4" />
            <div className="h-8 bg-muted rounded w-1/2" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const hasRange = priceRange.min !== priceRange.max;
  const hasCostData = estimatedGramsStandard > 0 || estimatedGramsPremium > 0 || estimatedGramsUltra > 0;

  return (
    <Card className="sticky top-4 border-primary/20 shadow-lg">
      <CardHeader className="pb-3 bg-primary/5">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Calculator className="w-5 h-5 text-primary" />
          Price Preview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        {/* Price Range Display */}
        <div className="text-center p-4 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
          <p className="text-sm text-muted-foreground mb-1">Customer Price Range</p>
          {hasRange ? (
            <div className="space-y-1">
              <p className="text-3xl font-bold text-primary">
                ${priceRange.min.toFixed(2)} - ${priceRange.max.toFixed(2)}
              </p>
              <p className="text-xs text-muted-foreground">Based on customer selections</p>
            </div>
          ) : (
            <p className="text-3xl font-bold text-primary">${priceRange.min.toFixed(2)}</p>
          )}
        </div>

        {/* Profit Margin Display - only if cost data is available */}
        {hasCostData && (
          <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900">
            <div className="flex items-center gap-2 mb-2">
              <Percent className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-700 dark:text-green-400">Profit Margin</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-xs text-green-600/70 dark:text-green-500/70">Min Profit</p>
                <p className="font-bold text-green-700 dark:text-green-400">
                  ${priceRange.minProfit.toFixed(2)} ({priceRange.minProfitMargin.toFixed(0)}%)
                </p>
              </div>
              <div>
                <p className="text-xs text-green-600/70 dark:text-green-500/70">Max Profit</p>
                <p className="font-bold text-green-700 dark:text-green-400">
                  ${priceRange.maxProfit.toFixed(2)} ({priceRange.maxProfitMargin.toFixed(0)}%)
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Material Cost Breakdown - only if cost data is available */}
        {hasCostData && (
          <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900">
            <div className="flex items-center gap-2 mb-2">
              <Package className="w-4 h-4 text-amber-600" />
              <span className="text-sm font-medium text-amber-700 dark:text-amber-400">Material Costs</span>
            </div>
            <div className="space-y-1 text-xs">
              {allowedMaterials.includes('standard') && estimatedGramsStandard > 0 && (
                <div className="flex justify-between">
                  <span className="text-amber-600/70 dark:text-amber-500/70">Standard ({estimatedGramsStandard}g)</span>
                  <span className="font-medium text-amber-700 dark:text-amber-400">${priceRange.materialCosts.standard.toFixed(2)}</span>
                </div>
              )}
              {allowedMaterials.includes('premium') && estimatedGramsPremium > 0 && (
                <div className="flex justify-between">
                  <span className="text-amber-600/70 dark:text-amber-500/70">Premium ({estimatedGramsPremium}g)</span>
                  <span className="font-medium text-amber-700 dark:text-amber-400">${priceRange.materialCosts.premium.toFixed(2)}</span>
                </div>
              )}
              {allowedMaterials.includes('ultra') && estimatedGramsUltra > 0 && (
                <div className="flex justify-between">
                  <span className="text-amber-600/70 dark:text-amber-500/70">Ultra ({estimatedGramsUltra}g)</span>
                  <span className="font-medium text-amber-700 dark:text-amber-400">${priceRange.materialCosts.ultra.toFixed(2)}</span>
                </div>
              )}
              {accessoriesCost > 0 && (
                <div className="flex justify-between pt-1 border-t border-amber-200 dark:border-amber-800">
                  <span className="text-amber-600/70 dark:text-amber-500/70">Accessories</span>
                  <span className="font-medium text-amber-700 dark:text-amber-400">${accessoriesCost.toFixed(2)}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Min/Max breakdown */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900">
            <div className="flex items-center gap-1 mb-1">
              <TrendingDown className="w-4 h-4 text-green-600" />
              <span className="text-xs font-medium text-green-700 dark:text-green-400">Starting At</span>
            </div>
            <p className="text-xl font-bold text-green-700 dark:text-green-400">
              ${priceRange.min.toFixed(2)}
            </p>
            <p className="text-xs text-green-600/70 dark:text-green-500/70">
              Standard, smallest
            </p>
          </div>
          <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900">
            <div className="flex items-center gap-1 mb-1">
              <TrendingUp className="w-4 h-4 text-amber-600" />
              <span className="text-xs font-medium text-amber-700 dark:text-amber-400">Up To</span>
            </div>
            <p className="text-xl font-bold text-amber-700 dark:text-amber-400">
              ${priceRange.max.toFixed(2)}
            </p>
            <p className="text-xs text-amber-600/70 dark:text-amber-500/70">
              Premium, largest
            </p>
          </div>
        </div>

        {/* Breakdown Details */}
        <div className="space-y-2 text-sm border-t pt-4">
          <div className="flex justify-between py-1">
            <span className="text-muted-foreground">Base Price</span>
            <span className="font-medium">${priceRange.basePrice.toFixed(2)}</span>
          </div>
          
          {priceRange.maxMaterialUpcharge > 0 && (
            <div className="flex justify-between py-1">
              <span className="text-muted-foreground">Material Upcharge</span>
              <span className="text-amber-600">
                +${priceRange.minMaterialUpcharge.toFixed(2)} to +${priceRange.maxMaterialUpcharge.toFixed(2)}
              </span>
            </div>
          )}
          
          {priceRange.maxSizeUpcharge > 0 && (
            <div className="flex justify-between py-1">
              <span className="text-muted-foreground">Size Upcharge</span>
              <span className="text-amber-600">
                +${priceRange.minSizeUpcharge.toFixed(2)} to +${priceRange.maxSizeUpcharge.toFixed(2)}
              </span>
            </div>
          )}
          
          {priceRange.amsFee > 0 && (
            <div className="flex justify-between py-1">
              <span className="text-muted-foreground">AMS Fee ({numColors} colors)</span>
              <span className="text-amber-600">+${priceRange.amsFee.toFixed(2)}</span>
            </div>
          )}
          
          {priceRange.maxColorUpcharge > 0 && (
            <div className="flex justify-between py-1">
              <span className="text-muted-foreground">Premium Color Upcharge</span>
              <span className="text-amber-600">up to +${priceRange.maxColorUpcharge.toFixed(2)}</span>
            </div>
          )}
          
          {priceRange.customizationFee > 0 && (
            <div className="flex justify-between py-1">
              <span className="text-muted-foreground">Customization Fee</span>
              <span className="text-amber-600">+${priceRange.customizationFee.toFixed(2)}</span>
            </div>
          )}
        </div>

        {/* Configuration Summary */}
        <div className="space-y-2 border-t pt-4">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Allowed Options</p>
          <div className="flex flex-wrap gap-1.5">
            {allowedMaterials.map(m => (
              <Badge key={m} variant="secondary" className="capitalize">{m}</Badge>
            ))}
            {allowedSizes.map(s => (
              <Badge key={s} variant="outline" className="capitalize">{s}</Badge>
            ))}
            <Badge variant="outline">{numColors} color{numColors !== 1 ? 's' : ''}</Badge>
            {isCustomizable && <Badge variant="secondary">Customizable</Badge>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}