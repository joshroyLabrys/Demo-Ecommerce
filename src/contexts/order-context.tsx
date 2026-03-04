"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import type { CartItem } from "./cart-context";

export interface Order {
  id: string;
  orderNumber: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: "Processing" | "Shipped" | "Delivered";
  createdAt: string;
  shippingAddress: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

interface OrderContextType {
  orders: Order[];
  placeOrder: (
    items: CartItem[],
    totals: { subtotal: number; shipping: number; tax: number; total: number },
    shippingAddress: Order["shippingAddress"]
  ) => Order;
  getOrder: (id: string) => Order | undefined;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

const ORDERS_STORAGE_KEY = "meridian-orders";

function generateOrderNumber(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const nums = "0123456789";
  const prefix = Array.from({ length: 2 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  const suffix = Array.from({ length: 6 }, () => nums[Math.floor(Math.random() * nums.length)]).join("");
  return `MR-${prefix}${suffix}`;
}

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (stored) {
      try {
        setOrders(JSON.parse(stored));
      } catch {}
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    }
  }, [orders, isHydrated]);

  const placeOrder = useCallback(
    (
      items: CartItem[],
      totals: { subtotal: number; shipping: number; tax: number; total: number },
      shippingAddress: Order["shippingAddress"]
    ): Order => {
      const order: Order = {
        id: `order-${Date.now()}`,
        orderNumber: generateOrderNumber(),
        items,
        ...totals,
        status: "Processing",
        createdAt: new Date().toISOString(),
        shippingAddress,
      };
      setOrders((prev) => [order, ...prev]);
      return order;
    },
    []
  );

  const getOrder = useCallback(
    (id: string) => orders.find((o) => o.id === id),
    [orders]
  );

  return (
    <OrderContext.Provider value={{ orders, placeOrder, getOrder }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (!context) throw new Error("useOrders must be used within an OrderProvider");
  return context;
}
