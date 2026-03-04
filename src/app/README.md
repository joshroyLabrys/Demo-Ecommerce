# src/app/

Next.js 15 App Router directory. Each folder maps to a URL route. Each `page.tsx` is the rendered page component.

## Route Map

| Route                     | File                          | Description                              |
| ------------------------- | ----------------------------- | ---------------------------------------- |
| `/`                       | `page.tsx`                    | Homepage — hero, categories, featured products, trust badges |
| `/categories`             | `categories/page.tsx`         | Browse all products with search, filters, sort |
| `/categories/[slug]`      | `categories/[slug]/page.tsx`  | Products filtered by category            |
| `/products/[id]`          | `products/[id]/page.tsx`      | Product detail — images, options, reviews, related |
| `/cart`                   | `cart/page.tsx`               | Shopping cart with order summary          |
| `/checkout`               | `checkout/page.tsx`           | 3-step checkout (contact, shipping, payment) |
| `/login`                  | `login/page.tsx`              | Sign in / create account (fake auth)     |
| `/account`                | `account/page.tsx`            | User profile dashboard                   |
| `/account/orders`         | `account/orders/page.tsx`     | Order history with confirmation banner   |

## Special Files

| File            | Purpose                                                    |
| --------------- | ---------------------------------------------------------- |
| `layout.tsx`    | Root layout — wraps all pages with providers, header, footer |
| `providers.tsx` | Client component that nests AuthProvider, CartProvider, OrderProvider |
| `globals.css`   | Tailwind imports, CSS custom properties, theme tokens      |
| `loading.tsx`   | Global loading spinner shown during route transitions      |
| `not-found.tsx` | Custom 404 page                                            |

## How Pages Work

- All pages are **client components** (`"use client"`) because they rely on context hooks (`useCart`, `useAuth`, `useOrders`) and browser APIs (localStorage)
- Dynamic routes use the Next.js 15 async params pattern: `params: Promise<{ slug: string }>`
- Pages import data directly from `@/lib/data` — no API calls
- Toast notifications use the `sonner` library via `toast.success()` / `toast.error()`

## Adding a New Page

```tsx
// src/app/about/page.tsx
export default function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-3xl font-bold">About MERIDIAN</h1>
    </div>
  );
}
```

The page is instantly available at `/about`.
