# src/

The main source directory. All application code lives here.

## Directory Overview

```
src/
├── app/          # Next.js App Router — all pages and layouts
├── components/   # React components (custom + installed blocks)
│   └── ui/       # shadcn/ui primitive components
├── contexts/     # React context providers for global state
└── lib/          # Shared utilities, dummy data, helpers
```

## How It Fits Together

1. **`app/layout.tsx`** wraps everything in `<Providers>` (auth, cart, orders), renders the `<SiteHeader>` and `<SiteFooter>`
2. **Pages** in `app/` use components from `components/` and data from `lib/data.ts`
3. **Contexts** in `contexts/` provide global state (cart items, auth user, orders) persisted to localStorage
4. **`lib/utils.ts`** exports the `cn()` helper for conditional Tailwind class merging

## Adding a New Page

1. Create a directory under `src/app/` (e.g., `src/app/about/page.tsx`)
2. Import components from `@/components/` and data from `@/lib/data`
3. Use contexts via hooks: `useCart()`, `useAuth()`, `useOrders()`
4. The page is automatically available at the matching URL route
