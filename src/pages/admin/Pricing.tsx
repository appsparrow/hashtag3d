import { AdminLayout } from "@/components/admin/AdminLayout";
import { StandalonePricingCalculator } from "@/components/admin/StandalonePricingCalculator";
import { Loader2 } from "lucide-react";
import { usePricingSettings } from "@/hooks/usePricing";

export default function Pricing() {
  const { data: pricingSettings = [], isLoading } = usePricingSettings();

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <StandalonePricingCalculator />
    </AdminLayout>
  );
}