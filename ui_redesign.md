# Thesaurus UI Redesign Prompt

This is a **pure UI/visual pass only** — do not touch backend logic, Supabase calls,
routing logic, auth flow, or business logic. Only change templates, styles, and
presentational markup. Work in the steps below, in order, and stop after each step
for review before continuing.

## Design System (apply consistently everywhere)

- **Primary color:** Blinkit yellow (#F8CB46 / #FFC300 range — pick the closest true
  Blinkit yellow) as the dominant brand color, used confidently, not just as an accent.
- **Design philosophy:** Apple design principles — generous whitespace, soft shadows,
  clear visual hierarchy, restrained color usage outside the brand yellow, rounded
  corners, calm and confident layouts. Nothing cluttered or "AI-generated-looking."
- **Blur is a must:** use `backdrop-filter: blur()` on navbars, modals, cards, popups,
  dropdowns, and overlays wherever it makes sense — frosted-glass surfaces. Every
  elevated surface (cards, the notification bell dropdown, modals, toasts) should feel
  like it's floating on a soft blurred layer, not a flat box. (Not necessarily Apple's
  literal Liquid Glass system — just that blurred, layered quality.)
- **Typography:**
  - Gilroy as the primary UI typeface for general interface text (clean, geometric sans-serif)
  - Okra / Okra Medium for headings and brand-forward elements — navbar logo, hero sections,
    section titles
  - Load as web fonts with a sensible fallback stack (e.g. `-apple-system, Inter, sans-serif`)
    in case they don't load
- **Animations:** pure CSS transitions only, no JS animation libraries. Make them "cute" and
  tactile: button press scale-down, card hover lift, smooth fade/slide on state changes, gentle
  bounce on success actions (e.g. "added to cart," "order placed"), shimmer skeleton loading
  instead of blank loading states. Keep durations short (150–300ms) — snappy, not sluggish.
- **Per-role identity:** one shared base design system across all three dashboards (Admin,
  Customer, Delivery Boy) — same typography, spacing, blur treatment, and yellow brand color
  — but each dashboard gets a subtle accent variation (e.g. a different secondary accent color
  or icon touch) so a user can tell which role they're in at a glance, without it feeling like
  three different apps.
- **Attention to detail:** consistent spacing scale, consistent border-radius scale, consistent
  shadow depth, consistent icon set, hover/focus/active states on every interactive element,
  empty states and loading states styled as carefully as main content. No jarring color or font
  mismatches anywhere.

## Step 0 — Foundation (do this first, small)

Before touching any screens, set up the shared design system only:

- CSS variables/tokens for the Blinkit yellow palette, spacing scale, border-radius scale,
  shadow depths, blur values
- Load Gilroy and Okra/Okra Medium as web fonts with fallback stacks
- Base reusable classes/mixins: frosted-glass blur surfaces, button states
  (default/hover/active/press-scale), card hover-lift, shimmer skeleton loader

Don't touch any actual screens yet. Show me the tokens before moving on.

## Step 1 — Admin Portal only

Using the Step 0 design system, redesign every Admin screen (product list, add/edit
product, view orders). Give Admin its own subtle accent so it's visually distinct from
the other roles while sharing the same base look. Do not touch Customer or Delivery Boy
screens in this step. Tell me what changed when done.

## Step 2 — Customer Portal only

Same design system, apply to Customer screens (browse/search products, cart, checkout,
order history, notification bell/toast). Give Customer its own subtle accent variation.
Don't touch Admin or Delivery Boy in this step.

## Step 3 — Delivery Boy Portal only

Same design system, apply to the Delivery Boy dashboard (assigned orders, status update
flow). Give it its own subtle accent. Don't touch Admin or Customer in this step.
