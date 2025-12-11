import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import Index from "./pages/Index";
import FeedHome from "./pages/FeedHome";
import Auth from "./pages/Auth";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Dashboard from "./pages/admin/Dashboard";
import Products from "./pages/admin/Products";
import ProductForm from "./pages/admin/ProductForm";
import ProductImport from "./pages/admin/ProductImport";
import Orders from "./pages/admin/Orders";
import PrintSchedule from "./pages/admin/PrintSchedule";
import Settings from "./pages/admin/Settings";
import Pricing from "./pages/admin/Pricing";
import Configuration from "./pages/admin/Configuration";
import NotFound from "./pages/NotFound";
import { useLocalSetting } from "@/hooks/useLocalSettings";

const queryClient = new QueryClient();

const HomePage = () => {
  const { data: homePageStyleSetting } = useLocalSetting("home_page_style");
  const style = (homePageStyleSetting?.setting_value as "feed" | "classic") || "feed";
  
  if (style === "classic") {
    return <Index />;
  }
  return <FeedHome />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/classic" element={<Index />} />
              <Route path="/feed" element={<FeedHome />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/admin" element={<Dashboard />} />
              <Route path="/admin/products" element={<Products />} />
              <Route path="/admin/products/new" element={<ProductForm />} />
              <Route path="/admin/products/:id" element={<ProductForm />} />
              <Route path="/admin/products/import" element={<ProductImport />} />
              <Route path="/admin/orders" element={<Orders />} />
              <Route path="/admin/print-schedule" element={<PrintSchedule />} />
              <Route path="/admin/settings" element={<Settings />} />
              <Route path="/admin/pricing" element={<Pricing />} />
              <Route path="/admin/configuration" element={<Configuration />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
