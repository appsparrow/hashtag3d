import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useProduct, useCreateProduct, useUpdateProduct, CreateProductData } from "@/hooks/useProducts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Upload, X, Video, Image as ImageIcon } from "lucide-react";
import { Link } from "react-router-dom";

const MATERIAL_OPTIONS = ["PLA", "ABS", "PETG", "Resin", "TPU", "Nylon"];
const SIZE_OPTIONS = ["Small", "Medium", "Large", "Custom"];
const INFILL_OPTIONS = ["20%", "50%", "75%", "100%"];

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  
  const { data: existingProduct, isLoading: productLoading } = useProduct(id ?? "");
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();

  const [formData, setFormData] = useState<CreateProductData>({
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
  });

  const [colorInput, setColorInput] = useState("");
  const [uploading, setUploading] = useState(false);

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

  const addColor = () => {
    if (colorInput.trim() && !formData.colors?.includes(colorInput.trim())) {
      setFormData({ ...formData, colors: [...(formData.colors ?? []), colorInput.trim()] });
      setColorInput("");
    }
  };

  const removeColor = (color: string) => {
    setFormData({ ...formData, colors: formData.colors?.filter((c) => c !== color) });
  };

  const toggleOption = (field: "materials" | "sizes" | "infill_options", value: string) => {
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

    if (isEditing && id) {
      await updateProduct.mutateAsync({ id, ...formData });
    } else {
      await createProduct.mutateAsync(formData);
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
      <div className="max-w-3xl mx-auto space-y-6">
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
                  <Label htmlFor="price">Price ($) *</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="standard">Standard</option>
                    <option value="customizable">Customizable</option>
                  </select>
                </div>
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

          {/* Colors */}
          <Card>
            <CardHeader>
              <CardTitle>Available Colors</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={colorInput}
                  onChange={(e) => setColorInput(e.target.value)}
                  placeholder="Enter color name"
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addColor())}
                />
                <Button type="button" variant="outline" onClick={addColor}>
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.colors?.map((color) => (
                  <span
                    key={color}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-muted text-sm"
                  >
                    {color}
                    <button type="button" onClick={() => removeColor(color)}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 3D Printing Options */}
          <Card>
            <CardHeader>
              <CardTitle>3D Printing Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label>Materials</Label>
                <div className="flex flex-wrap gap-2">
                  {MATERIAL_OPTIONS.map((material) => (
                    <Button
                      key={material}
                      type="button"
                      variant={formData.materials?.includes(material) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleOption("materials", material)}
                    >
                      {material}
                    </Button>
                  ))}
                </div>
              </div>

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
    </AdminLayout>
  );
}
