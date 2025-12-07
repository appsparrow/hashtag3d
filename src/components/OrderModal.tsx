import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Product } from "@/data/products";
import { toast } from "@/hooks/use-toast";
import { Send, Sparkles } from "lucide-react";

interface OrderModalProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OrderModal({ product, open, onOpenChange }: OrderModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    customization: "",
    notes: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast({
      title: "Order Request Sent! 🎉",
      description: `Thanks ${formData.name}! I'll contact you at ${formData.email} to finalize your order for "${product?.name}".`,
    });

    setIsSubmitting(false);
    setFormData({ name: "", email: "", customization: "", notes: "" });
    onOpenChange(false);
  };

  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>Order Request</span>
          </DialogTitle>
          <DialogDescription>
            Fill out this form and I'll contact you to complete your order.
          </DialogDescription>
        </DialogHeader>

        {/* Product Preview */}
        <div className="flex gap-4 p-4 rounded-lg bg-muted/50 border border-border">
          <img
            src={product.image}
            alt={product.name}
            className="w-20 h-20 rounded-lg object-cover"
          />
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold truncate">{product.name}</h4>
            <p className="text-lg font-bold text-primary">${product.price.toFixed(2)}</p>
            {product.category === "customizable" && (
              <p className="text-xs text-accent flex items-center gap-1 mt-1">
                <Sparkles className="w-3 h-3" />
                {product.customizationType}
              </p>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            {product.category === "customizable" && (
              <div className="space-y-2">
                <Label htmlFor="customization">
                  Customization Details ({product.customizationType})
                </Label>
                <Input
                  id="customization"
                  placeholder="Enter your customization..."
                  value={formData.customization}
                  onChange={(e) => setFormData({ ...formData, customization: e.target.value })}
                  required
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Any specific requirements, color preferences, etc."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                "Sending..."
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Send Request
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
