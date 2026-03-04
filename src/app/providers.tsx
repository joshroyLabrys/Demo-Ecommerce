"use client";

import type { ReactNode } from "react";
import { CartProvider } from "@/contexts/cart-context";
import { AuthProvider } from "@/contexts/auth-context";
import { OrderProvider } from "@/contexts/order-context";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>
        <OrderProvider>{children}</OrderProvider>
      </CartProvider>
    </AuthProvider>
  );
}
