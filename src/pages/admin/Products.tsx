import { AdminLayout } from "@/components/admin/AdminLayout";
import { useProducts, useDeleteProduct } from "@/hooks/useProducts";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Plus, Edit, Trash2, EyeOff, TrendingUp, TrendingDown } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { usePricingSettings, useComplexitySettings, calculatePrice, MaterialCategory, ComplexityTier } from "@/hooks/usePricing";
import { useMemo } from "react";

interface ProductWithProfitability {
  id: string;
  title: string;
  description: string | null;
  price: number;
  is_active: boolean;
  is_customizable: boolean;
  category: string;
  colors: string[] | null;
  images: string[] | null;
  product_number: string | null;
  estimatedProfit: number;
  estimatedMarginPercent: number;
  isProfitable: boolean;
}

export default function Products() {
  const { data: products, isLoading } = useProducts(true);
  const deleteProduct = useDeleteProduct();
  const { data: pricingSettings } = usePricingSettings();
  const { data: complexitySettings } = useComplexitySettings();

  const profitMargin = useMemo(() => {
    return pricingSettings?.find(s => s.setting_key === 'profit_margin')?.setting_value || 40;
  }, [pricingSettings]);

  // Calculate profitability for each product
  const productsWithProfitability = useMemo((): ProductWithProfitability[] | undefined => {
    if (!products || !pricingSettings || !complexitySettings) return undefined;
    
    return products.map(product => {
      // Estimate cost based on product category (material) and complexity
      const materialCategory = (product.category as MaterialCategory) || 'standard';
      const complexity: ComplexityTier = 'simple'; // Default assumption
      const numColors = product.colors?.length || 1;
      
      const pricing = calculatePrice({
        basePrice: 0, // We don't have the base cost stored
        materialCategory,
        numColors: Math.min(numColors, 4), // Cap at 4 for estimation
        complexity,
        customizationFee: product.is_customizable ? 2 : 0,
        pricingSettings,
        complexitySettings,
        profitMargin,
      });
      
      // Estimate profit margin based on selling price vs estimated fees
      const sellingPrice = Number(product.price);
      const estimatedCost = pricing.materialUpcharge + pricing.amsFee + pricing.complexityFee + pricing.customizationFee;
      const estimatedProfit = sellingPrice - estimatedCost;
      const estimatedMarginPercent = sellingPrice > 0 ? (estimatedProfit / sellingPrice) * 100 : 0;
      
      return {
        id: product.id,
        title: product.title,
        description: product.description,
        price: Number(product.price),
        is_active: product.is_active,
        is_customizable: product.is_customizable,
        category: product.category,
        colors: product.colors,
        images: product.images,
        product_number: product.product_number,
        estimatedProfit,
        estimatedMarginPercent,
        isProfitable: estimatedMarginPercent >= profitMargin,
      };
    });
  }, [products, pricingSettings, complexitySettings, profitMargin]);

  if (isLoading) {
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
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Products</h1>
            <p className="text-muted-foreground mt-1">
              {products?.length ?? 0} products
            </p>
          </div>
          <Button asChild>
            <Link to="/admin/products/new">
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Link>
          </Button>
        </div>

        {/* Products Grid */}
        {productsWithProfitability && productsWithProfitability.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {productsWithProfitability.map((product) => (
              <Card key={product.id} className={`overflow-hidden ${!product.is_active ? 'opacity-60' : ''}`}>
                <div className="aspect-video relative">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <span className="text-muted-foreground">No image</span>
                    </div>
                  )}
                  <div className="absolute top-2 right-2 flex gap-1">
                    {!product.is_active && (
                      <Badge variant="secondary" className="bg-background/80">
                        <EyeOff className="w-3 h-3 mr-1" />
                        Hidden
                      </Badge>
                    )}
                    {product.is_customizable && (
                      <Badge className="bg-accent text-accent-foreground">
                        Customizable
                      </Badge>
                    )}
                  </div>
                  {/* Product Number */}
                  {product.product_number && (
                    <div className="absolute top-2 left-2">
                      <Badge variant="secondary" className="bg-background/80 font-mono text-xs">
                        #{product.product_number}
                      </Badge>
                    </div>
                  )}
                </div>
                
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold truncate">{product.title}</h3>
                    <span className="font-bold text-primary whitespace-nowrap">
                      ${Number(product.price).toFixed(2)}
                    </span>
                  </div>
                  
                  {/* Profitability Indicator */}
                  <div className="flex items-center gap-2">
                    {product.isProfitable ? (
                      <Badge variant="outline" className="text-green-600 border-green-600/30 bg-green-50 dark:bg-green-950/30">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        {product.estimatedMarginPercent.toFixed(0)}% margin
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-amber-600 border-amber-600/30 bg-amber-50 dark:bg-amber-950/30">
                        <TrendingDown className="w-3 h-3 mr-1" />
                        {product.estimatedMarginPercent.toFixed(0)}% margin
                      </Badge>
                    )}
                    <Badge variant="outline" className="capitalize text-xs">
                      {product.category}
                    </Badge>
                  </div>
                  
                  {product.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {product.description}
                    </p>
                  )}
                  
                  <div className="flex flex-wrap gap-1">
                    {product.colors?.slice(0, 3).map((color) => (
                      <Badge key={color} variant="outline" className="text-xs">
                        {color}
                      </Badge>
                    ))}
                    {product.colors && product.colors.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{product.colors.length - 3}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1" asChild>
                      <Link to={`/admin/products/${product.id}`}>
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Link>
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Product?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete "{product.title}". This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteProduct.mutate(product.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <p className="text-muted-foreground mb-4">No products yet</p>
              <Button asChild>
                <Link to="/admin/products/new">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Product
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}
