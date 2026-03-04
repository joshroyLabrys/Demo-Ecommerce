"use client";

import { use, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import {
  ChevronRight,
  ArrowLeft,
  Check,
  Truck,
  Clock,
  Package,
  MapPin,
  CreditCard,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/auth-context";
import { useOrders } from "@/contexts/order-context";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { notFound } from "next/navigation";

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { getOrder } = useOrders();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  const order = getOrder(id);

  if (!order) {
    notFound();
  }

  const statusConfig: Record<string, { icon: typeof Check; color: string; bgColor: string }> = {
    Delivered: { icon: Check, color: "bg-green-100 text-green-800", bgColor: "bg-green-100" },
    Shipped: { icon: Truck, color: "bg-blue-100 text-blue-800", bgColor: "bg-blue-100" },
    Processing: { icon: Clock, color: "bg-amber-100 text-amber-800", bgColor: "bg-amber-100" },
  };

  const config = statusConfig[order.status] || statusConfig.Processing;
  const StatusIcon = config.icon;

  const statusSteps = [
    { label: "Order Placed", done: true },
    { label: "Processing", done: ["Processing", "Shipped", "Delivered"].includes(order.status) },
    { label: "Shipped", done: ["Shipped", "Delivered"].includes(order.status) },
    { label: "Delivered", done: order.status === "Delivered" },
  ];

  const countryNames: Record<string, string> = {
    US: "United States",
    CA: "Canada",
    GB: "United Kingdom",
    AU: "Australia",
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Breadcrumbs */}
      <nav className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link href="/account" className="hover:text-foreground">Account</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href="/account/orders" className="hover:text-foreground">Orders</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground">#{order.orderNumber}</span>
      </nav>

      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight">Order #{order.orderNumber}</h1>
            <Badge variant="secondary" className={cn("gap-1 rounded-full", config.color)}>
              <StatusIcon className="h-3 w-3" />
              {order.status}
            </Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Placed on {format(new Date(order.createdAt), "EEEE, MMMM d, yyyy 'at' h:mm a")}
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/account/orders">
            <Button variant="outline" size="sm" className="gap-1.5 rounded-full">
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Orders
            </Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 rounded-full"
            onClick={() => toast.success("Invoice downloaded (demo)")}
          >
            <Download className="h-3.5 w-3.5" />
            Invoice
          </Button>
        </div>
      </div>

      {/* Status Timeline */}
      <Card className="mb-6 rounded-2xl border-white/20 bg-white/60 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            {statusSteps.map((s, i) => (
              <div key={s.label} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center gap-1.5">
                  <div className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium",
                    s.done ? "bg-foreground text-background" : "bg-muted text-muted-foreground"
                  )}>
                    {s.done ? <Check className="h-4 w-4" /> : i + 1}
                  </div>
                  <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">{s.label}</span>
                </div>
                {i < statusSteps.length - 1 && (
                  <div className={cn("mx-2 mb-5 h-0.5 flex-1 rounded", s.done ? "bg-foreground" : "bg-muted")} />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Items */}
        <div className="lg:col-span-2">
          <Card className="rounded-2xl border-white/20 bg-white/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg">Items ({order.items.reduce((s, i) => s + i.quantity, 0)})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.product.id} className="flex items-center gap-4">
                    <Link href={`/products/${item.product.id}`}>
                      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-neutral-100">
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </div>
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link href={`/products/${item.product.id}`} className="hover:underline">
                        <p className="truncate text-sm font-medium">{item.product.name}</p>
                      </Link>
                      <p className="text-xs text-muted-foreground">{item.product.brand}</p>
                      {(item.selectedColor || item.selectedSize) && (
                        <p className="text-xs text-muted-foreground">
                          {[item.selectedColor, item.selectedSize].filter(Boolean).join(" · ")}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-semibold">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{order.shipping === 0 ? "Free" : `$${order.shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span>${order.tax.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-base font-bold">
                  <span>Total</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Shipping Address */}
          <Card className="rounded-2xl border-white/20 bg-white/60 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4" />
                Shipping Address
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p className="font-medium text-foreground">
                {order.shippingAddress.firstName} {order.shippingAddress.lastName}
              </p>
              <p>{order.shippingAddress.address}</p>
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
              </p>
              <p>{countryNames[order.shippingAddress.country] || order.shippingAddress.country}</p>
            </CardContent>
          </Card>

          {/* Payment */}
          <Card className="rounded-2xl border-white/20 bg-white/60 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <CreditCard className="h-4 w-4" />
                Payment Method
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p>Credit or debit card</p>
              <p className="mt-1 font-medium text-foreground">${order.total.toFixed(2)}</p>
            </CardContent>
          </Card>

          {/* Order Info */}
          <Card className="rounded-2xl border-white/20 bg-white/60 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Package className="h-4 w-4" />
                Order Info
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Order Number</span>
                <span className="font-medium">{order.orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Order Date</span>
                <span className="font-medium">{format(new Date(order.createdAt), "MMM d, yyyy")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Items</span>
                <span className="font-medium">{order.items.reduce((s, i) => s + i.quantity, 0)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
