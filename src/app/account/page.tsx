"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Package, Heart, LogOut, ChevronRight, ShoppingBag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/auth-context";
import { useOrders } from "@/contexts/order-context";
import { useEffect } from "react";

export default function AccountPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const { orders } = useOrders();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  if (!user) return null;

  const totalSpent = orders.reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">My Account</h1>
        <p className="mt-2 text-muted-foreground">Manage your profile and view your orders</p>
      </div>

      {/* Profile Card */}
      <Card className="mb-8 rounded-2xl border-white/20 bg-white/60 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-foreground text-background">
              <span className="text-xl font-bold">
                {user.firstName.charAt(0)}{user.lastName.charAt(0) || ""}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-semibold">
                {user.firstName} {user.lastName}
              </h2>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <p className="text-xs text-muted-foreground">
                Member since {new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="rounded-2xl border-white/20 bg-white/60 backdrop-blur-sm">
          <CardContent className="p-6 text-center">
            <ShoppingBag className="mx-auto mb-2 h-6 w-6 text-muted-foreground" />
            <p className="text-2xl font-bold">{orders.length}</p>
            <p className="text-sm text-muted-foreground">Total Orders</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-white/20 bg-white/60 backdrop-blur-sm">
          <CardContent className="p-6 text-center">
            <Package className="mx-auto mb-2 h-6 w-6 text-muted-foreground" />
            <p className="text-2xl font-bold">${totalSpent.toFixed(2)}</p>
            <p className="text-sm text-muted-foreground">Total Spent</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-white/20 bg-white/60 backdrop-blur-sm">
          <CardContent className="p-6 text-center">
            <Heart className="mx-auto mb-2 h-6 w-6 text-muted-foreground" />
            <p className="text-2xl font-bold">0</p>
            <p className="text-sm text-muted-foreground">Wishlist Items</p>
          </CardContent>
        </Card>
      </div>

      {/* Navigation */}
      <Card className="rounded-2xl border-white/20 bg-white/60 backdrop-blur-sm">
        <CardContent className="p-2">
          <Link
            href="/account/orders"
            className="flex items-center justify-between rounded-xl px-4 py-3 transition-colors hover:bg-black/5"
          >
            <div className="flex items-center gap-3">
              <Package className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Order History</p>
                <p className="text-xs text-muted-foreground">View all past orders</p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </Link>
          <Separator className="mx-4" />
          <Link
            href="/categories"
            className="flex items-center justify-between rounded-xl px-4 py-3 transition-colors hover:bg-black/5"
          >
            <div className="flex items-center gap-3">
              <ShoppingBag className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Continue Shopping</p>
                <p className="text-xs text-muted-foreground">Browse our collections</p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </Link>
          <Separator className="mx-4" />
          <button
            onClick={() => {
              logout();
              router.push("/");
            }}
            className="flex w-full items-center justify-between rounded-xl px-4 py-3 transition-colors hover:bg-black/5"
          >
            <div className="flex items-center gap-3">
              <LogOut className="h-5 w-5 text-muted-foreground" />
              <div className="text-left">
                <p className="text-sm font-medium">Sign Out</p>
                <p className="text-xs text-muted-foreground">Log out of your account</p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </button>
        </CardContent>
      </Card>
    </div>
  );
}
