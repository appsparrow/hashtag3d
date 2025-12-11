import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useDeliveryAreas, useLocalSetting, useUpdateLocalSetting } from "@/hooks/useLocalSettings";
import { MapPin, Plus, X, Save, Instagram, Loader2, Youtube, Building2, Mail, Phone, DollarSign, Gift, Globe, LayoutGrid } from "lucide-react";

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
  const { data: deliveryFeeSetting } = useLocalSetting("delivery_fee");
  const { data: promoCodeSetting } = useLocalSetting("free_delivery_promo_code");
  const { data: shippingFeeSetting } = useLocalSetting("shipping_fee");
  const { data: freeShippingThresholdSetting } = useLocalSetting("free_shipping_threshold");
  const { data: promoEnabledSetting } = useLocalSetting("promo_enabled");
  const { data: promoMessageSetting } = useLocalSetting("promo_message");
  const { data: tiktokSetting } = useLocalSetting("tiktok_url");
  const { data: defaultCountrySetting } = useLocalSetting("default_country");
  const { data: homePageStyleSetting } = useLocalSetting("home_page_style");
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
  const [deliveryFee, setDeliveryFee] = useState("5.00");
  const [promoCode, setPromoCode] = useState("");
  const [shippingFee, setShippingFee] = useState("8.00");
  const [freeShippingThreshold, setFreeShippingThreshold] = useState("15.00");
  const [promoEnabled, setPromoEnabled] = useState(true);
  const [promoMessage, setPromoMessage] = useState("Like & follow us on Instagram/TikTok for FREE delivery! Limited time offer.");
  const [tiktokUrl, setTiktokUrl] = useState("");
  const [defaultCountry, setDefaultCountry] = useState("United States");
  const [homePageStyle, setHomePageStyle] = useState<"feed" | "classic">("feed");

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

  useEffect(() => {
    if (deliveryFeeSetting?.setting_value !== undefined) setDeliveryFee(String(deliveryFeeSetting.setting_value));
  }, [deliveryFeeSetting]);

  useEffect(() => {
    if (promoCodeSetting?.setting_value) setPromoCode(promoCodeSetting.setting_value as string);
  }, [promoCodeSetting]);

  useEffect(() => {
    if (shippingFeeSetting?.setting_value !== undefined) setShippingFee(String(shippingFeeSetting.setting_value));
  }, [shippingFeeSetting]);

  useEffect(() => {
    if (freeShippingThresholdSetting?.setting_value !== undefined) setFreeShippingThreshold(String(freeShippingThresholdSetting.setting_value));
  }, [freeShippingThresholdSetting]);

  useEffect(() => {
    if (promoEnabledSetting?.setting_value !== undefined) setPromoEnabled(promoEnabledSetting.setting_value as boolean);
  }, [promoEnabledSetting]);

  useEffect(() => {
    if (promoMessageSetting?.setting_value) setPromoMessage(promoMessageSetting.setting_value as string);
  }, [promoMessageSetting]);

  useEffect(() => {
    if (tiktokSetting?.setting_value) setTiktokUrl(tiktokSetting.setting_value as string);
  }, [tiktokSetting]);

  useEffect(() => {
    if (defaultCountrySetting?.setting_value) setDefaultCountry(defaultCountrySetting.setting_value as string);
  }, [defaultCountrySetting]);

  useEffect(() => {
    if (homePageStyleSetting?.setting_value) setHomePageStyle(homePageStyleSetting.setting_value as "feed" | "classic");
  }, [homePageStyleSetting]);

  const handleAddArea = () => {
    if (newArea.trim() && !areas.includes(newArea.trim())) {
      setAreas([...areas, newArea.trim()]);
      setNewArea("");
    }
  };

  const handleRemoveArea = (area: string) => {
    setAreas(areas.filter((a) => a !== area));
  };

  const handleSaveDeliverySettings = async () => {
    await updateSetting.mutateAsync({ key: "delivery_areas", value: areas });
    await updateSetting.mutateAsync({ key: "delivery_fee", value: parseFloat(deliveryFee) || 5.00 });
    await updateSetting.mutateAsync({ key: "free_delivery_promo_code", value: promoCode.toUpperCase() });
    await updateSetting.mutateAsync({ key: "shipping_fee", value: parseFloat(shippingFee) || 8.00 });
    await updateSetting.mutateAsync({ key: "free_shipping_threshold", value: parseFloat(freeShippingThreshold) || 15.00 });
    await updateSetting.mutateAsync({ key: "promo_enabled", value: promoEnabled });
    await updateSetting.mutateAsync({ key: "promo_message", value: promoMessage });
  };
  const handleSaveInstagram = () => updateSetting.mutateAsync({ key: "instagram_url", value: instagramUrl });
  const handleSaveYoutube = () => updateSetting.mutateAsync({ key: "youtube_url", value: youtubeUrl });
  const handleSaveTiktok = () => updateSetting.mutateAsync({ key: "tiktok_url", value: tiktokUrl });
  const handleSaveCountry = () => updateSetting.mutateAsync({ key: "default_country", value: defaultCountry });
  const handleSaveHomePageStyle = () => updateSetting.mutateAsync({ key: "home_page_style", value: homePageStyle });
  
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

        {/* Delivery Areas & Shipping */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Delivery Areas & Shipping
            </CardTitle>
            <CardDescription>Manage pickup/delivery areas, shipping fees, and promo codes.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Areas */}
            <div className="space-y-4">
              <Label>Pickup/Delivery Areas (Free pickup available)</Label>
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
            </div>

            {/* Local Delivery Settings */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="deliveryFee">
                  <DollarSign className="w-4 h-4 inline mr-1" />
                  Local Delivery Fee
                </Label>
                <Input
                  id="deliveryFee"
                  type="number"
                  step="0.01"
                  placeholder="5.00"
                  value={deliveryFee}
                  onChange={(e) => setDeliveryFee(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">Charged for delivery in above areas</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="promoCode">Free Delivery Promo Code</Label>
                <Input
                  id="promoCode"
                  placeholder="FREESHIP"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">Customers can use this to waive delivery fee</p>
              </div>
            </div>

            {/* Promo Settings */}
            <div className="pt-4 border-t">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Gift className="w-4 h-4 text-primary" />
                  <Label className="text-base font-medium">Free Delivery Promo</Label>
                </div>
                <Switch
                  checked={promoEnabled}
                  onCheckedChange={setPromoEnabled}
                />
              </div>
              {promoEnabled && (
                <div className="space-y-2">
                  <Label htmlFor="promoMessage">Promo Message</Label>
                  <Textarea
                    id="promoMessage"
                    placeholder="Like & follow us for FREE delivery!"
                    value={promoMessage}
                    onChange={(e) => setPromoMessage(e.target.value)}
                    rows={2}
                  />
                  <p className="text-xs text-muted-foreground">This message shows at checkout when promo code is available</p>
                </div>
              )}
            </div>

            {/* Shipping Settings (outside delivery areas) */}
            <div className="pt-4 border-t">
              <Label className="text-base font-medium mb-3 block">Outside Delivery Areas (Shipping)</Label>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="shippingFee">
                    <DollarSign className="w-4 h-4 inline mr-1" />
                    Shipping Fee
                  </Label>
                  <Input
                    id="shippingFee"
                    type="number"
                    step="0.01"
                    placeholder="8.00"
                    value={shippingFee}
                    onChange={(e) => setShippingFee(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">For addresses outside delivery areas</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="freeShippingThreshold">Free Shipping Threshold</Label>
                  <Input
                    id="freeShippingThreshold"
                    type="number"
                    step="0.01"
                    placeholder="15.00"
                    value={freeShippingThreshold}
                    onChange={(e) => setFreeShippingThreshold(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">Free shipping on orders above this amount</p>
                </div>
              </div>
            </div>

            <Button onClick={handleSaveDeliverySettings} disabled={updateSetting.isPending}>
              {updateSetting.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Delivery Settings
            </Button>
          </CardContent>
        </Card>

        {/* Default Country */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary" />
              Default Country
            </CardTitle>
            <CardDescription>Default country for shipping addresses.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="United States"
              value={defaultCountry}
              onChange={(e) => setDefaultCountry(e.target.value)}
            />
            <Button onClick={handleSaveCountry} disabled={updateSetting.isPending}>
              {updateSetting.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save
            </Button>
          </CardContent>
        </Card>

        {/* Home Page Style */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LayoutGrid className="w-5 h-5 text-primary" />
              Home Page Style
            </CardTitle>
            <CardDescription>Choose the default home page style for your shop.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Page Style</Label>
              <Select value={homePageStyle} onValueChange={(v) => setHomePageStyle(v as "feed" | "classic")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="feed">Feed Style (Social Media Style)</SelectItem>
                  <SelectItem value="classic">Classic Style (Traditional E-commerce)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Feed style: Casual, Instagram-like product feed. Classic style: Traditional product grid with hero section.
              </p>
            </div>
            <Button onClick={handleSaveHomePageStyle} disabled={updateSetting.isPending}>
              {updateSetting.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Home Page Style
            </Button>
          </CardContent>
        </Card>

        {/* Social Links */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Instagram className="w-5 h-5 text-pink-500" />
                Instagram
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="https://instagram.com/yourprofile"
                value={instagramUrl}
                onChange={(e) => setInstagramUrl(e.target.value)}
              />
              <Button onClick={handleSaveInstagram} disabled={updateSetting.isPending} size="sm">
                <Save className="w-4 h-4 mr-1" /> Save
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
                TikTok
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="https://tiktok.com/@yourprofile"
                value={tiktokUrl}
                onChange={(e) => setTiktokUrl(e.target.value)}
              />
              <Button onClick={handleSaveTiktok} disabled={updateSetting.isPending} size="sm">
                <Save className="w-4 h-4 mr-1" /> Save
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Youtube className="w-5 h-5 text-red-500" />
                YouTube
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="https://youtube.com/@yourchannel"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
              />
              <Button onClick={handleSaveYoutube} disabled={updateSetting.isPending} size="sm">
                <Save className="w-4 h-4 mr-1" /> Save
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}