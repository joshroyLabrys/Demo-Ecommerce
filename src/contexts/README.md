# src/contexts/

React context providers for global application state. All state is persisted to `localStorage` so it survives page reloads and browser restarts.

## Providers

### `auth-context.tsx` — AuthProvider / useAuth()

Manages fake user authentication. Any email/password combination works.

**State:**
- `user: User | null` — current logged-in user
- `isAuthenticated: boolean` — whether a user is logged in

**Actions:**
- `login(email, password, firstName?, lastName?)` — creates or restores a user session
- `register(email, password, firstName, lastName)` — creates a new user
- `logout()` — clears the session

**localStorage key:** `meridian-auth`

**Usage:**
```tsx
const { user, isAuthenticated, login, logout } = useAuth();
```

---

### `cart-context.tsx` — CartProvider / useCart()

Manages the shopping cart with full CRUD operations.

**State:**
- `items: CartItem[]` — array of `{ product, quantity, selectedSize?, selectedColor? }`
- `itemCount: number` — total number of items (sum of quantities)
- `subtotal: number` — sum of (price × quantity) for all items
- `shipping: number` — `$0` if subtotal >= $200, otherwise `$15.99`
- `tax: number` — 8% of subtotal
- `total: number` — subtotal + shipping + tax

**Actions:**
- `addItem(product, quantity?, size?, color?)` — adds or increments an item
- `removeItem(productId)` — removes an item entirely
- `updateQuantity(productId, quantity)` — sets the quantity (minimum 1)
- `clearCart()` — empties the cart (called after checkout)

**localStorage key:** `meridian-cart`

**Usage:**
```tsx
const { items, addItem, removeItem, itemCount, total } = useCart();
```

---

### `order-context.tsx` — OrderProvider / useOrders()

Manages completed orders (created during checkout).

**State:**
- `orders: Order[]` — array of completed orders, newest first

**Actions:**
- `placeOrder(items, totals, shippingAddress)` — creates a new order with a generated order number (e.g., `MR-AB123456`), returns the order object
- `getOrder(id)` — retrieves a specific order by ID

**Order structure:**
```ts
{
  id: string;
  orderNumber: string;       // e.g. "MR-XY482931"
  items: CartItem[];
  subtotal, shipping, tax, total: number;
  status: "Processing" | "Shipped" | "Delivered";
  createdAt: string;         // ISO date
  shippingAddress: { firstName, lastName, address, city, state, zipCode, country };
}
```

**localStorage key:** `meridian-orders`

**Usage:**
```tsx
const { orders, placeOrder, getOrder } = useOrders();
```

---

## Provider Nesting

All three providers are composed in `src/app/providers.tsx`:

```
AuthProvider
  └── CartProvider
        └── OrderProvider
              └── {children}
```

This means any component in the app can use any of the three hooks. The providers handle hydration from localStorage on mount and sync back on every state change.

## Clearing All Data

To reset the demo store to a clean state, clear these localStorage keys:

```js
localStorage.removeItem('meridian-auth');
localStorage.removeItem('meridian-cart');
localStorage.removeItem('meridian-orders');
```

Or simply clear all site data in browser DevTools.
