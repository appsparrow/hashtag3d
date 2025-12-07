import { useState, useMemo } from "react";
import { ProductCard } from "./ProductCard";
import { CategoryFilter } from "./CategoryFilter";
import { OrderModal } from "./OrderModal";
import { products, categories, Product } from "@/data/products";
import { Layers } from "lucide-react";

export function ProductGrid() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [orderModalOpen, setOrderModalOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    if (activeCategory === "all") return products;
    return products.filter((product) => product.category === activeCategory);
  }, [activeCategory]);

  const handleOrder = (product: Product) => {
    setSelectedProduct(product);
    setOrderModalOpen(true);
  };

  return (
    <section id="products" className="py-20 px-4 bg-background">
      <div className="container mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted text-muted-foreground">
            <Layers className="w-4 h-4" />
            <span className="text-sm font-medium">Our Collection</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground">
            3D Printed Creations
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Each piece is carefully crafted with high-quality materials. 
            Browse our collection or request a custom design.
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-10">
          <CategoryFilter
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onOrder={handleOrder}
            />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground">No products found in this category.</p>
          </div>
        )}
      </div>

      {/* Order Modal */}
      <OrderModal
        product={selectedProduct}
        open={orderModalOpen}
        onOpenChange={setOrderModalOpen}
      />
    </section>
  );
}
