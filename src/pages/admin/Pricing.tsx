import { useState, useMemo } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Switch } from "@/components/ui/switch";
import {
  useMaterials, useCreateMaterial, useUpdateMaterial, useDeleteMaterial,
  useColors, useCreateColor, useUpdateColor, useDeleteColor,
  useComplexitySettings, useUpdateComplexitySetting,
  useFinishOptions, useCreateFinishOption, useUpdateFinishOption, useDeleteFinishOption,
  useCustomizationOptions, useUpdateCustomizationOption,
  usePricingSettings, useUpdatePricingSetting,
  calculatePrice,
  MaterialCategory, ComplexityTier, Material
} from "@/hooks/usePricing";
import { 
  Calculator, Palette, Layers, Settings2, Sparkles, DollarSign, 
  Plus, Trash2, Edit2, Save, X, ChevronDown, Loader2, Info
} from "lucide-react";

export default function Pricing() {
  const { data: materials = [], isLoading: loadingMaterials } = useMaterials();
  const { data: colors = [], isLoading: loadingColors } = useColors();
  const { data: complexitySettings = [], isLoading: loadingComplexity } = useComplexitySettings();
  const { data: finishOptions = [], isLoading: loadingFinish } = useFinishOptions();
  const { data: customizationOptions = [], isLoading: loadingCustomization } = useCustomizationOptions();
  const { data: pricingSettings = [], isLoading: loadingPricing } = usePricingSettings();

  const createMaterial = useCreateMaterial();
  const updateMaterial = useUpdateMaterial();
  const deleteMaterial = useDeleteMaterial();
  const createColor = useCreateColor();
  const updateColor = useUpdateColor();
  const deleteColor = useDeleteColor();
  const updateComplexity = useUpdateComplexitySetting();
  const createFinish = useCreateFinishOption();
  const updateFinish = useUpdateFinishOption();
  const deleteFinish = useDeleteFinishOption();
  const updateCustomization = useUpdateCustomizationOption();
  const updatePricingSetting = useUpdatePricingSetting();

  // Calculator state
  const [calcBasePrice, setCalcBasePrice] = useState(10);
  const [calcMaterial, setCalcMaterial] = useState<MaterialCategory>("standard");
  const [calcColors, setCalcColors] = useState(1);
  const [calcComplexity, setCalcComplexity] = useState<ComplexityTier>("simple");
  const [calcCustomization, setCalcCustomization] = useState(0);
  const [showCostDetails, setShowCostDetails] = useState(false);

  // Form states
  const [newMaterial, setNewMaterial] = useState({ name: "", category: "standard" as MaterialCategory, cost_per_gram: 0.03, upcharge: 0 });
  const [newColor, setNewColor] = useState({ name: "", hex_color: "#000000", material_id: "" });
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);

  const isLoading = loadingMaterials || loadingColors || loadingComplexity || loadingFinish || loadingCustomization || loadingPricing;

  const calculatedPrice = useMemo(() => {
    if (pricingSettings.length === 0 || complexitySettings.length === 0) return null;
    return calculatePrice({
      basePrice: calcBasePrice,
      materialCategory: calcMaterial,
      numColors: calcColors,
      complexity: calcComplexity,
      customizationFee: calcCustomization,
      pricingSettings,
      complexitySettings,
    });
  }, [calcBasePrice, calcMaterial, calcColors, calcComplexity, calcCustomization, pricingSettings, complexitySettings]);

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
          <h1 className="text-3xl font-bold text-foreground">Pricing Calculator</h1>
          <p className="text-muted-foreground mt-1">Configure materials, colors, and pricing parameters.</p>
        </div>

        <Tabs defaultValue="calculator" className="space-y-4">
          <TabsList className="grid grid-cols-6 w-full max-w-3xl">
            <TabsTrigger value="calculator"><Calculator className="w-4 h-4 mr-1" />Calculator</TabsTrigger>
            <TabsTrigger value="materials"><Layers className="w-4 h-4 mr-1" />Materials</TabsTrigger>
            <TabsTrigger value="colors"><Palette className="w-4 h-4 mr-1" />Colors</TabsTrigger>
            <TabsTrigger value="complexity"><Settings2 className="w-4 h-4 mr-1" />Complexity</TabsTrigger>
            <TabsTrigger value="finish"><Sparkles className="w-4 h-4 mr-1" />Finish</TabsTrigger>
            <TabsTrigger value="settings"><DollarSign className="w-4 h-4 mr-1" />Settings</TabsTrigger>
          </TabsList>

          {/* Calculator Tab */}
          <TabsContent value="calculator" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Price Calculator</CardTitle>
                  <CardDescription>Enter parameters to calculate suggested pricing</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Base Price ($)</Label>
                    <Input
                      type="number"
                      value={calcBasePrice}
                      onChange={(e) => setCalcBasePrice(Number(e.target.value))}
                      min={0}
                      step={0.5}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Material Category</Label>
                    <Select value={calcMaterial} onValueChange={(v) => setCalcMaterial(v as MaterialCategory)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Standard (+${getSetting("standard_upcharge")})</SelectItem>
                        <SelectItem value="premium">Premium (+${getSetting("premium_upcharge")})</SelectItem>
                        <SelectItem value="ultra">Ultra Premium (+${getSetting("ultra_upcharge")})</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Number of Colors</Label>
                    <Select value={String(calcColors)} onValueChange={(v) => setCalcColors(Number(v))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5].map(n => (
                          <SelectItem key={n} value={String(n)}>{n} color{n > 1 ? "s" : ""}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Complexity</Label>
                    <Select value={calcComplexity} onValueChange={(v) => setCalcComplexity(v as ComplexityTier)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {complexitySettings.map(c => (
                          <SelectItem key={c.tier} value={c.tier}>
                            {c.tier.charAt(0).toUpperCase() + c.tier.slice(1)} (+${c.fee})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Customization Fee ($)</Label>
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

              <Card className="bg-primary/5 border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-primary" />
                    Pricing Result
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {calculatedPrice && (
                    <>
                      <div className="text-center py-4">
                        <p className="text-sm text-muted-foreground">Suggested Retail Price</p>
                        <p className="text-5xl font-bold text-primary">${calculatedPrice.suggestedPrice}</p>
                        <p className="text-sm text-muted-foreground mt-2">Cost: ${calculatedPrice.totalCost.toFixed(2)}</p>
                      </div>

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
                        <CollapsibleContent className="space-y-2 pt-2">
                          <div className="flex justify-between text-sm">
                            <span>Base Price</span>
                            <span>${calculatedPrice.basePrice.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Material Upcharge</span>
                            <span>${calculatedPrice.materialUpcharge.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>AMS/Multi-color Fee</span>
                            <span>${calculatedPrice.amsFee.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Complexity Fee</span>
                            <span>${calculatedPrice.complexityFee.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Customization Fee</span>
                            <span>${calculatedPrice.customizationFee.toFixed(2)}</span>
                          </div>
                          <div className="border-t pt-2 flex justify-between font-semibold">
                            <span>Total Cost</span>
                            <span>${calculatedPrice.totalCost.toFixed(2)}</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">
                            Suggested price includes 40% profit margin
                          </p>
                        </CollapsibleContent>
                      </Collapsible>

                      <div className="bg-muted/50 rounded-lg p-3 text-sm">
                        <p className="font-medium mb-2">Pricing Questions to Consider:</p>
                        <ul className="space-y-1 text-muted-foreground">
                          <li>• Is this a limited edition or seasonal item?</li>
                          <li>• What's the competitor pricing for similar items?</li>
                          <li>• Does this require any special handling?</li>
                          <li>• What's the expected demand volume?</li>
                        </ul>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Materials Tab */}
          <TabsContent value="materials" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Material Categories</CardTitle>
                <CardDescription>Manage filament materials and their pricing tiers</CardDescription>
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
                    <SelectTrigger>
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
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

                <div className="space-y-2">
                  {["standard", "premium", "ultra"].map(cat => (
                    <div key={cat} className="space-y-2">
                      <h4 className="font-medium capitalize flex items-center gap-2">
                        <Badge variant={cat === "standard" ? "secondary" : cat === "premium" ? "default" : "destructive"}>
                          {cat}
                        </Badge>
                      </h4>
                      <div className="grid gap-2">
                        {materials.filter(m => m.category === cat).map(material => (
                          <div key={material.id} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                            <div>
                              <span className="font-medium">{material.name}</span>
                              <span className="text-sm text-muted-foreground ml-2">
                                ${material.cost_per_gram}/g
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={material.is_active}
                                onCheckedChange={(checked) => updateMaterial.mutate({ id: material.id, is_active: checked })}
                              />
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => deleteMaterial.mutate(material.id)}
                              >
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
                <CardDescription>Manage available colors and their material associations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-4 gap-2">
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
                    value={newColor.material_id}
                    onValueChange={(v) => setNewColor(p => ({ ...p, material_id: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Material" />
                    </SelectTrigger>
                    <SelectContent>
                      {materials.filter(m => m.is_active).map(m => (
                        <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    onClick={() => {
                      createColor.mutate({ ...newColor, is_active: true, material_id: newColor.material_id || null });
                      setNewColor({ name: "", hex_color: "#000000", material_id: "" });
                    }}
                    disabled={!newColor.name || createColor.isPending}
                  >
                    <Plus className="w-4 h-4 mr-1" />Add
                  </Button>
                </div>

                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {colors.map(color => (
                    <div key={color.id} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-6 h-6 rounded-full border"
                          style={{ backgroundColor: color.hex_color }}
                        />
                        <div>
                          <span className="font-medium">{color.name}</span>
                          {color.material && (
                            <Badge variant="outline" className="ml-2 text-xs">
                              {color.material.category}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteColor.mutate(color.id)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Complexity Tab */}
          <TabsContent value="complexity" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Complexity Tiers</CardTitle>
                <CardDescription>Configure pricing based on print complexity</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {complexitySettings.map(setting => (
                  <div key={setting.id} className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge variant={setting.tier === "simple" ? "secondary" : setting.tier === "medium" ? "default" : "destructive"}>
                        {setting.tier.toUpperCase()}
                      </Badge>
                      <div className="flex items-center gap-2">
                        <Label>Fee: $</Label>
                        <Input
                          type="number"
                          value={setting.fee}
                          onChange={(e) => updateComplexity.mutate({ id: setting.id, fee: Number(e.target.value) })}
                          className="w-20"
                          step={0.5}
                        />
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{setting.description}</p>
                    <p className="text-xs text-muted-foreground">
                      Time: {setting.min_time_minutes}-{setting.max_time_minutes || "∞"} minutes
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Finish Tab */}
          <TabsContent value="finish" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Finish Options</CardTitle>
                <CardDescription>Admin-only finish types (not shown to customers)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-3 gap-2">
                  <Input placeholder="Finish name" id="finish-name" />
                  <Input type="number" placeholder="Fee" id="finish-fee" step={0.5} />
                  <Button
                    onClick={() => {
                      const name = (document.getElementById("finish-name") as HTMLInputElement).value;
                      const fee = Number((document.getElementById("finish-fee") as HTMLInputElement).value);
                      if (name) {
                        createFinish.mutate({ name, fee, is_active: true });
                        (document.getElementById("finish-name") as HTMLInputElement).value = "";
                        (document.getElementById("finish-fee") as HTMLInputElement).value = "";
                      }
                    }}
                  >
                    <Plus className="w-4 h-4 mr-1" />Add
                  </Button>
                </div>

                <div className="space-y-2">
                  {finishOptions.map(option => (
                    <div key={option.id} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                      <div>
                        <span className="font-medium">{option.name}</span>
                        <span className="text-sm text-muted-foreground ml-2">+${option.fee}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={option.is_active}
                          onCheckedChange={(checked) => updateFinish.mutate({ id: option.id, is_active: checked })}
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteFinish.mutate(option.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Customization Options</CardTitle>
                <CardDescription>Pricing for personalization services</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {customizationOptions.map(option => (
                  <div key={option.id} className="p-3 border rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{option.name}</span>
                      <Switch
                        checked={option.is_active}
                        onCheckedChange={(checked) => updateCustomization.mutate({ id: option.id, is_active: checked })}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">{option.description}</p>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Label className="text-xs">Min:</Label>
                        <Input
                          type="number"
                          value={option.min_fee}
                          onChange={(e) => updateCustomization.mutate({ id: option.id, min_fee: Number(e.target.value) })}
                          className="w-20 h-8"
                          step={0.5}
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Label className="text-xs">Max:</Label>
                        <Input
                          type="number"
                          value={option.max_fee}
                          onChange={(e) => updateCustomization.mutate({ id: option.id, max_fee: Number(e.target.value) })}
                          className="w-20 h-8"
                          step={0.5}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Global Pricing Settings</CardTitle>
                <CardDescription>Configure base fees and upcharges</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {pricingSettings.map(setting => (
                  <div key={setting.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium">{setting.setting_key.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}</p>
                      <p className="text-sm text-muted-foreground">{setting.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>$</span>
                      <Input
                        type="number"
                        value={setting.setting_value}
                        onChange={(e) => updatePricingSetting.mutate({ key: setting.setting_key, value: Number(e.target.value) })}
                        className="w-24"
                        step={0.5}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
