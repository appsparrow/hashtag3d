import { Grid3X3, Package, Paintbrush } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const iconMap = {
  Grid3X3,
  Package,
  Paintbrush,
};

interface Category {
  id: string;
  label: string;
  icon: keyof typeof iconMap;
}

interface CategoryFilterProps {
  categories: readonly Category[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export function CategoryFilter({ categories, activeCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {categories.map((category) => {
        const Icon = iconMap[category.icon];
        const isActive = activeCategory === category.id;
        
        return (
          <Button
            key={category.id}
            variant={isActive ? "default" : "outline"}
            onClick={() => onCategoryChange(category.id)}
            className={cn(
              "rounded-full px-6",
              isActive && "shadow-md"
            )}
          >
            <Icon className="w-4 h-4" />
            {category.label}
          </Button>
        );
      })}
    </div>
  );
}
