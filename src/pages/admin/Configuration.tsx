import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  useMaterials, useCreateMaterial, useUpdateMaterial, useDeleteMaterial,
  useColors, useCreateColor, useUpdateColor, useDeleteColor,
  useComplexitySettings, useUpdateComplexitySetting,
  usePricingSettings, useUpdatePricingSetting,
  MaterialCategory,
} from "@/hooks/usePricing";
import { Palette, Layers, Settings2, DollarSign, Plus, Trash2, Loader2 } from "lucide-react";

export default function Configuration() {
  const { data: materials = [], isLoading: loadingMaterials } = useMaterials();
  const { data: colors = [], isLoading: loadingColors } = useColors();
  const { data: complexitySettings = [], isLoading: loadingComplexity } = useComplexitySettings();
  const { data: pricingSettings = [], isLoading: loadingPricing } = usePricingSettings();

  const createMaterial = useCreateMaterial();
  const updateMaterial = useUpdateMaterial();
  const deleteMaterial = useDeleteMaterial();
  const createColor = useCreateColor();
  const updateColor = useUpdateColor();
  const deleteColor = useDeleteColor();
  const updateComplexity = useUpdateComplexitySetting();
  const updatePricingSetting = useUpdatePricingSetting();

  const [newMaterial, setNewMaterial] = useState({ name: "", category: "standard" as MaterialCategory, cost_per_gram: 0.03, upcharge: 0 });
  const [newColor, setNewColor] = useState({ name: "", hex_color: "#000000", material_id: "", stock_quantity: 1000 });
  
  // State for pricing settings to fix controlled input issue
  const [amsBaseFee, setAmsBaseFee] = useState<number>(0);
  const [amsPerColorFee, setAmsPerColorFee] = useState<number>(0);
  const [profitMargin, setProfitMargin] = useState<number>(0);
  
  // Update state when settings load
  useEffect(() => {
    if (pricingSettings.length > 0) {
      setAmsBaseFee(getSetting("ams_base_fee") || 0);
      setAmsPerColorFee(getSetting("ams_per_color_fee") || 0);
      setProfitMargin(getSetting("profit_margin") || 0);
    }
  }, [pricingSettings]);

  const isLoading = loadingMaterials || loadingColors || loadingComplexity || loadingPricing;

  const getSetting = (key: string) => pricingSettings.find(s => s.setting_key === key)?.setting_value || 0;

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
        <div>
          <h1 className="text-3xl font-bold text-foreground">Configuration</h1>
          <p className="text-muted-foreground mt-1">Manage materials, colors, complexity tiers, and pricing rules.</p>
        </div>

        <Tabs defaultValue="materials" className="space-y-4">
          <TabsList className="grid grid-cols-4 w-full max-w-2xl">
            <TabsTrigger value="materials"><Layers className="w-4 h-4 mr-1" />Materials</TabsTrigger>
            <TabsTrigger value="colors"><Palette className="w-4 h-4 mr-1" />Colors</TabsTrigger>
            <TabsTrigger value="complexity"><Settings2 className="w-4 h-4 mr-1" />Complexity</TabsTrigger>
            <TabsTrigger value="upcharges"><DollarSign className="w-4 h-4 mr-1" />Upcharges</TabsTrigger>
          </TabsList>

          {/* Materials Tab */}
          <TabsContent value="materials" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Material Categories</CardTitle>
                <CardDescription>Manage filament materials by tier (standard, premium, ultra)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-4 gap-2">
                  <Input
                    placeholder="Material name"
                    value={newMaterial.name}
                    onChange={(e) => setNewMaterial(p => ({ ...p, name: e.target.value }))}
                  />
                  <Select
                    value={newMaterial.category}
                    onValueChange={(v) => setNewMaterial(p => ({ ...p, category: v as MaterialCategory }))}
                  >
                    <SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                      <SelectItem value="ultra">Ultra</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    placeholder="Cost/gram"
                    value={newMaterial.cost_per_gram}
                    onChange={(e) => setNewMaterial(p => ({ ...p, cost_per_gram: Number(e.target.value) }))}
                    step={0.01}
                  />
                  <Button
                    onClick={() => {
                      createMaterial.mutate({ ...newMaterial, is_active: true });
                      setNewMaterial({ name: "", category: "standard", cost_per_gram: 0.03, upcharge: 0 });
                    }}
                    disabled={!newMaterial.name || createMaterial.isPending}
                  >
                    <Plus className="w-4 h-4 mr-1" />Add
                  </Button>
                </div>

                <div className="space-y-4">
                  {(["standard", "premium", "ultra"] as const).map(cat => (
                    <div key={cat} className="space-y-2">
                      <h4 className="font-medium capitalize flex items-center gap-2">
                        <Badge variant={cat === "standard" ? "secondary" : cat === "premium" ? "default" : "destructive"}>
                          {cat}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          (+${getSetting(`material_${cat}_upcharge`)} when customer selects)
                        </span>
                      </h4>
                      <div className="grid gap-2">
                        {materials.filter(m => m.category === cat).map(material => (
                          <div key={material.id} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                            <div>
                              <span className="font-medium">{material.name}</span>
                              <span className="text-sm text-muted-foreground ml-2">${material.cost_per_gram}/g</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={material.is_active}
                                onCheckedChange={(checked) => updateMaterial.mutate({ id: material.id, is_active: checked })}
                              />
                              <Button variant="ghost" size="icon" onClick={() => deleteMaterial.mutate(material.id)}>
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Colors Tab */}
          <TabsContent value="colors" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Color Library</CardTitle>
                <CardDescription>Colors are grouped by material category for pricing. Premium/Ultra colors have upcharges.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-5 gap-2">
                  <Input
                    placeholder="Color name"
                    value={newColor.name}
                    onChange={(e) => setNewColor(p => ({ ...p, name: e.target.value }))}
                  />
                  <Input
                    type="color"
                    value={newColor.hex_color}
                    onChange={(e) => setNewColor(p => ({ ...p, hex_color: e.target.value }))}
                    className="h-10"
                  />
                  <Select
                    value={newColor.material_id || "none"}
                    onValueChange={(v) => setNewColor(p => ({ ...p, material_id: v === "none" ? "" : v }))}
                  >
                    <SelectTrigger><SelectValue placeholder="Material" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Material</SelectItem>
                      {materials.map(m => (
                        <SelectItem key={m.id} value={m.id}>{m.name} ({m.category})</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    placeholder="Stock (g)"
                    value={newColor.stock_quantity}
                    onChange={(e) => setNewColor(p => ({ ...p, stock_quantity: Number(e.target.value) }))}
                  />
                  <Button
                    onClick={() => {
                      createColor.mutate({ ...newColor, is_active: true, material_id: newColor.material_id || null });
                      setNewColor({ name: "", hex_color: "#000000", material_id: "", stock_quantity: 1000 });
                    }}
                    disabled={!newColor.name || createColor.isPending}
                  >
                    <Plus className="w-4 h-4 mr-1" />Add
                  </Button>
                </div>

                <div className="space-y-4">
                  {(["standard", "premium", "ultra"] as const).map(cat => {
                    const catColors = colors.filter(c => c.material?.category === cat || (!c.material && cat === "standard"));
                    if (catColors.length === 0) return null;
                    return (
                      <div key={cat} className="space-y-2">
                        <h4 className="font-medium capitalize flex items-center gap-2">
                          <Badge variant={cat === "standard" ? "secondary" : cat === "premium" ? "default" : "destructive"}>
                            {cat} Colors
                          </Badge>
                          {cat !== "standard" && (
                            <span className="text-sm text-muted-foreground">
                              (+${getSetting(`color_${cat}_upcharge`)} when customer selects)
                            </span>
                          )}
                        </h4>
                        <div className="flex flex-col gap-2">
                          {catColors.map(color => (
                            <div key={color.id} className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg border border-border">
                              <Input 
                                type="color"
                                value={color.hex_color}
                                onChange={(e) => updateColor.mutate({ id: color.id, hex_color: e.target.value })}
                                className="w-8 h-8 p-0 border-none rounded-full overflow-hidden shrink-0 cursor-pointer"
                              />
                              <div className="flex-1 min-w-0">
                                <Input
                                  value={color.name}
                                  onChange={(e) => {
                                    // Update locally first for responsiveness (optional, but good for typing)
                                    // For now, we rely on onBlur to save to DB to avoid too many requests
                                  }}
                                  onBlur={(e) => {
                                    if (e.target.value !== color.name) {
                                      updateColor.mutate({ id: color.id, name: e.target.value });
                                    }
                                  }}
                                  className="h-8 text-sm font-medium bg-transparent border-transparent hover:border-input focus:bg-background focus:border-input px-1"
                                />
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <Label className="text-xs text-muted-foreground whitespace-nowrap hidden sm:block">Stock (g):</Label>
                                <Input 
                                  type="number" 
                                  className="w-20 h-8 text-right" 
                                  defaultValue={color.stock_quantity ?? 1000}
                                  onBlur={(e) => updateColor.mutate({ id: color.id, stock_quantity: Number(e.target.value) })}
                                />
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => deleteColor.mutate(color.id)}>
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Complexity Tab */}
          <TabsContent value="complexity" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Complexity Tiers</CardTitle>
                <CardDescription>Set fees and print time estimates for each complexity level</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {complexitySettings.map(tier => (
                  <div key={tier.id} className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium capitalize">{tier.tier}</p>
                      <p className="text-sm text-muted-foreground">{tier.description || "No description"}</p>
                      {tier.min_time_minutes && tier.max_time_minutes && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Est. time: {Math.round(tier.min_time_minutes / 60)}-{Math.round(tier.max_time_minutes / 60)} hours
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="text-sm">Fee $</Label>
                      <Input
                        type="number"
                        value={tier.fee}
                        onChange={(e) => updateComplexity.mutate({ id: tier.id, fee: Number(e.target.value) })}
                        className="w-20"
                        step={0.5}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Upcharges Tab */}
          <TabsContent value="upcharges" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Customer Selection Upcharges</CardTitle>
                <CardDescription>
                  These fees are added when a customer selects premium options. Base price is set per product.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Material Upcharges */}
                <div className="space-y-3">
                  <h4 className="font-medium">Material Selection</h4>
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <Label className="text-sm text-muted-foreground">Standard</Label>
                      <p className="text-lg font-semibold">$0 (base)</p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg space-y-2">
                      <Label className="text-sm">Premium Upcharge</Label>
                      <div className="flex items-center gap-2">
                        <span>$</span>
                        <Input
                          type="number"
                          value={getSetting("material_premium_upcharge")}
                          onChange={(e) => updatePricingSetting.mutate({ key: "material_premium_upcharge", value: Number(e.target.value) })}
                          step={0.5}
                        />
                      </div>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg space-y-2">
                      <Label className="text-sm">Ultra Upcharge</Label>
                      <div className="flex items-center gap-2">
                        <span>$</span>
                        <Input
                          type="number"
                          value={getSetting("material_ultra_upcharge")}
                          onChange={(e) => updatePricingSetting.mutate({ key: "material_ultra_upcharge", value: Number(e.target.value) })}
                          step={0.5}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Size Upcharges */}
                <div className="space-y-3">
                  <h4 className="font-medium">Size Selection</h4>
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div className="p-3 bg-muted/50 rounded-lg space-y-2">
                      <Label className="text-sm">Small Upcharge</Label>
                      <div className="flex items-center gap-2">
                        <span>$</span>
                        <Input
                          type="number"
                          value={getSetting("size_small_upcharge")}
                          onChange={(e) => updatePricingSetting.mutate({ key: "size_small_upcharge", value: Number(e.target.value) })}
                          step={0.5}
                        />
                      </div>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg space-y-2">
                      <Label className="text-sm">Medium Upcharge</Label>
                      <div className="flex items-center gap-2">
                        <span>$</span>
                        <Input
                          type="number"
                          value={getSetting("size_medium_upcharge")}
                          onChange={(e) => updatePricingSetting.mutate({ key: "size_medium_upcharge", value: Number(e.target.value) })}
                          step={0.5}
                        />
                      </div>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg space-y-2">
                      <Label className="text-sm">Large Upcharge</Label>
                      <div className="flex items-center gap-2">
                        <span>$</span>
                        <Input
                          type="number"
                          value={getSetting("size_large_upcharge")}
                          onChange={(e) => updatePricingSetting.mutate({ key: "size_large_upcharge", value: Number(e.target.value) })}
                          step={0.5}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Color Upcharges */}
                <div className="space-y-3">
                  <h4 className="font-medium">Color Category Selection</h4>
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <Label className="text-sm text-muted-foreground">Standard Colors</Label>
                      <p className="text-lg font-semibold">$0 (base)</p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg space-y-2">
                      <Label className="text-sm">Premium Color Upcharge</Label>
                      <div className="flex items-center gap-2">
                        <span>$</span>
                        <Input
                          type="number"
                          value={getSetting("color_premium_upcharge")}
                          onChange={(e) => updatePricingSetting.mutate({ key: "color_premium_upcharge", value: Number(e.target.value) })}
                          step={0.5}
                        />
                      </div>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg space-y-2">
                      <Label className="text-sm">Ultra Color Upcharge</Label>
                      <div className="flex items-center gap-2">
                        <span>$</span>
                        <Input
                          type="number"
                          value={getSetting("color_ultra_upcharge")}
                          onChange={(e) => updatePricingSetting.mutate({ key: "color_ultra_upcharge", value: Number(e.target.value) })}
                          step={0.5}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* AMS/Multi-color */}
                <div className="space-y-3">
                  <h4 className="font-medium">Multi-Color (AMS) Fees</h4>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="p-3 bg-muted/50 rounded-lg space-y-2">
                      <Label className="text-sm">Base AMS Fee (2+ colors)</Label>
                      <div className="flex items-center gap-2">
                        <span>$</span>
                        <Input
                          type="number"
                          value={amsBaseFee}
                          onChange={(e) => {
                            const val = Number(e.target.value) || 0;
                            setAmsBaseFee(val);
                            updatePricingSetting.mutate({ key: "ams_base_fee", value: val });
                          }}
                          step={0.5}
                        />
                      </div>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg space-y-2">
                      <Label className="text-sm">Per Extra Color Fee</Label>
                      <div className="flex items-center gap-2">
                        <span>$</span>
                        <Input
                          type="number"
                          value={amsPerColorFee}
                          onChange={(e) => {
                            const val = Number(e.target.value) || 0;
                            setAmsPerColorFee(val);
                            updatePricingSetting.mutate({ key: "ams_per_color_fee", value: val });
                          }}
                          step={0.5}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Profit Margin */}
                <div className="space-y-3">
                  <h4 className="font-medium">Global Settings</h4>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="p-3 bg-muted/50 rounded-lg space-y-2">
                      <Label className="text-sm">Profit Margin %</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          value={profitMargin}
                          onChange={(e) => {
                            const val = Number(e.target.value) || 0;
                            setProfitMargin(val);
                            updatePricingSetting.mutate({ key: "profit_margin", value: val });
                          }}
                          step={5}
                          min={0}
                          max={100}
                        />
                        <span>%</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Applied to suggested retail price</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}