import { ReactNode, useEffect, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Package, 
  ShoppingCart, 
  LogOut, 
  Menu,
  Home,
  Plus,
  LayoutDashboard,
  Settings,
  Calculator,
  Building2,
  Clock,
  Upload
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { usePendingOrdersCount } from "@/hooks/usePendingOrdersCount";

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: pendingCount = 0 } = usePendingOrdersCount();

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/products", label: "Products", icon: Package },
    { href: "/admin/products/new", label: "Add Product", icon: Plus },
    { href: "/admin/products/import", label: "Import Products", icon: Upload },
    { href: "/admin/orders", label: "Orders", icon: ShoppingCart, badge: pendingCount > 0 ? pendingCount : undefined },
    { href: "/admin/print-schedule", label: "Print Schedule", icon: Clock },
    { href: "/admin/pricing", label: "Pricing", icon: Calculator },
    { href: "/admin/configuration", label: "Configuration", icon: Settings },
    { href: "/admin/settings", label: "Settings", icon: Building2 },
  ];

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!user) return null;

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const NavLinks = () => (
    <>
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.href;
        return (
          <Link
            key={item.href}
            to={item.href}
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              isActive 
                ? "bg-primary text-primary-foreground" 
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="flex-1">{item.label}</span>
            {item.badge && (
              <Badge variant="destructive" className="ml-auto h-5 min-w-5 flex items-center justify-center text-xs">
                {item.badge}
              </Badge>
            )}
          </Link>
        );
      })}
    </>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-1 min-h-0 bg-card border-r border-border">
          <div className="flex items-center gap-3 h-16 px-6 border-b border-border">
            <Link to="/" className="flex items-center gap-3">
              <img 
                src="/logomark.png" 
                alt="hashtag3D" 
                className="w-10 h-10"
              />
              <div>
                <h1 className="font-bold text-foreground">Admin Panel</h1>
                <p className="text-xs text-muted-foreground">hashtag3D</p>
              </div>
            </Link>
          </div>
          
          <nav className="flex-1 p-4 space-y-1">
            <NavLinks />
          </nav>
          
          <div className="p-4 border-t border-border space-y-2">
            <Link
              to="/"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <Home className="w-5 h-5" />
              View Shop
            </Link>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors w-full"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden sticky top-0 z-40 flex items-center justify-between h-16 px-4 bg-card border-b border-border">
        <Link to="/" className="flex items-center gap-3">
          <img 
            src="/logomark.png" 
            alt="hashtag3D" 
            className="w-10 h-10"
          />
          <h1 className="font-bold">Admin</h1>
        </Link>
        
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <div className="flex flex-col h-full">
              <div className="flex items-center gap-3 h-16 px-6 border-b border-border">
                <Link to="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-3">
                  <img 
                    src="/logomark.png" 
                    alt="hashtag3D" 
                    className="w-10 h-10"
                  />
                  <h1 className="font-bold">Admin Panel</h1>
                </Link>
              </div>
              
              <nav className="flex-1 p-4 space-y-1">
                <NavLinks />
              </nav>
              
              <div className="p-4 border-t border-border space-y-2">
                <Link
                  to="/"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  <Home className="w-5 h-5" />
                  View Shop
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors w-full"
                >
                  <LogOut className="w-5 h-5" />
                  Sign Out
                </button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Main Content */}
      <main className="lg:pl-64">
        <div className="p-4 lg:p-8">
          {!isAdmin && (
            <div className="mb-6 p-4 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-600">
              <p className="text-sm font-medium">
                ⚠️ You don't have admin privileges. Contact the site owner to get access.
              </p>
            </div>
          )}
          {children}
        </div>
      </main>
    </div>
  );
}
