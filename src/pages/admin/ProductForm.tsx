import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useProduct, useCreateProduct, useUpdateProduct } from "@/hooks/useProducts";
import { ProductPricingPanel } from "@/components/admin/ProductPricingPanel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Upload, X, Video, Image as ImageIcon, Palette, Package, Ruler, DollarSign, Plus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useColors, usePricingSettings } from "@/hooks/usePricing";

const MATERIAL_CATEGORIES = [
  { value: "standard", label: "Standard", description: "Basic PLA materials" },
  { value: "premium", label: "Premium", description: "Higher quality filaments" },
  { value: "ultra", label: "Ultra Premium", description: "Specialty materials" },
];

const SIZE_OPTIONS = [
  { value: "small", label: "Small" },
  { value: "medium", label: "Medium" },
  { value: "large", label: "Large" },
];

const PRESET_COLOR_SLOTS = [
  { id: "background", label: "Background" },
  { id: "foreground", label: "Foreground" },
  { id: "text", label: "Text Color" },
  { id: "border", label: "Border" },
  { id: "accent", label: "Accent" },
  { id: "primary", label: "Primary Color" },
  { id: "secondary", label: "Secondary Color" },
  { id: "highlight", label: "Highlight" },
];

export interface ColorSlot {
  id: string;
  label: string;
}

interface ProductFormData {
  title: string;
  description: string;
  price: number;
  is_customizable: boolean;
  category: string;
  colors: string[];
  allowed_materials: string[];
  allowed_sizes: string[];
  infill_options: string[];
  personalization_options: string;
  images: string[];
  video_url: string;
  is_active: boolean;
  color_slots: ColorSlot[];
  estimated_grams_small: number;
  estimated_grams_medium: number;
  estimated_grams_large: number;
  accessories_cost: number;
}

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  
  const { data: existingProduct, isLoading: productLoading } = useProduct(id ?? "");
  const { data: dbColors } = useColors();
  const { data: pricingSettings } = usePricingSettings();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();

  const [formData, setFormData] = useState<ProductFormData>({
    title: "",
    description: "",
    price: 0,
    is_customizable: false,
    category: "general",
    colors: [],
    allowed_materials: ["standard"],
    allowed_sizes: ["small", "medium", "large"],
    infill_options: [],
    personalization_options: "",
    images: [],
    video_url: "",
    is_active: true,
    color_slots: [],
    estimated_grams_small: 0,
    estimated_grams_medium: 0,
    estimated_grams_large: 0,
    accessories_cost: 0,
  });

  const [uploading, setUploading] = useState(false);

  // Get upcharges from pricing settings
  const getUpcharge = (key: string) => {
    return pricingSettings?.find(s => s.setting_key === key)?.setting_value || 0;
  };

  const materialUpcharges = {
    standard: 0,
    premium: getUpcharge('material_premium_upcharge'),
    ultra: getUpcharge('material_ultra_upcharge'),
  };

  const sizeUpcharges = {
    small: getUpcharge('size_small_upcharge'),
    medium: getUpcharge('size_medium_upcharge'),
    large: getUpcharge('size_large_upcharge'),
  };

  // Group colors by material category
  const colorsByCategory = dbColors?.reduce((acc, color) => {
    const category = color.material?.category || 'standard';
    if (!acc[category]) acc[category] = [];
    acc[category].push(color);
    return acc;
  }, {} as Record<string, typeof dbColors>) || {};

  useEffect(() => {
    if (existingProduct) {
      // Parse color_slots from the product
      let colorSlots: ColorSlot[] = [];
      const rawSlots = (existingProduct as any).color_slots;
      if (rawSlots && Array.isArray(rawSlots)) {
        colorSlots = rawSlots as ColorSlot[];
      }
      
      setFormData({
        title: existingProduct.title,
        description: existingProduct.description ?? "",
        price: Number(existingProduct.price),
        is_customizable: existingProduct.is_customizable,
        category: existingProduct.category,
        colors: existingProduct.colors ?? [],
        allowed_materials: existingProduct.allowed_materials ?? ["standard"],
        allowed_sizes: existingProduct.allowed_sizes ?? ["small", "medium", "large"],
        infill_options: existingProduct.infill_options ?? [],
        personalization_options: existingProduct.personalization_options ?? "",
        images: existingProduct.images ?? [],
        video_url: existingProduct.video_url ?? "",
        is_active: existingProduct.is_active,
        color_slots: colorSlots,
        estimated_grams_small: Number((existingProduct as any).estimated_grams_small) || 0,
        estimated_grams_medium: Number((existingProduct as any).estimated_grams_medium) || 0,
        estimated_grams_large: Number((existingProduct as any).estimated_grams_large) || 0,
        accessories_cost: Number(existingProduct.accessories_cost) || 0,
      });
    }
  }, [existingProduct]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if ((formData.images?.length ?? 0) + files.length > 3) {
      toast({ title: "Maximum 3 images allowed", variant: "destructive" });
      return;
    }

    setUploading(true);
    const newImages: string[] = [];

    for (const file of Array.from(files)) {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(fileName, file);

      if (uploadError) {
        toast({ title: "Upload failed", description: uploadError.message, variant: "destructive" });
        continue;
      }

      const { data: urlData } = supabase.storage
        .from("product-images")
        .getPublicUrl(fileName);

      newImages.push(urlData.publicUrl);
    }

    setFormData({ ...formData, images: [...(formData.images ?? []), ...newImages] });
    setUploading(false);
  };

  const removeImage = (index: number) => {
    const updated = [...(formData.images ?? [])];
    updated.splice(index, 1);
    setFormData({ ...formData, images: updated });
  };

  const toggleColor = (colorName: string) => {
    const current = formData.colors ?? [];
    const updated = current.includes(colorName)
      ? current.filter(c => c !== colorName)
      : [...current, colorName];
    setFormData({ ...formData, colors: updated });
  };

  const toggleAllowedMaterial = (category: string) => {
    const current = formData.allowed_materials ?? [];
    const updated = current.includes(category)
      ? current.filter(m => m !== category)
      : [...current, category];
    // Ensure at least one is selected
    if (updated.length === 0) {
      toast({ title: "At least one material category required", variant: "destructive" });
      return;
    }
    setFormData({ ...formData, allowed_materials: updated });
  };

  const toggleAllowedSize = (size: string) => {
    const current = formData.allowed_sizes ?? [];
    const updated = current.includes(size)
      ? current.filter(s => s !== size)
      : [...current, size];
    // Ensure at least one is selected
    if (updated.length === 0) {
      toast({ title: "At least one size required", variant: "destructive" });
      return;
    }
    setFormData({ ...formData, allowed_sizes: updated });
  };

  const addColorSlot = (slotId: string) => {
    const preset = PRESET_COLOR_SLOTS.find(s => s.id === slotId);
    if (!preset) return;
    if (formData.color_slots.some(s => s.id === slotId)) {
      toast({ title: "This slot is already added", variant: "destructive" });
      return;
    }
    setFormData({ ...formData, color_slots: [...formData.color_slots, { ...preset }] });
  };

  const removeColorSlot = (slotId: string) => {
    setFormData({ ...formData, color_slots: formData.color_slots.filter(s => s.id !== slotId) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast({ title: "Title is required", variant: "destructive" });
      return;
    }

    const submitData = {
      title: formData.title,
      description: formData.description || null,
      price: formData.price,
      is_customizable: formData.is_customizable,
      category: formData.category,
      colors: formData.colors,
      allowed_materials: formData.allowed_materials,
      allowed_sizes: formData.allowed_sizes,
      infill_options: formData.infill_options,
      personalization_options: formData.personalization_options || null,
      images: formData.images,
      video_url: formData.video_url || null,
      is_active: formData.is_active,
      color_slots: formData.color_slots,
      estimated_grams_small: formData.estimated_grams_small,
      estimated_grams_medium: formData.estimated_grams_medium,
      estimated_grams_large: formData.estimated_grams_large,
      accessories_cost: formData.accessories_cost,
      product_number: null, // Explicitly set to null to avoid unique constraint issues
    };

    if (isEditing && id) {
      await updateProduct.mutateAsync({ id, ...submitData } as any);
    } else {
      await createProduct.mutateAsync(submitData as any);
    }
    
    navigate("/admin/products");
  };

  if (productLoading && isEditing) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="flex gap-6">
        {/* Main Form */}
        <div className="flex-1 max-w-3xl space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/admin/products">
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                {isEditing ? "Edit Product" : "Add Product"}
              </h1>
              <p className="text-muted-foreground mt-1">
                {isEditing ? "Update product details" : "Create a new product listing"}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Custom 3D Printed Item"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe your product..."
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Base Price ($) *</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    required
                  />
                  <p className="text-xs text-muted-foreground">Starting price. Customer selections add to this.</p>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                  <div className="space-y-1">
                    <Label>Active</Label>
                    <p className="text-sm text-muted-foreground">Show this product in the shop</p>
                  </div>
                  <Switch
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Allowed Materials */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Allowed Material Types
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Which material categories can customers choose for this product?
                </p>
                <div className="grid gap-3">
                  {MATERIAL_CATEGORIES.map((category) => (
                    <div
                      key={category.value}
                      className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${
                        formData.allowed_materials.includes(category.value)
                          ? "border-primary bg-primary/5"
                          : "border-border"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Checkbox
                          id={`material-${category.value}`}
                          checked={formData.allowed_materials.includes(category.value)}
                          onCheckedChange={() => toggleAllowedMaterial(category.value)}
                        />
                        <div>
                          <Label htmlFor={`material-${category.value}`} className="font-medium cursor-pointer">
                            {category.label}
                          </Label>
                          <p className="text-xs text-muted-foreground">{category.description}</p>
                        </div>
                      </div>
                      {materialUpcharges[category.value as keyof typeof materialUpcharges] > 0 && (
                        <Badge variant="secondary">
                          +${materialUpcharges[category.value as keyof typeof materialUpcharges].toFixed(2)}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Allowed Sizes & Weights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Ruler className="w-5 h-5" />
                  Allowed Sizes & Weight Estimates
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Select available sizes and specify filament weight (grams) for each.
                </p>
                <div className="grid gap-3">
                  {SIZE_OPTIONS.map((size) => {
                    const gramsKey = `estimated_grams_${size.value}` as keyof ProductFormData;
                    const gramsValue = formData[gramsKey] as number;
                    const isSelected = formData.allowed_sizes.includes(size.value);
                    
                    return (
                      <div
                        key={size.value}
                        className={`flex items-center justify-between gap-4 p-4 rounded-lg border transition-colors ${
                          isSelected
                            ? "border-primary bg-primary/5"
                            : "border-border"
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-[120px]">
                          <Checkbox
                            id={`size-${size.value}`}
                            checked={isSelected}
                            onCheckedChange={() => toggleAllowedSize(size.value)}
                          />
                          <Label htmlFor={`size-${size.value}`} className="font-medium cursor-pointer">
                            {size.label}
                          </Label>
                        </div>
                        <div className="flex items-center gap-2 flex-1 max-w-[200px]">
                          <Input
                            type="number"
                            min="0"
                            step="0.1"
                            placeholder="0"
                            value={gramsValue || ""}
                            onChange={(e) => setFormData({ 
                              ...formData, 
                              [gramsKey]: parseFloat(e.target.value) || 0 
                            })}
                            className="h-9"
                            disabled={!isSelected}
                          />
                          <span className="text-sm text-muted-foreground whitespace-nowrap">grams</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Accessories Cost */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Additional Costs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="accessories_cost">Accessories Cost ($)</Label>
                  <Input
                    id="accessories_cost"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.accessories_cost}
                    onChange={(e) => setFormData({ ...formData, accessories_cost: parseFloat(e.target.value) || 0 })}
                    className="max-w-[200px]"
                  />
                  <p className="text-xs text-muted-foreground">Cost for key rings, cases, or other included accessories.</p>
                </div>
              </CardContent>
            </Card>

            {/* Images */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5" />
                  Images (up to 3)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-3">
                  {formData.images?.map((img, idx) => (
                    <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-border">
                      <img src={img} alt={`Product ${idx + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-destructive text-destructive-foreground"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  
                  {(formData.images?.length ?? 0) < 3 && (
                    <label className="aspect-square rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors">
                      <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                      <span className="text-sm text-muted-foreground">
                        {uploading ? "Uploading..." : "Upload"}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        className="hidden"
                        disabled={uploading}
                      />
                    </label>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Video */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="w-5 h-5" />
                  Video (Optional)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  value={formData.video_url ?? ""}
                  onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                  placeholder="https://youtube.com/watch?v=... or video URL"
                />
              </CardContent>
            </Card>

            {/* Color Slots Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Color Slots for Customers
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Define which color selections customers need to make (e.g., Background, Foreground, Text Color).
                  Each slot will let customers pick from available colors.
                </p>
                
                {/* Add Color Slot */}
                <div className="flex gap-2">
                  <Select onValueChange={addColorSlot}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Add a color slot..." />
                    </SelectTrigger>
                    <SelectContent>
                      {PRESET_COLOR_SLOTS.filter(s => !formData.color_slots.some(cs => cs.id === s.id)).map((slot) => (
                        <SelectItem key={slot.id} value={slot.id}>
                          {slot.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Current Color Slots */}
                {formData.color_slots.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Active Color Slots</Label>
                    <div className="flex flex-wrap gap-2">
                      {formData.color_slots.map((slot) => (
                        <Badge
                          key={slot.id}
                          variant="secondary"
                          className="px-3 py-1.5 flex items-center gap-2"
                        >
                          {slot.label}
                          <button
                            type="button"
                            onClick={() => removeColorSlot(slot.id)}
                            className="ml-1 hover:text-destructive"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Customers will select {formData.color_slots.length} color{formData.color_slots.length !== 1 ? 's' : ''}.
                      {formData.color_slots.length > 1 && ' Multiple colors add AMS fees.'}
                    </p>
                  </div>
                )}

                {formData.color_slots.length === 0 && (
                  <p className="text-sm text-muted-foreground italic">No color slots defined. Customers won't be able to select colors.</p>
                )}
              </CardContent>
            </Card>

            {/* Available Colors from Database */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Available Color Options
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Select which colors customers can choose from for each slot.
                  Premium/Ultra colors add upcharges.
                </p>
                {Object.entries(colorsByCategory).map(([category, colors]) => (
                  <div key={category} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Label className="capitalize text-muted-foreground">{category} Colors</Label>
                      {category === 'premium' && (
                        <Badge variant="outline" className="text-xs">+${getUpcharge('color_premium_upcharge').toFixed(2)}</Badge>
                      )}
                      {category === 'ultra' && (
                        <Badge variant="outline" className="text-xs">+${getUpcharge('color_ultra_upcharge').toFixed(2)}</Badge>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {colors?.map((color) => (
                        <button
                          key={color.id}
                          type="button"
                          onClick={() => toggleColor(color.name)}
                          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all ${
                            formData.colors?.includes(color.name)
                              ? "border-primary bg-primary/10 ring-2 ring-primary ring-offset-1"
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          <span
                            className="w-4 h-4 rounded-full border border-border/50"
                            style={{ backgroundColor: color.hex_color }}
                          />
                          <span className="text-sm">{color.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
                {formData.colors && formData.colors.length > 0 && (
                  <div className="pt-2 border-t">
                    <p className="text-sm text-muted-foreground">
                      {formData.colors.length} color options available for customers
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Personalization */}
            <Card>
              <CardHeader>
                <CardTitle>Personalization</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                  <div className="space-y-1">
                    <Label>Customizable Product</Label>
                    <p className="text-sm text-muted-foreground">Allow customers to add personalization (+${getUpcharge('customization_fee').toFixed(2)})</p>
                  </div>
                  <Switch
                    checked={formData.is_customizable}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_customizable: checked })}
                  />
                </div>

                {formData.is_customizable && (
                  <div className="space-y-2">
                    <Label htmlFor="personalization">Personalization Options</Label>
                    <Textarea
                      id="personalization"
                      value={formData.personalization_options ?? ""}
                      onChange={(e) => setFormData({ ...formData, personalization_options: e.target.value })}
                      placeholder="e.g., Custom text, name engraving, date..."
                      rows={3}
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex gap-4">
              <Button type="button" variant="outline" onClick={() => navigate("/admin/products")} className="flex-1">
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="flex-1"
                disabled={createProduct.isPending || updateProduct.isPending}
              >
                {createProduct.isPending || updateProduct.isPending ? "Saving..." : (isEditing ? "Update Product" : "Create Product")}
              </Button>
            </div>
          </form>
        </div>

        {/* Floating Pricing Panel */}
        <div className="hidden lg:block w-80">
          <ProductPricingPanel
            basePrice={formData.price}
            allowedMaterials={formData.allowed_materials}
            allowedSizes={formData.allowed_sizes}
            numColors={formData.color_slots.length}
            isCustomizable={formData.is_customizable}
            estimatedGramsSmall={formData.estimated_grams_small}
            estimatedGramsMedium={formData.estimated_grams_medium}
            estimatedGramsLarge={formData.estimated_grams_large}
            accessoriesCost={formData.accessories_cost}
          />
        </div>
      </div>
    </AdminLayout>
  );
}
