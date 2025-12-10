import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProducts } from "@/hooks/useProducts";
import { useOrderStats } from "@/hooks/useOrders";
import { Package, ShoppingCart, Clock, CheckCircle, XCircle, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const { data: products, isLoading: productsLoading } = useProducts(true);
  const { data: orderStats, isLoading: statsLoading } = useOrderStats();

  const stats = [
    {
      title: "Total Products",
      value: products?.length ?? 0,
      icon: Package,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Active Orders",
      value: (orderStats?.pending ?? 0) + (orderStats?.confirmed ?? 0) + (orderStats?.printing ?? 0) + (orderStats?.finishing ?? 0) + (orderStats?.ready ?? 0),
      icon: ShoppingCart,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Pending",
      value: orderStats?.pending ?? 0,
      icon: Clock,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
    },
    {
      title: "Delivered",
      value: orderStats?.delivered ?? 0,
      icon: CheckCircle,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
  ];

  const isLoading = productsLoading || statsLoading;

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome to your admin panel</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                      <p className="text-3xl font-bold mt-1">
                        {isLoading ? "..." : stat.value}
                      </p>
                    </div>
                    <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                      <Icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Products
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Manage your 3D printed products, add new items, or update existing ones.
              </p>
              <div className="flex gap-3">
                <Button asChild>
                  <Link to="/admin/products/new">Add Product</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/admin/products">View All</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Orders
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                View and manage customer orders, update status, and track deliveries.
              </p>
              <div className="flex gap-3">
                <Button asChild>
                  <Link to="/admin/orders">View Orders</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
