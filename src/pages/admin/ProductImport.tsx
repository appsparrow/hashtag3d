import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useCreateProduct, CreateProductData } from "@/hooks/useProducts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Upload, 
  Sparkles, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  FileText,
  Copy,
  Download
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ExtractedProduct {
  title: string;
  description: string;
  price: number;
  category: string;
  is_customizable: boolean;
  colors: string[];
  materials: string[];
  sizes: string[];
  estimated_grams_small: number;
  estimated_grams_medium: number;
  estimated_grams_large: number;
  print_time_small: number;
  print_time_medium: number;
  print_time_large: number;
  accessories_cost: number;
}

// AI-powered extraction function
function extractProductInfo(text: string): Partial<ExtractedProduct> {
  const extracted: Partial<ExtractedProduct> = {
    colors: [],
    materials: [],
    sizes: [],
    is_customizable: false,
    category: "standard",
    estimated_grams_small: 0,
    estimated_grams_medium: 0,
    estimated_grams_large: 0,
    print_time_small: 60,
    print_time_medium: 120,
    print_time_large: 180,
    accessories_cost: 0,
  };

  const lowerText = text.toLowerCase();

  // Extract title (usually first line or after "title:", "name:", etc.)
  const titleMatch = text.match(/(?:title|name|product)[:\s]+([^\n]+)/i) || 
                     text.split('\n')[0]?.trim();
  if (titleMatch) {
    extracted.title = typeof titleMatch === 'string' ? titleMatch : titleMatch[1]?.trim() || "";
  }

  // Extract price
  const priceMatch = text.match(/\$?(\d+\.?\d*)/);
  if (priceMatch) {
    extracted.price = parseFloat(priceMatch[1]);
  }

  // Extract description (look for description, details, about, etc.)
  const descMatch = text.match(/(?:description|details|about|info)[:\s]+([^\n]+(?:\n[^\n]+)*)/i);
  if (descMatch) {
    extracted.description = descMatch[1]?.trim() || "";
  } else {
    // Use first paragraph as description
    const paragraphs = text.split('\n\n').filter(p => p.trim());
    if (paragraphs.length > 1) {
      extracted.description = paragraphs.slice(1).join('\n\n').substring(0, 500);
    }
  }

  // Detect customization keywords
  if (lowerText.match(/(?:custom|personalized|personalize|engrave|monogram)/)) {
    extracted.is_customizable = true;
    extracted.category = "customizable";
  }

  // Extract colors
  const colorKeywords = ['black', 'white', 'red', 'blue', 'green', 'yellow', 'orange', 'pink', 'purple', 'gray', 'grey', 'gold', 'silver', 'turquoise', 'navy', 'mint'];
  colorKeywords.forEach(color => {
    if (lowerText.includes(color)) {
      extracted.colors?.push(color.charAt(0).toUpperCase() + color.slice(1));
    }
  });

  // Extract materials
  if (lowerText.match(/(?:pla|petg|tpu|abs|resin)/)) {
    if (lowerText.includes('pla')) extracted.materials?.push('PLA');
    if (lowerText.includes('petg')) extracted.materials?.push('PETG');
    if (lowerText.includes('tpu')) extracted.materials?.push('TPU');
    if (lowerText.includes('abs')) extracted.materials?.push('ABS');
    if (lowerText.includes('resin')) extracted.materials?.push('Resin');
  }

  // Extract sizes
  if (lowerText.match(/(?:small|medium|large|s|m|l)/)) {
    if (lowerText.includes('small') || lowerText.includes(' s ')) extracted.sizes?.push('small');
    if (lowerText.includes('medium') || lowerText.includes(' m ')) extracted.sizes?.push('medium');
    if (lowerText.includes('large') || lowerText.includes(' l ')) extracted.sizes?.push('large');
  } else {
    // Default sizes
    extracted.sizes = ['small', 'medium', 'large'];
  }

  // Extract print time (look for "print time", "duration", "hours", "minutes")
  const timeMatch = text.match(/(?:print\s*time|duration|takes?)[:\s]+(\d+)\s*(?:hours?|hrs?|h)/i);
  if (timeMatch) {
    const hours = parseInt(timeMatch[1]);
    extracted.print_time_small = hours * 60;
    extracted.print_time_medium = hours * 60 * 1.5;
    extracted.print_time_large = hours * 60 * 2;
  }

  const minutesMatch = text.match(/(?:print\s*time|duration|takes?)[:\s]+(\d+)\s*(?:minutes?|mins?|m)/i);
  if (minutesMatch) {
    const minutes = parseInt(minutesMatch[1]);
    extracted.print_time_small = minutes;
    extracted.print_time_medium = minutes * 1.5;
    extracted.print_time_large = minutes * 2;
  }

  return extracted;
}

export default function ProductImport() {
  const [inputText, setInputText] = useState("");
  const [extracted, setExtracted] = useState<Partial<ExtractedProduct> | null>(null);
  const [formData, setFormData] = useState<Partial<ExtractedProduct>>({});
  const [isExtracting, setIsExtracting] = useState(false);
  const createProduct = useCreateProduct();
  const [sqlOutput, setSqlOutput] = useState("");

  const handleExtract = () => {
    if (!inputText.trim()) {
      toast({ 
        title: "No input", 
        description: "Please paste product information first",
        variant: "destructive"
      });
      return;
    }

    setIsExtracting(true);
    
    // Simulate AI processing (in real app, this would call an AI API)
    setTimeout(() => {
      const extractedData = extractProductInfo(inputText);
      setExtracted(extractedData);
      setFormData(extractedData);
      setIsExtracting(false);
      
      toast({ 
        title: "Extraction complete", 
        description: "Please review and edit the extracted information"
      });
    }, 1000);
  };

  const handleInputChange = (field: keyof ExtractedProduct, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generateSQL = () => {
    const sql = `INSERT INTO public.products (
  title, description, price, is_customizable, category, 
  colors, materials, sizes, estimated_grams_small, estimated_grams_medium, 
  estimated_grams_large, print_time_small, print_time_medium, print_time_large, 
  accessories_cost, is_active
) VALUES (
  '${formData.title?.replace(/'/g, "''") || ""}',
  '${formData.description?.replace(/'/g, "''") || ""}',
  ${formData.price || 0},
  ${formData.is_customizable || false},
  '${formData.category || "standard"}',
  ARRAY[${formData.colors?.map(c => `'${c.replace(/'/g, "''")}'`).join(', ') || ''}],
  ARRAY[${formData.materials?.map(m => `'${m.replace(/'/g, "''")}'`).join(', ') || ''}],
  ARRAY[${formData.sizes?.map(s => `'${s}'`).join(', ') || 'small, medium, large'}],
  ${formData.estimated_grams_small || 0},
  ${formData.estimated_grams_medium || 0},
  ${formData.estimated_grams_large || 0},
  ${formData.print_time_small || 60},
  ${formData.print_time_medium || 120},
  ${formData.print_time_large || 180},
  ${formData.accessories_cost || 0},
  true
);`;
    
    setSqlOutput(sql);
  };

  const handleImport = async () => {
    if (!formData.title || !formData.price) {
      toast({ 
        title: "Missing required fields", 
        description: "Title and price are required",
        variant: "destructive"
      });
      return;
    }

    const productData: CreateProductData = {
      title: formData.title,
      description: formData.description || "",
      price: formData.price,
      is_customizable: formData.is_customizable || false,
      category: formData.category || "standard",
      colors: formData.colors || [],
      materials: formData.materials || [],
      sizes: formData.sizes || ["small", "medium", "large"],
      estimated_grams_small: formData.estimated_grams_small || 0,
      estimated_grams_medium: formData.estimated_grams_medium || 0,
      estimated_grams_large: formData.estimated_grams_large || 0,
      print_time_small: formData.print_time_small || 60,
      print_time_medium: formData.print_time_medium || 120,
      print_time_large: formData.print_time_large || 180,
      accessories_cost: formData.accessories_cost || 0,
    };

    try {
      await createProduct.mutateAsync(productData);
      toast({ title: "Product imported successfully!" });
      // Reset form
      setInputText("");
      setExtracted(null);
      setFormData({});
      setSqlOutput("");
    } catch (error) {
      // Error handled by mutation
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Import Products</h1>
          <p className="text-muted-foreground mt-1">
            Paste product information from any source and let AI extract the details
          </p>
        </div>

        <Tabs defaultValue="paste" className="space-y-4">
          <TabsList>
            <TabsTrigger value="paste">Paste & Extract</TabsTrigger>
            <TabsTrigger value="review">Review & Edit</TabsTrigger>
            <TabsTrigger value="sql">SQL Output</TabsTrigger>
          </TabsList>

          <TabsContent value="paste" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Paste Product Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Paste product information from any website, description, or text source here...

Example:
Custom 3D Printed Phone Stand
$24.99
Personalized phone stand with adjustable viewing angle. Available in Black, White, or Blue. Made from premium PLA material. Print time: 2 hours. Customizable with your name or logo."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="min-h-[300px] font-mono text-sm"
                />
                <Button 
                  onClick={handleExtract} 
                  disabled={!inputText.trim() || isExtracting}
                  className="w-full"
                >
                  {isExtracting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Extracting...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Extract Product Information
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="review" className="space-y-4">
            {extracted ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    Review Extracted Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title *</Label>
                      <Input
                        id="title"
                        value={formData.title || ""}
                        onChange={(e) => handleInputChange("title", e.target.value)}
                        placeholder="Product title"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="price">Price *</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        value={formData.price || ""}
                        onChange={(e) => handleInputChange("price", parseFloat(e.target.value))}
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description || ""}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      placeholder="Product description"
                      className="min-h-[100px]"
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Input
                        id="category"
                        value={formData.category || "standard"}
                        onChange={(e) => handleInputChange("category", e.target.value)}
                        placeholder="standard, customizable, etc."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>
                        <input
                          type="checkbox"
                          checked={formData.is_customizable || false}
                          onChange={(e) => handleInputChange("is_customizable", e.target.checked)}
                          className="mr-2"
                        />
                        Customizable
                      </Label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Colors (comma-separated)</Label>
                    <Input
                      value={formData.colors?.join(", ") || ""}
                      onChange={(e) => handleInputChange("colors", e.target.value.split(",").map(c => c.trim()).filter(Boolean))}
                      placeholder="Black, White, Blue"
                    />
                    {formData.colors && formData.colors.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {formData.colors.map((color, i) => (
                          <Badge key={i} variant="secondary">{color}</Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label>Print Time Small (minutes)</Label>
                      <Input
                        type="number"
                        value={formData.print_time_small || 60}
                        onChange={(e) => handleInputChange("print_time_small", parseInt(e.target.value))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Print Time Medium (minutes)</Label>
                      <Input
                        type="number"
                        value={formData.print_time_medium || 120}
                        onChange={(e) => handleInputChange("print_time_medium", parseInt(e.target.value))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Print Time Large (minutes)</Label>
                      <Input
                        type="number"
                        value={formData.print_time_large || 180}
                        onChange={(e) => handleInputChange("print_time_large", parseInt(e.target.value))}
                      />
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button onClick={handleImport} disabled={createProduct.isPending}>
                      {createProduct.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Importing...
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 mr-2" />
                          Import Product
                        </>
                      )}
                    </Button>
                    <Button variant="outline" onClick={generateSQL}>
                      <Download className="w-4 h-4 mr-2" />
                      Generate SQL
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <AlertCircle className="w-12 h-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No extracted data yet</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Go to "Paste & Extract" tab and extract product information first
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="sql" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Copy className="w-5 h-5" />
                  Generated SQL
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {sqlOutput ? (
                  <>
                    <Textarea
                      value={sqlOutput}
                      readOnly
                      className="min-h-[300px] font-mono text-sm"
                    />
                    <Button
                      variant="outline"
                      onClick={() => {
                        navigator.clipboard.writeText(sqlOutput);
                        toast({ title: "SQL copied to clipboard!" });
                      }}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy SQL
                    </Button>
                  </>
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    Generate SQL from the "Review & Edit" tab
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}

