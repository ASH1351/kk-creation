# KK CREATIONS – Elegant Designs 🌿✨
### Luxury Handcrafted Earring Boutique & 3D Interactive Web Experience

A high-fashion, immersive, 3D scroll-driven single-page boutique website engineered for **KK CREATIONS – Elegant Designs**, a premier handcrafted earring brand.

---

## 🎨 Brand Identity & Aesthetic System

- **Brand Name**: KK CREATIONS
- **Tagline**: *Elegant Designs*
- **Primary Palette**:
  - `Deep Teal` (`#0E6F78`) – Primary luxury anchor
  - `Dark Teal` (`#08484F`) – Contrast and dramatic depth
  - `Ivory White` (`#FAF7F2`) – High-end breathable surface
  - `Champagne Gold` (`#D4B36A`) – Accentuation, CTA buttons, and warm glow
  - `Blush Rose` (`#F3D9D4`) – Subtle highlight undertones
- **Typography**:
  - Headings: `Cormorant Garamond` (Google Fonts) – Classical serif elegance
  - Body: `Inter` (Google Fonts) – Clean, high-legibility modern sans-serif
- **Signature Motif**: Recreated precision botanical leaf & blossom wreath line-art SVG with dynamic stroke drawing animations.

---

## 🌟 Interactive Experience & Key Features

1. **Artisanal Preloader**:
   - Signature wreath SVG draws itself stroke-by-stroke with lettermark reveal and smooth fadeout to hero (~2.2s).
2. **Hero 3D Earring Showcase (Three.js)**:
   - Procedural 3D luxury earring pair (French wire hook, botanical filigree rosette, baroque teardrop pearl/gemstone drop).
   - Real-time studio environment reflections, rim lighting, and floating golden sparkle bokeh particles.
   - Mouse parallax on desktop, gyroscope & touch-drag on mobile.
3. **Scroll-Driven 3D Story**:
   - Pinned 3D scene driven by GSAP ScrollTrigger through 4 chapters:
     - *01. Handcrafted Filigree Perfection* (Zoom to detail)
     - *02. Featherlight Comfort (< 8g)* (Side-profile rotation)
     - *03. Bespoke Material Finishes* (Live morph between Gold, Rose Gold, Silver, and Pearl)
     - *04. Made For Every Occasion* (Twin symmetry reveal)
4. **Curated Product Collection**:
   - Filter tabs: Studs, Jhumkas, Danglers, Hoops, Statement, Bridal.
   - Interactive 3D tilt cards with realistic physics and hover zoom.
   - Instant "Enquire on WhatsApp" prefilled link and rich "Quick View" modal.
5. **Interactive 3D Product Customizer (Section 5)**:
   - 360-degree OrbitControls (rotate, zoom, pan, auto-rotate).
   - Live metal finish swatches: Champagne Gold, Blush Rose Gold, Platinum Silver, Imperial Matte Gold.
   - Live drop stone swatches: Baroque Pearl, Royal Emerald, Crimson Ruby, Midnight Sapphire.
   - Dynamic pricing & specification calculator with direct WhatsApp bespoke order generator.
6. **Parallax Craftsmanship Atelier**:
   - 4-step story: Botanical Sketch → Ethical Materials → Hand Forging → Ceramic Glazing.
7. **Why KK Creations**:
   - Skin-friendly hypoallergenic certification, featherlight guarantee, keepsake velvet packaging.
8. **Editorial Lookbook & Lightbox**:
   - Editorial masonry grid with click-to-zoom lightbox modal and lookbook inquiry button.
9. **Client Praise Testimonials Slider**:
   - Deep teal velvet panel with gold foil stars and smooth carousel transitions.
10. **Custom Bespoke Order Form & Contact**:
    - Interactive commissioner form with real-time WhatsApp inquiry generator.
11. **Luxury Polish**:
    - Dual-ring custom trailing cursor with contextual label expansion.
    - Glass-morphism sticky navbar (auto-hides on scroll down, reveals on scroll up).
    - Web Audio API luxury chime synthesizer (toggleable sound ambiance).
    - Lightweight film grain overlay for authentic matte paper feel.

---

## 📁 Project Directory Structure

```text
kk-creations-boutique/
│
├── index.html                  # Semantic, accessible HTML5 single-page boutique
├── css/
│   └── style.css               # Complete luxury CSS design system & responsive rules
├── js/
│   ├── products-data.js        # Curated catalog array (editable products, prices, specs)
│   ├── three-hero.js           # Three.js 3D Hero scene & GSAP Scroll-driven story engine
│   ├── product-viewer.js       # Interactive 3D Studio customizer & OrbitControls
│   └── main.js                 # Lenis smooth scroll, preloader, modals, audio chimes, cursor
├── assets/
│   └── images/
│       ├── wreath-logo.svg     # Scalable vector botanical wreath logo & favicon
│       ├── hero-pearl-drop.jpg # High-res editorial photography: Baroque pearl drops
│       ├── bridal-jhumka.jpg   # High-res photography: Royal emerald bridal jhumkas
│       ├── botanical-hoop.jpg  # High-res photography: Botanical textured gold hoops
│       ├── floral-studs.jpg    # High-res photography: Rose gold floral studs
│       ├── emerald-dangler.jpg # High-res photography: Emerald foliage danglers
│       ├── lookbook-model.jpg  # High-fashion editorial lookbook model portrait
│       ├── packaging-box.jpg   # Signature keepsake teal velvet gift packaging
│       └── logo-original.jpg   # Brand reference asset
├── scripts/
│   └── generate-svg.js         # Mathematical procedural wreath SVG generator
└── README.md                   # Documentation & customization guide
```

---

## 🛠️ How to Customize

### 1. How to Edit Products & Pricing (`js/products-data.js`)
All products displayed in the catalog and modals are defined in `PRODUCTS_DATA`. To add, modify, or remove an earring:

```javascript
{
  id: "kk-010",
  name: "Your Earring Name",
  category: "danglers",         // 'studs', 'jhumkas', 'danglers', 'hoops', 'statement', 'bridal'
  categoryLabel: "Danglers",
  price: 3450,                  // Selling Price (INR)
  originalPrice: 4200,          // MRP (Strikethrough)
  rating: 4.9,
  reviewsCount: 38,
  tag: "Bestseller",            // Badge label (e.g. 'New Arrival', 'Bespoke')
  weight: "6.8 grams (Pair)",
  metal: "18K Champagne Gold Plated Brass",
  stone: "Natural Freshwater Baroque Pearl",
  dimensions: "5.2 cm length × 1.8 cm width",
  closure: "Hypoallergenic French Earwire",
  image: "assets/images/your-image.jpg",
  description: "Description of the piece...",
  features: [
    "Feature point 1",
    "Feature point 2"
  ]
}
```

### 2. How to Update WhatsApp Business Number
Open `js/products-data.js` and change `phoneNumber` inside `createWhatsAppEnquiryLink`:
```javascript
const phoneNumber = "919876543210"; // Replace with your country code + phone number
```
Also update the links in `index.html` where `https://wa.me/919876543210` appears.

### 3. How to Customize Brand Colors (`css/style.css`)
All colors are managed centrally at the top of `css/style.css` via CSS Custom Properties:
```css
:root {
  --c-deep-teal: #0E6F78;       /* Primary boutique brand color */
  --c-dark-teal: #08484F;       /* Depth & footer */
  --c-ivory: #FAF7F2;           /* Primary page background */
  --c-gold: #D4B36A;            /* Accents, CTA buttons */
  --c-rose: #F3D9D4;            /* Soft blush highlights */
}
```

---

## 🚀 Running Locally

You can preview the website instantly using any local static web server:

### Option A: Using Node's `npx serve` or `http-server`
```bash
cd C:\Users\ashif\.gemini\antigravity\scratch\kk-creations-boutique
npx serve .
# or
npx http-server -p 3000
```
Then visit `http://localhost:3000` in your web browser.

### Option B: Using Python built-in server
```bash
python -m http.server 8000
```
Then visit `http://localhost:8000`.

---

## 📱 Mobile Responsiveness & Lighthouse Optimization

- **Breakpoints**: Handcrafted layouts optimized for `360px`, `768px`, `1024px`, and `1440px+`.
- **Performance**:
  - Clamped `devicePixelRatio` at `Math.min(window.devicePixelRatio, 2)` to eliminate GPU thermal throttling.
  - Automatic `IntersectionObserver` rendering pauses when 3D canvases are offscreen.
  - Adaptive particle counts (45 on mobile, 110 on desktop).
  - Native CSS `prefers-reduced-motion` compliance.
  - Tap targets meet the 44px minimum touch accessibility standard.
