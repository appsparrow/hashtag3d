import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useDeliveryAreas, useUpdateLocalSetting } from "@/hooks/useLocalSettings";
import { MapPin, Plus, X, Save, Instagram, Loader2 } from "lucide-react";

export default function Settings() {
  const { data: deliveryAreas, isLoading } = useDeliveryAreas();
  const updateSetting = useUpdateLocalSetting();
  
  const [areas, setAreas] = useState<string[]>([]);
  const [newArea, setNewArea] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");

  useEffect(() => {
    if (deliveryAreas) {
      setAreas(deliveryAreas);
    }
  }, [deliveryAreas]);

  const handleAddArea = () => {
    if (newArea.trim() && !areas.includes(newArea.trim())) {
      setAreas([...areas, newArea.trim()]);
      setNewArea("");
    }
  };

  const handleRemoveArea = (area: string) => {
    setAreas(areas.filter((a) => a !== area));
  };

  const handleSaveAreas = async () => {
    await updateSetting.mutateAsync({ key: "delivery_areas", value: areas });
  };

  const handleSaveInstagram = async () => {
    await updateSetting.mutateAsync({ key: "instagram_url", value: instagramUrl });
  };

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
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Local Settings</h1>
          <p className="text-muted-foreground mt-1">Configure delivery areas and social links.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Delivery Areas
            </CardTitle>
            <CardDescription>
              Manage the areas you deliver to. These will be shown to customers.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {areas.map((area) => (
                <Badge key={area} variant="secondary" className="px-3 py-1 text-sm">
                  {area}
                  <button
                    onClick={() => handleRemoveArea(area)}
                    className="ml-2 hover:text-destructive"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>

            <div className="flex gap-2">
              <Input
                placeholder="Add new area (e.g., Johns Creek, GA)"
                value={newArea}
                onChange={(e) => setNewArea(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddArea()}
              />
              <Button onClick={handleAddArea} variant="outline">
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            <Button onClick={handleSaveAreas} disabled={updateSetting.isPending}>
              {updateSetting.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Save Delivery Areas
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Instagram className="w-5 h-5 text-pink-500" />
              Instagram Link
            </CardTitle>
            <CardDescription>
              Link to your Instagram for customers to watch their prints being made.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="instagram">Instagram Profile URL</Label>
              <Input
                id="instagram"
                placeholder="https://instagram.com/yourprofile"
                value={instagramUrl}
                onChange={(e) => setInstagramUrl(e.target.value)}
              />
            </div>
            <Button onClick={handleSaveInstagram} disabled={updateSetting.isPending}>
              {updateSetting.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Save Instagram Link
            </Button>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
