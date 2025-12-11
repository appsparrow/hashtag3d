import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Palette } from "lucide-react";
import { Color, MaterialCategory } from "@/hooks/usePricing";

interface ColorSwatchModalProps {
  availableColors: {
    standard: Color[];
    premium: Color[];
    ultra: Color[];
  };
  currencySymbol: string;
  premiumUpcharge: number;
  ultraUpcharge: number;
}

export function ColorSwatchModal({ 
  availableColors, 
  currencySymbol, 
  premiumUpcharge, 
  ultraUpcharge 
}: ColorSwatchModalProps) {
  const totalColors = availableColors.standard.length + availableColors.premium.length + availableColors.ultra.length;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Palette className="w-4 h-4" />
          View All Colors ({totalColors})
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Available Colors</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Standard Colors */}
          {availableColors.standard.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Standard Colors</Badge>
                <span className="text-sm text-muted-foreground">
                  ({availableColors.standard.length} available)
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {availableColors.standard.map(color => {
                  const stock = color.stock_quantity ?? 1000;
                  const isOutOfStock = stock < 100;
                  return (
                    <div
                      key={color.id}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        isOutOfStock
                          ? "opacity-50 border-dashed bg-muted"
                          : "border-border bg-card hover:border-primary hover:shadow-md"
                      }`}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <div
                          className="w-16 h-16 rounded-lg border-2 border-border shadow-sm"
                          style={{ backgroundColor: color.hex_color }}
                        />
                        <div className="text-center">
                          <p className={`font-medium text-sm ${isOutOfStock ? "line-through text-muted-foreground" : ""}`}>
                            {color.name}
                          </p>
                          {isOutOfStock ? (
                            <p className="text-xs text-destructive font-medium">Out of Stock</p>
                          ) : (
                            <p className="text-xs text-muted-foreground">{stock}g available</p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Premium Colors */}
          {availableColors.premium.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="default">Premium Colors</Badge>
                <span className="text-sm text-muted-foreground">
                  (+{currencySymbol}{premiumUpcharge.toFixed(2)} each) - ({availableColors.premium.length} available)
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {availableColors.premium.map(color => {
                  const stock = color.stock_quantity ?? 1000;
                  const isOutOfStock = stock < 100;
                  return (
                    <div
                      key={color.id}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        isOutOfStock
                          ? "opacity-50 border-dashed bg-muted"
                          : "border-primary/50 bg-card hover:border-primary hover:shadow-md"
                      }`}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <div
                          className="w-16 h-16 rounded-lg border-2 border-primary/30 shadow-sm"
                          style={{ backgroundColor: color.hex_color }}
                        />
                        <div className="text-center">
                          <p className={`font-medium text-sm ${isOutOfStock ? "line-through text-muted-foreground" : ""}`}>
                            {color.name}
                          </p>
                          {isOutOfStock ? (
                            <p className="text-xs text-destructive font-medium">Out of Stock</p>
                          ) : (
                            <p className="text-xs text-muted-foreground">{stock}g available</p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Ultra Colors */}
          {availableColors.ultra.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="destructive">Ultra Colors</Badge>
                <span className="text-sm text-muted-foreground">
                  (+{currencySymbol}{ultraUpcharge.toFixed(2)} each) - ({availableColors.ultra.length} available)
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {availableColors.ultra.map(color => {
                  const stock = color.stock_quantity ?? 1000;
                  const isOutOfStock = stock < 100;
                  return (
                    <div
                      key={color.id}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        isOutOfStock
                          ? "opacity-50 border-dashed bg-muted"
                          : "border-destructive/50 bg-card hover:border-destructive hover:shadow-md"
                      }`}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <div
                          className="w-16 h-16 rounded-lg border-2 border-destructive/30 shadow-sm"
                          style={{ backgroundColor: color.hex_color }}
                        />
                        <div className="text-center">
                          <p className={`font-medium text-sm ${isOutOfStock ? "line-through text-muted-foreground" : ""}`}>
                            {color.name}
                          </p>
                          {isOutOfStock ? (
                            <p className="text-xs text-destructive font-medium">Out of Stock</p>
                          ) : (
                            <p className="text-xs text-muted-foreground">{stock}g available</p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

