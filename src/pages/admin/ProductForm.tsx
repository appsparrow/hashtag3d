import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useProduct, useCreateProduct, useUpdateProduct, CreateProductData } from "@/hooks/useProducts";
import { ProductPricingPanel } from "@/components/admin/ProductPricingPanel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Upload, X, Video, Image as ImageIcon, Palette } from "lucide-react";
import { Link } from "react-router-dom";
import { useColors, useMaterials, MaterialCategory, ComplexityTier } from "@/hooks/usePricing";

const SIZE_OPTIONS = ["Small", "Medium", "Large", "Custom"];
const INFILL_OPTIONS = ["20%", "50%", "75%", "100%"];
const COMPLEXITY_OPTIONS: { value: ComplexityTier; label: string }[] = [
  { value: "simple", label: "Simple - No supports, under 60 min" },
  { value: "medium", label: "Medium - Light supports, 60-120 min" },
  { value: "complex", label: "Complex - Heavy supports, over 120 min" },
];

interface ExtendedProductData extends CreateProductData {
  material_category?: MaterialCategory;
  complexity?: ComplexityTier;
}

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  
  const { data: existingProduct, isLoading: productLoading } = useProduct(id ?? "");
  const { data: dbColors } = useColors();
  const { data: dbMaterials } = useMaterials();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();

  const [formData, setFormData] = useState<ExtendedProductData>({
    title: "",
    description: "",
    price: 0,
    is_customizable: false,
    category: "standard",
    colors: [],
    materials: [],
    sizes: [],
    infill_options: [],
    personalization_options: "",
    images: [],
    video_url: "",
    is_active: true,
    material_category: "standard",
    complexity: "simple",
  });

  const [uploading, setUploading] = useState(false);

  // Group colors by material category
  const colorsByCategory = dbColors?.reduce((acc, color) => {
    const category = color.material?.category || 'standard';
    if (!acc[category]) acc[category] = [];
    acc[category].push(color);
    return acc;
  }, {} as Record<string, typeof dbColors>) || {};

  useEffect(() => {
    if (existingProduct) {
      setFormData({
        title: existingProduct.title,
        description: existingProduct.description ?? "",
        price: Number(existingProduct.price),
        is_customizable: existingProduct.is_customizable,
        category: existingProduct.category,
        colors: existingProduct.colors ?? [],
        materials: existingProduct.materials ?? [],
        sizes: existingProduct.sizes ?? [],
        infill_options: existingProduct.infill_options ?? [],
        personalization_options: existingProduct.personalization_options ?? "",
        images: existingProduct.images ?? [],
        video_url: existingProduct.video_url ?? "",
        is_active: existingProduct.is_active,
        material_category: (existingProduct.category as MaterialCategory) || "standard",
        complexity: "simple",
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

  const toggleMaterial = (materialName: string) => {
    const current = formData.materials ?? [];
    const updated = current.includes(materialName)
      ? current.filter(m => m !== materialName)
      : [...current, materialName];
    setFormData({ ...formData, materials: updated });
  };

  const toggleOption = (field: "sizes" | "infill_options", value: string) => {
    const current = formData[field] ?? [];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    setFormData({ ...formData, [field]: updated });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast({ title: "Title is required", variant: "destructive" });
      return;
    }

    const submitData: CreateProductData = {
      ...formData,
      category: formData.material_category || "standard",
    };

    if (isEditing && id) {
      await updateProduct.mutateAsync({ id, ...submitData });
    } else {
      await createProduct.mutateAsync(submitData);
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

                <div className="grid gap-4 sm:grid-cols-2">
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
                    <p className="text-xs text-muted-foreground">Enter cost price. Suggested price will be calculated.</p>
                  </div>

                  <div className="space-y-2">
                    <Label>Material Category</Label>
                    <Select
                      value={formData.material_category}
                      onValueChange={(value: MaterialCategory) => setFormData({ ...formData, material_category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="premium">Premium (+$2-4)</SelectItem>
                        <SelectItem value="ultra">Ultra Premium (+$3-8)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Complexity</Label>
                  <Select
                    value={formData.complexity}
                    onValueChange={(value: ComplexityTier) => setFormData({ ...formData, complexity: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {COMPLEXITY_OPTIONS.map(opt => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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

            {/* Colors from Database */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Available Colors
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(colorsByCategory).map(([category, colors]) => (
                  <div key={category} className="space-y-2">
                    <Label className="capitalize text-muted-foreground">{category} Colors</Label>
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
                      Selected: {formData.colors.length} color{formData.colors.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Materials from Database */}
            <Card>
              <CardHeader>
                <CardTitle>Materials</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {(['standard', 'premium', 'ultra'] as const).map(category => {
                  const categoryMaterials = dbMaterials?.filter(m => m.category === category) || [];
                  if (categoryMaterials.length === 0) return null;
                  return (
                    <div key={category} className="space-y-2">
                      <Label className="capitalize text-muted-foreground">{category}</Label>
                      <div className="flex flex-wrap gap-2">
                        {categoryMaterials.map((material) => (
                          <Button
                            key={material.id}
                            type="button"
                            variant={formData.materials?.includes(material.name) ? "default" : "outline"}
                            size="sm"
                            onClick={() => toggleMaterial(material.name)}
                          >
                            {material.name}
                            {material.upcharge > 0 && (
                              <Badge variant="secondary" className="ml-1 text-xs">
                                +${material.upcharge}
                              </Badge>
                            )}
                          </Button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Sizes & Infill */}
            <Card>
              <CardHeader>
                <CardTitle>Size & Infill Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label>Sizes</Label>
                  <div className="flex flex-wrap gap-2">
                    {SIZE_OPTIONS.map((size) => (
                      <Button
                        key={size}
                        type="button"
                        variant={formData.sizes?.includes(size) ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleOption("sizes", size)}
                      >
                        {size}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Infill Options</Label>
                  <div className="flex flex-wrap gap-2">
                    {INFILL_OPTIONS.map((infill) => (
                      <Button
                        key={infill}
                        type="button"
                        variant={formData.infill_options?.includes(infill) ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleOption("infill_options", infill)}
                      >
                        {infill}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Customization */}
            <Card>
              <CardHeader>
                <CardTitle>Personalization</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                  <div className="space-y-1">
                    <Label>Customizable Product</Label>
                    <p className="text-sm text-muted-foreground">Allow customers to add personalization</p>
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
            materialCategory={formData.material_category || "standard"}
            numColors={formData.colors?.length || 1}
            complexity={formData.complexity || "simple"}
            isCustomizable={formData.is_customizable}
          />
        </div>
      </div>
    </AdminLayout>
  );
}