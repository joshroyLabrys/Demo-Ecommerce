"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Package, Check, Truck, Clock, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/auth-context";
import { useOrders } from "@/contexts/order-context";

function OrdersContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAuth();
  const { orders } = useOrders();

  const justPlaced = searchParams.get("placed");

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  const statusIcon = (status: string) => {
    switch (status) {
      case "Delivered":
        return <Check className="h-4 w-4" />;
      case "Shipped":
        return <Truck className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-800";
      case "Shipped":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-amber-100 text-amber-800";
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Breadcrumbs */}
      <nav className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link href="/account" className="hover:text-foreground">Account</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground">Order History</span>
      </nav>

      {/* Order Confirmation Banner */}
      {justPlaced && (
        <Card className="mb-8 rounded-2xl border-green-200 bg-green-50">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green-100">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-green-900">Order placed successfully!</h3>
              <p className="text-sm text-green-700">
                Your order #{justPlaced} has been confirmed and is being processed.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Order History</h1>
        <p className="mt-2 text-muted-foreground">
          {orders.length} {orders.length === 1 ? "order" : "orders"} placed
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Package className="mb-4 h-12 w-12 text-muted-foreground/40" />
          <h3 className="text-lg font-medium">No orders yet</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Start shopping to see your orders here
          </p>
          <Link href="/categories">
            <Button className="mt-4 gap-2 rounded-full">
              <ShoppingBag className="h-4 w-4" />
              Start Shopping
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <Card
              key={order.id}
              className="overflow-hidden rounded-2xl border-white/20 bg-white/60 backdrop-blur-sm"
            >
              <CardHeader className="bg-neutral-50/50">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                  <div>
                    <CardTitle className="text-base">
                      Order #{order.orderNumber}
                    </CardTitle>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Placed on{" "}
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        weekday: "short",
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      variant="secondary"
                      className={`gap-1 rounded-full ${statusColor(order.status)}`}
                    >
                      {statusIcon(order.status)}
                      {order.status}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.product.id} className="flex items-center gap-4">
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-neutral-100">
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-sm font-medium">{item.product.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Qty: {item.quantity} &middot; ${item.product.price.toFixed(2)} each
                        </p>
                      </div>
                      <p className="text-sm font-medium">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
                <Separator className="my-4" />
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    {order.items.reduce((sum, i) => sum + i.quantity, 0)} items
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">${order.total.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">including tax & shipping</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default function OrdersPage() {
  return (
    <Suspense>
      <OrdersContent />
    </Suspense>
  );
}
