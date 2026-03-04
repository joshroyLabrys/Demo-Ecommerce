"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ShoppingBag, User, Menu, Search, LogOut, Package, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCart } from "@/contexts/cart-context";
import { useAuth } from "@/contexts/auth-context";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Shop", href: "/categories" },
  { name: "Electronics", href: "/categories/electronics" },
  { name: "Fashion", href: "/categories/fashion" },
  { name: "Home", href: "/categories/home-living" },
  { name: "Wellness", href: "/categories/wellness" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { itemCount } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-white/85 backdrop-blur-xl supports-[backdrop-filter]:bg-white/70">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground">
            <span className="text-xs font-bold text-background">M</span>
          </div>
          <span className="text-xl font-semibold tracking-tight">MERIDIAN</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-0.5 md:flex">
          {navigation.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/categories" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "relative rounded-full px-4 py-2 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
                )}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <Link href="/categories">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Search className="h-5 w-5" />
            </Button>
          </Link>

          {/* Account */}
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="hidden gap-1.5 rounded-full md:flex">
                  <User className="h-4 w-4" />
                  <span className="text-sm">{user?.firstName}</span>
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 rounded-xl border border-border/50 bg-white/90 shadow-lg backdrop-blur-xl">
                <DropdownMenuItem asChild>
                  <Link href="/account" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    My Account
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/account/orders" className="cursor-pointer">
                    <Package className="mr-2 h-4 w-4" />
                    Order History
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login" className="hidden md:block">
              <Button variant="ghost" size="sm" className="gap-1.5 rounded-full">
                <User className="h-4 w-4" />
                Sign In
              </Button>
            </Link>
          )}

          {/* Cart */}
          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative rounded-full">
              <ShoppingBag className="h-5 w-5" />
              <AnimatePresence>
                {itemCount > 0 && (
                  <motion.span
                    key={itemCount}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 25 }}
                    className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-sm"
                  >
                    {itemCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </Button>
          </Link>

          {/* Mobile Menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 border-l border-border/30 bg-white/95 backdrop-blur-xl">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <div className="flex flex-col gap-6 pt-8">
                <Link href="/" className="flex items-center gap-2.5" onClick={() => setMobileOpen(false)}>
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground">
                    <span className="text-xs font-bold text-background">M</span>
                  </div>
                  <span className="text-xl font-semibold tracking-tight">MERIDIAN</span>
                </Link>
                <nav className="flex flex-col gap-1">
                  {navigation.map((item) => {
                    const isActive =
                      pathname === item.href ||
                      (item.href !== "/categories" && pathname.startsWith(item.href));
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          "rounded-xl px-4 py-3 text-base font-medium transition-colors",
                          isActive
                            ? "bg-foreground text-background"
                            : "text-muted-foreground hover:bg-foreground/5"
                        )}
                      >
                        {item.name}
                      </Link>
                    );
                  })}
                </nav>
                <div className="border-t pt-4">
                  {isAuthenticated ? (
                    <div className="flex flex-col gap-1">
                      <Link
                        href="/account"
                        onClick={() => setMobileOpen(false)}
                        className="rounded-xl px-4 py-3 text-base font-medium text-muted-foreground transition-colors hover:bg-black/5"
                      >
                        My Account
                      </Link>
                      <Link
                        href="/account/orders"
                        onClick={() => setMobileOpen(false)}
                        className="rounded-xl px-4 py-3 text-base font-medium text-muted-foreground transition-colors hover:bg-black/5"
                      >
                        Order History
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setMobileOpen(false);
                        }}
                        className="rounded-xl px-4 py-3 text-left text-base font-medium text-muted-foreground transition-colors hover:bg-black/5"
                      >
                        Sign Out
                      </button>
                    </div>
                  ) : (
                    <Link
                      href="/login"
                      onClick={() => setMobileOpen(false)}
                      className="rounded-xl px-4 py-3 text-base font-medium text-muted-foreground transition-colors hover:bg-black/5"
                    >
                      Sign In
                    </Link>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
