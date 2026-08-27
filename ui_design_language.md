# THESAURUS UI Design Language

This document outlines the core design language, tokens, and visual principles established in the new visual-first landing page. Use this as a reference guide to ensure consistency when redesigning the rest of the application (Signup, Login, Dashboards, Product Pages, Checkout, etc.).

---

## 1. Typography System

The typography is a mix of editorial elegance (Serif), modern geometry (Sans-serif), and technical precision (Monospace).

- **Headings & Display Text**: `Instrument Serif` (Italic emphasis)
  - **Usage**: Main page titles, hero text, large quotes, and stylized numbers.
  - **Vibe**: Editorial, premium, high-fashion.
- **Body & UI Elements**: `Space Grotesk` (Weights: 400, 500, 600, 700)
  - **Usage**: Paragraphs, buttons, navigation links, card titles, standard UI text.
  - **Vibe**: Clean, modern, highly legible.
- **Accents & Metadata**: `DM Mono` (Weights: 400, 500)
  - **Usage**: Small tags, badges, prices, timestamps, role tags, and fine print.
  - **Vibe**: Technical, raw, structured.

---

## 2. Color Palette (Dark Mode First)

The platform uses a deep, rich dark mode as the base, punctuated by high-contrast neon/pastel accents to draw attention.

### Backgrounds & Surfaces
- **App Background**: `#09090d` (Deep almost-black violet/blue tint)
- **Cards & Surfaces**: `#121218` (Slightly lighter elevated surface)
- **Borders & Dividers**: `rgba(255, 255, 255, 0.06)`

### Text Colors
- **Primary Text**: `#ffffff`
- **Muted/Secondary Text**: `#a1a1aa` (Cool grey)

### Brand & Accent Colors
- **Primary Action (Lime)**: `#c8ff3d` — Use for primary CTAs, active states, and highlights. Contrasts heavily against the dark background.
- **Purple Accent**: `#8b5cf6` — Use for tech/premium indicators and gradient stops.
- **Pink Accent**: `#ec4899` — Use for fashion/lifestyle indicators and gradient stops.
- **Cyan/Blue Accent**: `#06b6d4` — Use for secondary information or alternate categories.

---

## 3. Core Aesthetic Motifs

Implement these global layers on every major page to maintain the raw, tactile feel of the platform:

1. **Noise Overlay**: A subtle static noise GIF spanning the entire viewport (`pointer-events: none`, `opacity: 0.04`). Gives a tactile, cinematic texture.
2. **Background Grid**: A subtle fading grid (`background-image: linear-gradient(...)`) that grounds the design in a technical, structured space.
3. **Cursor Glow**: A radial gradient blob that tracks the user's mouse (`window.addEventListener('mousemove')`) to make the interface feel alive and reactive.

---

## 4. UI Components & Shapes

### Buttons & CTAs
- **Primary Buttons**: Pill-shaped (`border-radius: 100px`), Lime background, Black text, `Space Grotesk` medium weight.
- **Secondary/Ghost Buttons**: Transparent background, 1px subtle white border (`rgba(255,255,255,0.1)`), white text.
- **Icon Buttons (e.g., Save/Heart)**: Perfect circles (`border-radius: 50%`), glassmorphic background (`rgba(0,0,0,0.5)`, `backdrop-filter: blur(12px)`), white icons. On hover, background darkens to `rgba(0,0,0,0.75)` and scales up (`transform: scale(1.1)`).

### Cards & Containers
- **Border Radius**: Use `16px` to `24px` for large cards/containers to keep them friendly but structured.
- **Borders**: Always use a delicate border `1px solid rgba(255, 255, 255, 0.06)` to define edges against the dark background without heavy drop shadows.

### Badges & Tags
- Pill-shaped (`border-radius: 100px`), small `DM Mono` text, uppercase, wide letter-spacing (`letter-spacing: 0.06em`).
- Often use glassmorphic backgrounds (`rgba(0,0,0,0.55)` with blur).

---

## 5. Layout Structures

- **Masonry / Pinterest Grids**: For product feeds and inspiration boards, use CSS `columns` or CSS Grid to create irregular, masonry-style layouts. Avoid rigid, perfectly aligned rows of identical squares. Mix tall, large, and small cards.
- **Bento Box Layouts**: For dashboards (like the Admin/Customer views), use varied-size grid cells (Bento UI) to display information densely but beautifully.
- **Floating Overlays**: Use absolute positioning for elements like "My Board" floating over hero sections.

---

## 6. Animations & Micro-Interactions

Motion is critical to this design language. The UI should never feel static.

- **Scroll Reveals**: Use `IntersectionObserver` to add a `.visible` class to elements as they enter the viewport. Elements should fade in (`opacity: 0 to 1`) and slide up slightly (`translateY(30px) to translateY(0)`).
- **Magnetic Elements**: Use Javascript to calculate mouse proximity and slightly pull links or buttons toward the cursor (`transform: translate(x, y)`).
- **3D Tilt Cards**: Use Javascript to track mouse coordinates over a card and apply a `perspective()` and `rotateX`/`rotateY` transform, making the card tilt towards the mouse.
- **Image Hover States**: Images inside cards should slowly scale up (`transform: scale(1.07)`) with a smooth cubic-bezier transition on container hover, while the container remains strictly masked (`overflow: hidden`).

---

## 7. Imagery Style

- **No Emojis (Unless purely structural)**: Replace placeholder emojis with high-quality, aesthetic, real-world photography (e.g., Unsplash).
- **Subject Matter**: Imagery should feel editorial, minimal, and high-fashion/high-tech.
- **Treatment**: Images should always fill their containers (`object-fit: cover`) and use border radii that match their parent containers.

---

### Implementation Checklist for New Pages (e.g., Signup, Dashboard):
- [ ] Import `index.css` (or `landing.css` variables) to get font definitions and CSS variables.
- [ ] Add the `.noise` and `.bg-grid` divs to the background of the page.
- [ ] Ensure buttons and inputs use `Space Grotesk` and pill-shaped borders.
- [ ] Use the `--surface` color for forms and cards with the subtle `--border`.
- [ ] Add `IntersectionObserver` logic in the component's `ngAfterViewInit` to animate form fields or dashboard cards on load.
