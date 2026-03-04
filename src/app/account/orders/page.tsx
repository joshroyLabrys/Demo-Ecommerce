"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import {
  ChevronRight,
  Package,
  Check,
  Truck,
  Clock,
  ShoppingBag,
  Search,
  ArrowUpDown,
  CalendarIcon,
  Eye,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/auth-context";
import { useOrders } from "@/contexts/order-context";
import { cn } from "@/lib/utils";

function OrdersContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAuth();
  const { orders } = useOrders();

  const justPlaced = searchParams.get("placed");

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"date" | "total">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  const statusConfig: Record<string, { icon: typeof Check; color: string }> = {
    Delivered: { icon: Check, color: "bg-green-100 text-green-800" },
    Shipped: { icon: Truck, color: "bg-blue-100 text-blue-800" },
    Processing: { icon: Clock, color: "bg-amber-100 text-amber-800" },
  };

  const filteredOrders = useMemo(() => {
    return orders
      .filter((order) => {
        const matchesSearch =
          !searchQuery ||
          order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.items.some((item) =>
            item.product.name.toLowerCase().includes(searchQuery.toLowerCase())
          );
        const matchesStatus = statusFilter === "all" || order.status === statusFilter;
        let matchesDate = true;
        if (dateRange.from) {
          matchesDate = new Date(order.createdAt) >= dateRange.from;
        }
        if (dateRange.to && matchesDate) {
          const endOfDay = new Date(dateRange.to);
          endOfDay.setHours(23, 59, 59, 999);
          matchesDate = new Date(order.createdAt) <= endOfDay;
        }
        return matchesSearch && matchesStatus && matchesDate;
      })
      .sort((a, b) => {
        let aVal: number, bVal: number;
        if (sortBy === "date") {
          aVal = new Date(a.createdAt).getTime();
          bVal = new Date(b.createdAt).getTime();
        } else {
          aVal = a.total;
          bVal = b.total;
        }
        return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
      });
  }, [orders, searchQuery, statusFilter, dateRange, sortBy, sortOrder]);

  const toggleSort = (column: "date" | "total") => {
    if (sortBy === column) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(column);
      setSortOrder("desc");
    }
  };

  const hasActiveFilters = searchQuery || statusFilter !== "all" || dateRange.from || dateRange.to;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
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
        <div className="space-y-4">
          {/* Filters Bar */}
          <Card className="rounded-2xl border-white/20 bg-white/60 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search orders..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="rounded-lg pl-9"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[140px] rounded-lg">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    <SelectItem value="Processing">Processing</SelectItem>
                    <SelectItem value="Shipped">Shipped</SelectItem>
                    <SelectItem value="Delivered">Delivered</SelectItem>
                  </SelectContent>
                </Select>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-[220px] justify-start text-left font-normal rounded-lg", !dateRange.from && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange.from ? (
                        dateRange.to ? (
                          <>
                            {format(dateRange.from, "MMM d")} - {format(dateRange.to, "MMM d, yyyy")}
                          </>
                        ) : (
                          format(dateRange.from, "MMM d, yyyy")
                        )
                      ) : (
                        "Date range"
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="range"
                      selected={dateRange}
                      onSelect={(range) => setDateRange({ from: range?.from, to: range?.to })}
                      numberOfMonths={1}
                    />
                  </PopoverContent>
                </Popover>
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1 rounded-full"
                    onClick={() => {
                      setSearchQuery("");
                      setStatusFilter("all");
                      setDateRange({ from: undefined, to: undefined });
                    }}
                  >
                    <X className="h-3.5 w-3.5" />
                    Clear filters
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Orders Table */}
          <Card className="overflow-hidden rounded-2xl border-white/20 bg-white/60 backdrop-blur-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>
                    <button className="flex items-center gap-1 hover:text-foreground" onClick={() => toggleSort("date")}>
                      Date
                      <ArrowUpDown className="h-3.5 w-3.5" />
                    </button>
                  </TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>
                    <button className="flex items-center gap-1 hover:text-foreground" onClick={() => toggleSort("total")}>
                      Total
                      <ArrowUpDown className="h-3.5 w-3.5" />
                    </button>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                      No orders match your filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((order) => {
                    const config = statusConfig[order.status] || statusConfig.Processing;
                    const StatusIcon = config.icon;
                    return (
                      <TableRow key={order.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="flex -space-x-2">
                              {order.items.slice(0, 3).map((item) => (
                                <div key={item.product.id} className="relative h-9 w-9 shrink-0 overflow-hidden rounded-lg border-2 border-background bg-neutral-100">
                                  <Image
                                    src={item.product.image}
                                    alt={item.product.name}
                                    fill
                                    className="object-cover"
                                    sizes="36px"
                                  />
                                </div>
                              ))}
                              {order.items.length > 3 && (
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg border-2 border-background bg-neutral-100 text-xs font-medium">
                                  +{order.items.length - 3}
                                </div>
                              )}
                            </div>
                            <span className="text-sm font-medium">#{order.orderNumber}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {format(new Date(order.createdAt), "MMM d, yyyy")}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {order.items.reduce((s, i) => s + i.quantity, 0)} items
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={cn("gap-1 rounded-full", config.color)}>
                            <StatusIcon className="h-3 w-3" />
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm font-semibold">
                          ${order.total.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Link href={`/account/orders/${order.id}`}>
                            <Button variant="ghost" size="sm" className="gap-1.5 rounded-full">
                              <Eye className="h-3.5 w-3.5" />
                              View
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </Card>

          {filteredOrders.length > 0 && (
            <p className="text-center text-xs text-muted-foreground">
              Showing {filteredOrders.length} of {orders.length} orders
            </p>
          )}
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
