import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { Calculator, ChevronDown, DollarSign, Info, Clock } from "lucide-react";
import { 
  useMaterials, 
  useComplexitySettings, 
  usePricingSettings, 
  useCustomizationOptions,
  MaterialCategory,
  ComplexityTier,
  calculatePrice 
} from "@/hooks/usePricing";
import { cn } from "@/lib/utils";

interface ProductPricingPanelProps {
  basePrice: number;
  materialCategory: MaterialCategory;
  numColors: number;
  complexity: ComplexityTier;
  isCustomizable: boolean;
  onPriceChange?: (suggestedPrice: number) => void;
}

export function ProductPricingPanel({
  basePrice,
  materialCategory,
  numColors,
  complexity,
  isCustomizable,
}: ProductPricingPanelProps) {
  const { data: materials } = useMaterials();
  const { data: complexitySettings } = useComplexitySettings();
  const { data: pricingSettings } = usePricingSettings();
  const { data: customizationOptions } = useCustomizationOptions();

  const profitMargin = useMemo(() => {
    return pricingSettings?.find(s => s.setting_key === 'profit_margin')?.setting_value || 40;
  }, [pricingSettings]);

  const pricing = useMemo(() => {
    if (!pricingSettings || !complexitySettings) return null;

    const customizationFee = isCustomizable 
      ? (customizationOptions?.find(c => c.name === 'Add Name/Text')?.min_fee || 2)
      : 0;

    return calculatePrice({
      basePrice,
      materialCategory,
      numColors,
      complexity,
      customizationFee,
      pricingSettings,
      complexitySettings,
      profitMargin,
    });
  }, [basePrice, materialCategory, numColors, complexity, isCustomizable, pricingSettings, complexitySettings, customizationOptions, profitMargin]);

  const complexityInfo = useMemo(() => {
    if (!complexitySettings) return null;
    return complexitySettings.find(c => c.tier === complexity);
  }, [complexitySettings, complexity]);

  // Estimate print time in days based on complexity
  const printTimeEstimate = useMemo(() => {
    if (!complexityInfo) return null;
    const minDays = complexityInfo.min_time_minutes ? Math.ceil(complexityInfo.min_time_minutes / 60 / 8) : 0; // 8hr work day
    const maxDays = complexityInfo.max_time_minutes ? Math.ceil(complexityInfo.max_time_minutes / 60 / 8) : minDays + 1;
    
    if (complexity === 'simple') return '1-2 days';
    if (complexity === 'medium') return '2-3 days';
    return '3-5 days';
  }, [complexityInfo, complexity]);

  if (!pricing) {
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

  return (
    <Card className="sticky top-4 border-primary/20 shadow-lg">
      <CardHeader className="pb-3 bg-primary/5">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Calculator className="w-5 h-5 text-primary" />
          Pricing Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        {/* Suggested Price */}
        <div className="text-center p-4 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
          <p className="text-sm text-muted-foreground mb-1">Suggested Price</p>
          <p className="text-4xl font-bold text-primary">${pricing.suggestedPrice.toFixed(2)}</p>
          <p className="text-xs text-muted-foreground mt-1">{profitMargin}% profit margin</p>
        </div>

        {/* Print Time Estimate */}
        {printTimeEstimate && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Approx. Print Time</p>
              <p className="text-xs text-muted-foreground">{printTimeEstimate}</p>
            </div>
          </div>
        )}

        {/* Cost Breakdown */}
        <Collapsible>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              <span className="font-medium">Cost Price: ${pricing.totalCost.toFixed(2)}</span>
            </div>
            <ChevronDown className="w-4 h-4" />
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-3">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-1.5 border-b border-border/50">
                <span className="text-muted-foreground">Base Price</span>
                <span>${pricing.basePrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-border/50">
                <div className="flex items-center gap-1">
                  <span className="text-muted-foreground">Material ({materialCategory})</span>
                  <Badge variant="outline" className="text-xs capitalize">{materialCategory}</Badge>
                </div>
                <span className={cn(pricing.materialUpcharge > 0 ? "text-amber-600" : "")}>
                  +${pricing.materialUpcharge.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-border/50">
                <span className="text-muted-foreground">AMS ({numColors} color{numColors !== 1 ? 's' : ''})</span>
                <span className={cn(pricing.amsFee > 0 ? "text-amber-600" : "")}>
                  +${pricing.amsFee.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-border/50">
                <div className="flex items-center gap-1">
                  <span className="text-muted-foreground">Complexity</span>
                  <Badge variant="outline" className="text-xs capitalize">{complexity}</Badge>
                </div>
                <span className={cn(pricing.complexityFee > 0 ? "text-amber-600" : "")}>
                  +${pricing.complexityFee.toFixed(2)}
                </span>
              </div>
              {pricing.customizationFee > 0 && (
                <div className="flex justify-between py-1.5 border-b border-border/50">
                  <span className="text-muted-foreground">Customization</span>
                  <span className="text-amber-600">+${pricing.customizationFee.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between py-2 font-semibold">
                <span>Total Cost</span>
                <span>${pricing.totalCost.toFixed(2)}</span>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Configuration Summary */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Configuration</p>
          <div className="flex flex-wrap gap-1.5">
            <Badge variant="secondary" className="capitalize">{materialCategory}</Badge>
            <Badge variant="secondary">{numColors} color{numColors !== 1 ? 's' : ''}</Badge>
            <Badge variant="secondary" className="capitalize">{complexity}</Badge>
            {isCustomizable && <Badge variant="secondary">Customizable</Badge>}
          </div>
        </div>

        {/* Help Text */}
        {complexityInfo?.help_text && (
          <div className="flex gap-2 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 text-sm">
            <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
            <p className="text-blue-700 dark:text-blue-300">{complexityInfo.help_text}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
