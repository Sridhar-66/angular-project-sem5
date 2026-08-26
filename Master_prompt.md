# Build Prompt: Thesaurus — Angular + Supabase Ecommerce

Build **Thesaurus**, an Angular ecommerce app with Supabase (Auth + Postgres + Realtime + Storage). Email/password login via Supabase Auth. Three roles: **Admin**, **Delivery Boy**, **Customer** — each with its own dashboard and route guard. Notifications are in-app popups only (toast + bell dropdown), no email/push.

## Tables (Supabase)

- `profiles`: id, email, full_name, role (admin/delivery/customer)
- `products`: id, name, description, price, stock_quantity, image_url, category, created_by
- `orders`: id, customer_id, total_amount, payment_status, order_status (placed → ready_to_deliver → out_for_delivery → delivered), delivery_boy_id
- `order_items`: id, order_id, product_id, quantity, price_at_purchase
- `notifications`: id, user_id, message, type, is_read, created_at

RLS: admin full access to products; delivery boy can update order_status only on assigned orders; customer reads/writes only their own orders and cart, read-only on products.

## Role Features

- **Admin**: add/edit/delete products (with image upload), view all orders.
- **Delivery Boy**: view assigned orders, advance status one stage at a time (no skipping), each update fires a notification to the customer.
- **Customer**: browse/search products, cart, checkout (test-mode payment), view own order history with live status, get notification popups on status change.

## Notifications

Subscribe to `notifications` via Supabase Realtime filtered by `user_id`. New row → toast popup (top-right, auto-dismiss ~5s) + unread count on a navbar bell → dropdown list, marks read on click. Insert triggers: order status change (→ customer), new order placed (→ admin).

## Definition of Done (demo checklist)

1. **Auth**: signup w/ role select → correct dashboard; logout/login preserves role; wrong-role routes blocked by URL.
2. **Admin CRUD**: create/edit/delete a product, changes reflect instantly and persist on reload.
3. **Delivery flow**: advance an order one stage → saved in Supabase → customer sees updated status without hard refresh.
4. **Notifications**: status change → popup appears live on customer's screen + shows in bell dropdown, read state works.
5. **Customer flow**: browse → cart → checkout → test payment → order appears as `placed`, stock decrements.
6. **Role isolation**: log in as each role, confirm each only sees/does what's listed above — this is the live demo script.

## Build Order (de-risk the deadline)

1. Supabase schema + RLS + storage bucket
2. Auth + role routing skeleton
3. Admin product CRUD
4. Customer browse → cart → checkout → order
5. Delivery status updates
6. Notifications (realtime + toast + bell) — last, since it depends on orders existing
7. Polish: loading/error/empty states

Build in this order so the demo-critical path (auth → products → order → status update) works end-to-end even if time runs out before notifications/polish.
