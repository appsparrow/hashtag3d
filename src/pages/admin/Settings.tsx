import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDeliveryAreas, useLocalSetting, useUpdateLocalSetting } from "@/hooks/useLocalSettings";
import { MapPin, Plus, X, Save, Instagram, Loader2, Youtube, Building2, Mail, Phone, DollarSign } from "lucide-react";

const CURRENCIES = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  { code: "CNY", symbol: "¥", name: "Chinese Yuan" },
];

export default function Settings() {
  const { data: deliveryAreas, isLoading: loadingAreas } = useDeliveryAreas();
  const { data: instagramSetting } = useLocalSetting("instagram_url");
  const { data: youtubeSetting } = useLocalSetting("youtube_url");
  const { data: businessNameSetting } = useLocalSetting("business_name");
  const { data: businessLocationSetting } = useLocalSetting("business_location");
  const { data: businessCurrencySetting } = useLocalSetting("business_currency");
  const { data: businessEmailSetting } = useLocalSetting("business_email");
  const { data: businessPhoneSetting } = useLocalSetting("business_phone");
  const updateSetting = useUpdateLocalSetting();
  
  const [areas, setAreas] = useState<string[]>([]);
  const [newArea, setNewArea] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [businessLocation, setBusinessLocation] = useState("");
  const [businessCurrency, setBusinessCurrency] = useState("USD");
  const [businessEmail, setBusinessEmail] = useState("");
  const [businessPhone, setBusinessPhone] = useState("");

  useEffect(() => {
    if (deliveryAreas) setAreas(deliveryAreas);
  }, [deliveryAreas]);

  useEffect(() => {
    if (instagramSetting?.setting_value) setInstagramUrl(instagramSetting.setting_value as string);
  }, [instagramSetting]);

  useEffect(() => {
    if (youtubeSetting?.setting_value) setYoutubeUrl(youtubeSetting.setting_value as string);
  }, [youtubeSetting]);

  useEffect(() => {
    if (businessNameSetting?.setting_value) setBusinessName(businessNameSetting.setting_value as string);
  }, [businessNameSetting]);

  useEffect(() => {
    if (businessLocationSetting?.setting_value) setBusinessLocation(businessLocationSetting.setting_value as string);
  }, [businessLocationSetting]);

  useEffect(() => {
    if (businessCurrencySetting?.setting_value) setBusinessCurrency(businessCurrencySetting.setting_value as string);
  }, [businessCurrencySetting]);

  useEffect(() => {
    if (businessEmailSetting?.setting_value) setBusinessEmail(businessEmailSetting.setting_value as string);
  }, [businessEmailSetting]);

  useEffect(() => {
    if (businessPhoneSetting?.setting_value) setBusinessPhone(businessPhoneSetting.setting_value as string);
  }, [businessPhoneSetting]);

  const handleAddArea = () => {
    if (newArea.trim() && !areas.includes(newArea.trim())) {
      setAreas([...areas, newArea.trim()]);
      setNewArea("");
    }
  };

  const handleRemoveArea = (area: string) => {
    setAreas(areas.filter((a) => a !== area));
  };

  const handleSaveAreas = () => updateSetting.mutateAsync({ key: "delivery_areas", value: areas });
  const handleSaveInstagram = () => updateSetting.mutateAsync({ key: "instagram_url", value: instagramUrl });
  const handleSaveYoutube = () => updateSetting.mutateAsync({ key: "youtube_url", value: youtubeUrl });
  
  const handleSaveBusinessInfo = async () => {
    await updateSetting.mutateAsync({ key: "business_name", value: businessName });
    await updateSetting.mutateAsync({ key: "business_location", value: businessLocation });
    await updateSetting.mutateAsync({ key: "business_currency", value: businessCurrency });
    const currencyData = CURRENCIES.find(c => c.code === businessCurrency);
    if (currencyData) {
      await updateSetting.mutateAsync({ key: "business_currency_symbol", value: currencyData.symbol });
    }
    await updateSetting.mutateAsync({ key: "business_email", value: businessEmail });
    await updateSetting.mutateAsync({ key: "business_phone", value: businessPhone });
  };

  if (loadingAreas) {
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
          <h1 className="text-3xl font-bold text-foreground">Business Settings</h1>
          <p className="text-muted-foreground mt-1">Configure your business information and preferences.</p>
        </div>

        {/* Business Info Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary" />
              Business Information
            </CardTitle>
            <CardDescription>Your shop's basic details and contact information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="businessName">Business Name</Label>
                <Input
                  id="businessName"
                  placeholder="3D Print Shop"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="businessLocation">Location</Label>
                <Input
                  id="businessLocation"
                  placeholder="Alpharetta, GA"
                  value={businessLocation}
                  onChange={(e) => setBusinessLocation(e.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label>Currency</Label>
                <Select value={businessCurrency} onValueChange={setBusinessCurrency}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CURRENCIES.map((currency) => (
                      <SelectItem key={currency.code} value={currency.code}>
                        {currency.symbol} {currency.code} - {currency.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="businessEmail">
                  <Mail className="w-4 h-4 inline mr-1" />
                  Email
                </Label>
                <Input
                  id="businessEmail"
                  type="email"
                  placeholder="contact@yourshop.com"
                  value={businessEmail}
                  onChange={(e) => setBusinessEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="businessPhone">
                  <Phone className="w-4 h-4 inline mr-1" />
                  Phone
                </Label>
                <Input
                  id="businessPhone"
                  placeholder="+1 (555) 123-4567"
                  value={businessPhone}
                  onChange={(e) => setBusinessPhone(e.target.value)}
                />
              </div>
            </div>

            <Button onClick={handleSaveBusinessInfo} disabled={updateSetting.isPending}>
              {updateSetting.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Business Info
            </Button>
          </CardContent>
        </Card>

        {/* Delivery Areas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Delivery Areas
            </CardTitle>
            <CardDescription>Manage the areas you deliver to.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {areas.map((area) => (
                <Badge key={area} variant="secondary" className="px-3 py-1 text-sm">
                  {area}
                  <button onClick={() => handleRemoveArea(area)} className="ml-2 hover:text-destructive">
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
              {updateSetting.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Delivery Areas
            </Button>
          </CardContent>
        </Card>

        {/* Social Links */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Instagram className="w-5 h-5 text-pink-500" />
                Instagram Link
              </CardTitle>
              <CardDescription>Link to your Instagram profile.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="https://instagram.com/yourprofile"
                value={instagramUrl}
                onChange={(e) => setInstagramUrl(e.target.value)}
              />
              <Button onClick={handleSaveInstagram} disabled={updateSetting.isPending}>
                {updateSetting.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Youtube className="w-5 h-5 text-red-500" />
                YouTube Link
              </CardTitle>
              <CardDescription>Link to your YouTube channel.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="https://youtube.com/@yourchannel"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
              />
              <Button onClick={handleSaveYoutube} disabled={updateSetting.isPending}>
                {updateSetting.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}