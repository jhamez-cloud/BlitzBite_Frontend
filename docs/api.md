# BlitzBite Backend API Specification

This document specifies the Django + Django REST Framework backend needed to power the BlitzBite frontend and replace all mock data.

> **Corrected against the frontend contract.** Field names, shapes, and endpoints below have been reconciled with the actual frontend types (`types/*.ts`), service layer (`lib/services/*.ts`), and mock data (`mock-data/*.ts`). See [Wire format conventions](#wire-format-conventions) first — it applies to every endpoint.

## Overview
- Project: Django REST API (PostgreSQL) with Celery+Redis for background tasks, optional Channels for realtime.
- API version: `/api/v1/`
- Auth: JWT (djangorestframework-simplejwt)

## Wire format conventions

**All JSON in and out is camelCase.** Every frontend type consumes camelCase (`restaurantId`, `deliveryFee`, `reviewCount`, `isOpen`, `createdAt`, `selectedAddons`). Keep Django/DB fields snake_case and add **`djangorestframework-camel-case`** so serializers convert automatically in both directions — do not hand-map fields. All request/response examples in this document are camelCase.

**Timestamps and display strings.** Recommended: the backend returns real ISO-8601 timestamps for all `createdAt` / `estimatedDelivery` / transaction `date` fields, and the **frontend formats** them for display. Note that today's mock data carries some *preformatted display strings* that the backend must either reproduce or (preferably) replace with timestamps the frontend then formats:
- `Notification.time` is currently a relative string (e.g. `"5 mins ago"`).
- `Order.timeline[].time` is currently a short clock string (e.g. `"14:30"`).
- `WalletTransaction.date` is currently a date string (e.g. `"2026-06-28"`).

Decide per field with the frontend team. This spec assumes ISO timestamps + a small frontend formatting layer, and flags the exceptions inline.

## Apps
- `users` — authentication, roles, profiles, addresses, payment methods, preferences
- `restaurants` — restaurants, categories, opening hours, owner link
- `menu` — menu items, addons, menu categories
- `cart` — persistent shopping cart and items (**new behavior — see Cart notes**)
- `orders` — orders, order items, timeline, couriers
- `promotions` — promotions, coupons
- `reviews` — reviews, rating summaries
- `favorites` — user favorites (restaurants)
- `notifications` — in-app notifications
- `wallet` — user wallet and transactions
- `dashboard` — owner/admin analytics (aggregations)
- `search` — search helpers/indexing (optional)

## Models (summary with fields)

### users.User (extends AbstractUser)
- `id`: Auto
- `email`: EmailField (unique)
- `name`: CharField
- `phone`: CharField
- `avatar`: URLField / ImageField (nullable)
- `role`: CharField (choices: `customer|owner|admin`, default `customer`)
- `joined_date`: DateTime → serialized as `joinedDate`
- `total_orders`: Integer → `totalOrders`
- `total_spent`: Decimal → `totalSpent`
- `preferences`: JSONField (notifications/theme)

The `GET /users/me/` response **nests** addresses, payment methods, preferences, and `favoriteRestaurants` (an array of restaurant ids) — see [Users schema](#user-response).

### users.Address
- `id`, `user` FK, `label`, `address` (text), `lat`/`lng` optional, `is_default` boolean → `isDefault`

### users.PaymentMethod
- `id`, `user` FK, `type` (`mobile_money|card|wallet`), `label`
- `details`: **CharField (plain string)**, e.g. `"024 *** 4567"` — *not* JSON
- `is_default` → `isDefault`, `icon`

### restaurants.Restaurant
- `id`, `name`, `slug`, `logo`, `banner`, `rating` Decimal, `review_count` int → `reviewCount`
- `delivery_time`: **CharField (string)**, e.g. `"25-35 min"` → `deliveryTime` (not int minutes)
- `delivery_fee` Decimal → `deliveryFee`, `minimum_order` Decimal → `minimumOrder`
- `categories`: M2M to RestaurantCategory, but **serialized as `string[]`** of category names/slugs
- `is_open`/`is_featured`/`is_trending` → `isOpen`/`isFeatured`/`isTrending`
- `owner`: FK to `users.User` (the restaurant owner; used to scope dashboard + admin auth), nullable
- `address`, `description`, `phone`
- `opening_hours` serialized **inline** on the restaurant as `openingHours` (see below)

### restaurants.OpeningHours
- `id`, `restaurant` FK
- `day`: CharField (e.g. `"Monday"`)
- `open`: CharField (e.g. `"09:00"`) — serialized as **`open`**, not `open_time`
- `close`: CharField (e.g. `"22:00"`) — serialized as **`close`**, not `close_time`

### restaurants.RestaurantCategory
- `id`, `name`, `slug`, `icon`, `image`, `count` (cached)

### menu.MenuCategory
- `id`, `name`, `slug`

### menu.MenuItem
- `id`, `restaurant` FK → `restaurantId`, `name`, `description`, `price` Decimal, `image`
- `category`: FK to MenuCategory, but **serialized as a string** (e.g. `"pizza"`)
- `available` boolean, `calories` int (default `0`; the frontend type is a plain number, so avoid null — coerce to `0`), `is_popular` → `isPopular`
- `addons`: M2M to Addon (through table may store required/optional; the frontend only consumes `{id,name,price}`)

### menu.Addon
- `id`, `name`, `price` Decimal

### cart.Cart *(new behavior — cart is client-only today)*
- `id` UUID, `user` FK nullable, `session_key` nullable, `subtotal`, `delivery_fee`, `discount`, `tip`, `total` Decimals
- **Note:** the current frontend keeps the cart entirely in the browser (`hooks/use-cart.tsx`, in-memory, no API). A server cart is a valid target but requires rewiring the frontend. Until then these endpoints are forward-looking.

### cart.CartItem
- `id` UUID, `cart` FK, `menu_item` FK → `menuItemId`, `restaurant` FK → `restaurantId`, `name`, `price`, `image`, `quantity`
- `selected_addons`: serialized as `selectedAddons` — an array of full addon objects `{ id, name, price }` (the frontend stores whole `Addon` objects, not ids)
- `special_instructions` → `specialInstructions`

### orders.Order
- `id`, `user` FK nullable, `restaurant` FK → `restaurantId`
- `restaurant_name` → `restaurantName`, `restaurant_logo` → `restaurantLogo` (denormalized snapshot)
- `subtotal`, `delivery_fee` → `deliveryFee`, `discount`, `tip`, `total` Decimals
- `status` (choices: `pending|confirmed|preparing|ready|picked_up|on_the_way|delivered|cancelled`)
- `created_at` → `createdAt`, `estimated_delivery` → `estimatedDelivery` DateTime
- `delivery_address`: **string snapshot** → `deliveryAddress` (persist the text at order time; may also keep an Address FK internally)
- `payment_method`: **string snapshot** → `paymentMethod` (e.g. `"Mobile Money"`)
- `courier`: nested object (see response), nullable
- `timeline`: related model or JSON (see response)
- `external_payment_id` for gateway (internal only)

### orders.OrderItem
- `id`, `order` FK, `name`, `quantity`, `price`
- `addons`: **`string[]`** of addon names (e.g. `["Extra Cheese"]`) — the frontend `OrderItem` has **no `menuItemId`** and addons are names, not ids
- (You may keep `menu_item_id` server-side, but do not include it in the OrderItem response.)

### orders.OrderTimelineEntry
- `order` FK, `status`, `label`, `time` (string clock/ISO — see wire conventions), `completed` bool

### promotions.Promotion
- `id`, `title`, `description`, `image`, `code` optional
- `discount`: display string (e.g. `"50% off"`)
- `valid_until` → `validUntil` DateTime
- `background_color` → `backgroundColor`: **Tailwind class string** (e.g. `"from-orange-500 to-red-500"`)
- `text_color` → `textColor`: **Tailwind class string** (e.g. `"text-white"`)

### promotions.Coupon
- `id`, `code`, `description`
- `discount`: **display string** (e.g. `"50%"`, `"Free delivery"`) — required by the frontend
- `discount_type` (`percentage|fixed`) → `discountType`, `discount_value` Decimal → `discountValue`
- `minimum_order` Decimal → `minimumOrder`, `valid_until` → `validUntil` DateTime
- `is_used` → `isUsed`, `max_uses` → `maxUses` int, `used_count` → `usedCount` int
- `active` bool — allowed server-side but **not consumed by the frontend**

### reviews.Review
- `id`, `user` FK → `userId`, `user_name` → `userName`, `user_avatar` → `userAvatar`
- `restaurant` FK → `restaurantId`, `rating` int, `comment` text, `date` DateTime, `images` JSON (optional)

### favorites.Favorite
- `id`, `user` FK, `restaurant` FK, `created_at`

### notifications.Notification
- `id`, `user` FK, `type` (`order|promotion|system|review`), `title`, `message`
- `time` (relative display string today; see wire conventions), `is_read` → `isRead`
- `action_url` → `actionUrl` (optional), `icon` (optional)

### wallet.Wallet
- `id`, `user` FK unique, `balance` Decimal, `currency`, `promotional_credits` → `promotionalCredits` Decimal, `reward_points` → `rewardPoints` int
- The `GET /wallet/` response nests `transactions` (see below).

### wallet.WalletTransaction
- `id`, `wallet` FK, `type` (`credit|debit|refund|reward`), `description`, `amount`, `date`, `reference`

### dashboard (aggregations, owner-scoped — no dedicated model required)
Backed by aggregate queries over orders/reviews/customers for the authenticated owner's restaurant. Serialized shapes:
- **DashboardStats**: `totalOrders`, `totalRevenue`, `totalCustomers`, `averageRating`, `ordersChange`, `revenueChange`, `customersChange`, `ratingChange`
- **ChartDataPoint**: `label`, `value`, `previousValue?`
- **TopItem**: `id`, `name`, `image`, `orders`, `revenue`
- **TopCustomer**: `id`, `name`, `avatar`, `orders`, `totalSpent`

## API Endpoints
Base path: `/api/v1/`

### Auth
The frontend has **two independent auth flows**: customer and restaurant owner. Owner registration additionally captures `restaurantName`.
- `POST /api/v1/auth/register/` — customer register. Body: `{ name, email, password }`
- `POST /api/v1/auth/login/` — returns `{ access, refresh, user }`
- `POST /api/v1/auth/refresh/`
- `POST /api/v1/auth/admin/register/` — owner register. Body: `{ name, email, password, restaurantName }`
- `POST /api/v1/auth/admin/login/` — returns `{ access, refresh, admin: { name, email, restaurantName, restaurantId } }`
- `GET  /api/v1/auth/admin/me/` — current owner + linked restaurant

### Users
- `GET/PUT /api/v1/users/me/` — profile (nests addresses, payment methods, preferences, favoriteRestaurants)
- `GET/POST /api/v1/users/me/addresses/`
- `GET/POST /api/v1/users/me/payment-methods/`

### Restaurants & Menu
- `GET /api/v1/restaurants/` — filters: `category`, `featured`, `trending`, `open`, `search`
- `GET /api/v1/restaurants/{id}/` — details (includes `openingHours` inline)
- `GET /api/v1/restaurants/{id}/menu/` — menu for a restaurant
- `GET /api/v1/menu-items/{id}/`

### Cart *(forward-looking — see Cart notes)*
- `GET /api/v1/cart/` — current cart
- `POST /api/v1/cart/items/` — add item; body: `{ menuItemId, restaurantId, quantity, selectedAddons, specialInstructions }`
- `PATCH /api/v1/cart/items/{id}/` — update qty/instructions
- `DELETE /api/v1/cart/items/{id}/`
- `POST /api/v1/cart/apply-coupon/` — validate and apply coupon

### Orders
- `POST /api/v1/orders/` — create order (see request below)
- `GET /api/v1/orders/{id}/` — retrieve
- `GET /api/v1/orders/` — list user's orders
- `POST /api/v1/orders/{id}/cancel/`
- `PATCH /api/v1/orders/{id}/status/` — staff/owner/admin

### Promotions & Coupons
- `GET /api/v1/promotions/`
- `GET /api/v1/coupons/` — list (frontend also filters unused client-side)
- `POST /api/v1/coupons/validate/` — body: `{ code, subtotal }` → `{ valid, discountAmount, newTotal }`

### Reviews
- `GET /api/v1/restaurants/{id}/reviews/`
- `POST /api/v1/restaurants/{id}/reviews/` — body: `{ rating, comment, images? }`

### Favorites
- `GET /api/v1/users/me/favorites/`
- `POST /api/v1/users/me/favorites/` — add; body: `{ restaurantId }`
- `DELETE /api/v1/users/me/favorites/{restaurantId}/` — remove

### Notifications
- `GET /api/v1/notifications/`
- `POST /api/v1/notifications/mark-read/` — body: `{ ids: [..] }`

### Wallet
- `GET /api/v1/wallet/` — wallet incl. nested `transactions`
- `GET /api/v1/wallet/transactions/`
- `POST /api/v1/wallet/topup/` — create payment intent

### Search
- `GET /api/v1/search/?q=...` — → `{ restaurants: Restaurant[], menuItems: MenuItem[] }`
- `GET /api/v1/search/trending/` — → `string[]`
- `GET /api/v1/search/recent/` — → `string[]` (per-user)

### Dashboard (owner/admin — scoped to the authenticated owner's restaurant)
- `GET /api/v1/dashboard/stats/` — `DashboardStats`
- `GET /api/v1/dashboard/revenue/` — `ChartDataPoint[]`
- `GET /api/v1/dashboard/orders/` — `ChartDataPoint[]`
- `GET /api/v1/dashboard/top-restaurants/` — `TopItem[]`
- `GET /api/v1/dashboard/top-meals/` — `TopItem[]`
- `GET /api/v1/dashboard/top-customers/` — `TopCustomer[]`

## Request/Response Schemas (examples)

### Auth (owner login response)
```json
{
  "access": "jwt...",
  "refresh": "jwt...",
  "admin": {
    "name": "Kwame Mensah",
    "email": "owner@blitzbite.com",
    "restaurantName": "Mensah's Kitchen",
    "restaurantId": 1
  }
}
```

### User (response) — `GET /users/me/`
<a id="user-response"></a>
```json
{
  "id": 1,
  "name": "Ama Serwaa",
  "email": "ama.serwaa@email.com",
  "phone": "+233 24 123 4567",
  "avatar": "https://...",
  "joinedDate": "2025-03-15",
  "totalOrders": 47,
  "totalSpent": 3850,
  "favoriteRestaurants": [1, 2, 5, 9],
  "addresses": [
    { "id": 1, "label": "Home", "address": "23 Independence Ave, Accra", "isDefault": true }
  ],
  "paymentMethods": [
    { "id": 1, "type": "mobile_money", "label": "MTN Mobile Money", "details": "024 *** 4567", "isDefault": true, "icon": "phone" }
  ],
  "preferences": {
    "notifications": { "orders": true, "promotions": true, "news": false },
    "theme": "system"
  }
}
```

### Restaurant (response)
```json
{
  "id": 1,
  "name": "Burger House",
  "slug": "burger-house",
  "logo": "https://...",
  "banner": "https://...",
  "rating": 4.7,
  "reviewCount": 320,
  "deliveryTime": "25-35 min",
  "deliveryFee": 8,
  "minimumOrder": 30,
  "categories": ["Burgers", "Fast Food"],
  "isOpen": true,
  "isFeatured": true,
  "isTrending": false,
  "address": "23 Oxford St, Osu, Accra",
  "description": "Gourmet burgers...",
  "phone": "+233 24 000 0000",
  "openingHours": [
    { "day": "Monday", "open": "09:00", "close": "22:00" }
  ]
}
```

### MenuItem (response)
```json
{
  "id": 1,
  "restaurantId": 5,
  "name": "Margherita Pizza",
  "description": "Classic...",
  "price": 9.99,
  "image": "https://...",
  "category": "pizza",
  "available": true,
  "calories": 800,
  "isPopular": true,
  "addons": [{ "id": 1, "name": "Extra Cheese", "price": 1.5 }]
}
```

### Order create (request)
```json
{
  "items": [
    { "menuItemId": 1, "quantity": 2, "addons": [1], "specialInstructions": "no onion" }
  ],
  "deliveryAddressId": 3,
  "paymentMethodId": 2,
  "couponCode": "SUMMER10",
  "tip": 1.5
}
```

### Order (response)
```json
{
  "id": 1001,
  "restaurantId": 1,
  "restaurantName": "Burger House",
  "restaurantLogo": "https://...",
  "items": [
    { "name": "Double Beef Burger", "quantity": 2, "price": 75, "addons": ["Extra Cheese"] },
    { "name": "Loaded Fries", "quantity": 1, "price": 35, "addons": [] }
  ],
  "subtotal": 185,
  "deliveryFee": 8,
  "discount": 10,
  "tip": 5,
  "total": 188,
  "status": "on_the_way",
  "createdAt": "2026-07-03T14:30:00Z",
  "estimatedDelivery": "2026-07-03T15:10:00Z",
  "deliveryAddress": "23 Independence Ave, Accra",
  "paymentMethod": "Mobile Money",
  "courier": {
    "name": "Kwame Mensah",
    "phone": "+233 24 555 7890",
    "avatar": "https://...",
    "rating": 4.8,
    "vehicle": "Motorcycle"
  },
  "timeline": [
    { "status": "pending", "label": "Order Placed", "time": "14:30", "completed": true },
    { "status": "confirmed", "label": "Order Confirmed", "time": "14:32", "completed": true }
  ]
}
```
> `timeline[].time` shown as a display string to match current mock data. Prefer ISO timestamps + frontend formatting (see [Wire format conventions](#wire-format-conventions)).

### Coupon (response)
```json
{
  "id": 1,
  "code": "WELCOME50",
  "description": "50% off your first order",
  "discount": "50%",
  "discountType": "percentage",
  "discountValue": 50,
  "minimumOrder": 30,
  "validUntil": "2026-08-31",
  "isUsed": false,
  "maxUses": 1,
  "usedCount": 0
}
```

### Coupon validate (response) — `POST /coupons/validate/`
```json
{ "valid": true, "discountAmount": 15, "newTotal": 170 }
```

### Promotion (response)
```json
{
  "id": 1,
  "title": "50% Off Your First Order",
  "description": "New to BlitzBite? Get 50% off your first order up to ₵30. Use code WELCOME50.",
  "image": "https://...",
  "code": "WELCOME50",
  "discount": "50% off",
  "validUntil": "2026-08-31",
  "backgroundColor": "from-orange-500 to-red-500",
  "textColor": "text-white"
}
```

### Review (response)
```json
{
  "id": 1,
  "userId": 12,
  "userName": "Kofi A.",
  "userAvatar": "https://...",
  "restaurantId": 1,
  "rating": 5,
  "comment": "Amazing burgers!",
  "date": "2026-06-28",
  "images": ["https://..."]
}
```

### Notification (response)
```json
{
  "id": 1,
  "type": "order",
  "title": "Order On The Way",
  "message": "Your order #1001 from Burger House is on its way!",
  "time": "5 mins ago",
  "isRead": false,
  "actionUrl": "/orders/1001",
  "icon": null
}
```
> `time` shown as a relative display string to match current mock data. Prefer ISO `createdAt` + frontend formatting.

### Wallet (response) — `GET /wallet/`
```json
{
  "balance": 120.5,
  "currency": "GHS",
  "promotionalCredits": 25,
  "rewardPoints": 340,
  "transactions": [
    { "id": 1, "type": "credit", "description": "Wallet top-up", "amount": 100, "date": "2026-06-28", "reference": "TXN-001" }
  ]
}
```

### Dashboard stats (response) — `GET /dashboard/stats/`
```json
{
  "totalOrders": 1240,
  "totalRevenue": 48500,
  "totalCustomers": 860,
  "averageRating": 4.6,
  "ordersChange": 12.4,
  "revenueChange": 8.1,
  "customersChange": 5.2,
  "ratingChange": 0.3
}
```

### Search (response) — `GET /search/?q=...`
```json
{
  "restaurants": [ /* Restaurant[] */ ],
  "menuItems": [ /* MenuItem[] */ ]
}
```

## Frontend contract checklist
Quick reference of the reconciliations applied vs. the original draft:

1. **camelCase on the wire** (add `djangorestframework-camel-case`).
2. **Owner/admin auth added** (`/auth/admin/*`, `User.role`, `Restaurant.owner`, `restaurantName`).
3. **`Restaurant.deliveryTime` is a string**; `categories` serialize as `string[]`.
4. **`OpeningHours` uses `day`/`open`/`close`**, nested inline on the restaurant.
5. **`MenuItem.category` is a string**; `calories` defaults to `0` (not null).
6. **`OrderItem` has no `menuItemId`; `addons` is `string[]`** of names.
7. **`Order` response includes** `restaurantName`, `restaurantLogo`, `estimatedDelivery`, `deliveryAddress` (string), `paymentMethod` (string), `courier`.
8. **`Coupon.discount` display string added**; `active` not consumed by frontend.
9. **`Promotion` colors are Tailwind class strings**.
10. **`/users/me/` nests** addresses, payment methods, preferences, `favoriteRestaurants`; `PaymentMethod.details` is a plain string.
11. **Cart is client-only today** — server cart is forward-looking; `selectedAddons` are full objects.
12. **Dashboard has six datasets** (stats, revenue, orders, top-restaurants, top-meals, top-customers), owner-scoped.
13. **Search returns `{ restaurants, menuItems }`** plus `/trending/` and `/recent/`.
14. **`Review` includes `userId`**.
