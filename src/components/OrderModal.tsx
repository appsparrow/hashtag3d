import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Product } from "@/hooks/useProducts";
import { useCreateOrder } from "@/hooks/useOrders";
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
    phone: "",
    address: "",
    color: "",
    material: "",
    size: "",
    infill: "",
    customization: "",
    notes: "",
  });
  
  const createOrder = useCreateOrder();
  const shippingCost = 5.00;
  const productPrice = product ? Number(product.price) : 0;
  const total = productPrice + shippingCost;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    await createOrder.mutateAsync({
      product_id: product.id,
      customer_name: formData.name,
      customer_email: formData.email,
      customer_phone: formData.phone || undefined,
      delivery_location: "Alpharetta",
      delivery_address: formData.address || undefined,
      shipping_cost: shippingCost,
      product_price: productPrice,
      total_amount: total,
      selected_color: formData.color || undefined,
      selected_material: formData.material || undefined,
      selected_size: formData.size || undefined,
      selected_infill: formData.infill || undefined,
      customization_details: formData.customization || undefined,
      notes: formData.notes || undefined,
    });

    toast({
      title: "Order Submitted! 🎉",
      description: `Thanks ${formData.name}! I'll contact you at ${formData.email} soon.`,
    });

    setFormData({ name: "", email: "", phone: "", address: "", color: "", material: "", size: "", infill: "", customization: "", notes: "" });
    onOpenChange(false);
  };

  if (!product) return null;

  const imageUrl = product.images?.[0] || "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=400&fit=crop";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Order Request</DialogTitle>
          <DialogDescription>Fill out this form and I'll contact you to complete your order.</DialogDescription>
        </DialogHeader>

        <div className="flex gap-4 p-4 rounded-lg bg-muted/50 border border-border">
          <img src={imageUrl} alt={product.title} className="w-20 h-20 rounded-lg object-cover" />
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold truncate">{product.title}</h4>
            <p className="text-lg font-bold text-primary">${productPrice.toFixed(2)}</p>
            {product.is_customizable && (
              <p className="text-xs text-accent flex items-center gap-1 mt-1">
                <Sparkles className="w-3 h-3" />
                Customizable
              </p>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
            </div>
          </div>

          {product.colors && product.colors.length > 0 && (
            <div className="space-y-2">
              <Label>Color</Label>
              <Select value={formData.color} onValueChange={(v) => setFormData({ ...formData, color: v })}>
                <SelectTrigger><SelectValue placeholder="Select color" /></SelectTrigger>
                <SelectContent>
                  {product.colors.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          )}

          {product.is_customizable && (
            <div className="space-y-2">
              <Label htmlFor="customization">Customization Details</Label>
              <Input id="customization" value={formData.customization} onChange={(e) => setFormData({ ...formData, customization: e.target.value })} placeholder={product.personalization_options || "Enter details..."} />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} rows={2} />
          </div>

          <div className="p-3 rounded-lg bg-muted text-sm space-y-1">
            <div className="flex justify-between"><span>Product</span><span>${productPrice.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Shipping (Alpharetta)</span><span>${shippingCost.toFixed(2)}</span></div>
            <div className="flex justify-between font-bold border-t pt-1 mt-1"><span>Total</span><span>${total.toFixed(2)}</span></div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={createOrder.isPending}>
              {createOrder.isPending ? "Sending..." : <><Send className="w-4 h-4" /> Submit Order</>}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
