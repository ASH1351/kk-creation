/**
 * KK CREATIONS – Elegant Designs
 * Curated Collection Data
 * Handcrafted Luxury Earrings
 */

const PRODUCTS_DATA = [
  {
    id: "kk-001",
    name: "Aura Botanical Pearl Drops",
    category: "danglers",
    categoryLabel: "Danglers",
    price: 3450,
    originalPrice: 4200,
    rating: 4.9,
    reviewsCount: 38,
    tag: "Bestseller",
    weight: "6.8 grams (Pair)",
    metal: "18K Champagne Gold Plated Brass",
    stone: "Natural Freshwater Baroque Pearl",
    dimensions: "5.2 cm length × 1.8 cm width",
    closure: "Hypoallergenic French Earwire",
    image: "assets/images/hero-pearl-drop.jpg",
    description: "Sculpted with organic leaf veins reminiscent of the KK signature wreath, cascading into an iridescent baroque pearl with fluid organic contours.",
    features: [
      "Individually hand-cast botanical leaf motifs",
      "Sustainably harvested grade-AAA freshwater pearls",
      "Featherlight architecture (< 7g) prevents lobe fatigue",
      "Finished with anti-tarnish protective micro-ceramic coating"
    ],
    inStock: true,
    customizable: true
  },
  {
    id: "kk-002",
    name: "Noor Royal Emerald Bridal Jhumka",
    category: "bridal",
    categoryLabel: "Bridal",
    price: 6800,
    originalPrice: 8500,
    rating: 5.0,
    reviewsCount: 44,
    tag: "Atelier Exclusive",
    weight: "9.8 grams (Pair)",
    metal: "18K Micro-Gold Vermeil on Eco-Brass",
    stone: "Hydrothermal Emeralds & Seed Pearls",
    dimensions: "6.8 cm length × 3.2 cm bell diameter",
    closure: "Sculpted Push-Back with Soft Cushion",
    image: "assets/images/bridal-jhumka.jpg",
    description: "An heirloom-grade bridal chandelier jhumka featuring two tiers of delicate latticework filigree, emerald cabochons, and hand-strung pearl tassels.",
    features: [
      "Intricate hand-sawed jaali filigree dome",
      "Natural lustre seed pearls strung on 24K wire",
      "Deep forest-green emerald teardrops",
      "Weighted for royal presence without dragging"
    ],
    inStock: true,
    customizable: true
  },
  {
    id: "kk-003",
    name: "Sylvan Foliage Textured Hoops",
    category: "hoops",
    categoryLabel: "Hoops",
    price: 2850,
    originalPrice: 3400,
    rating: 4.8,
    reviewsCount: 29,
    tag: "Trending",
    weight: "5.2 grams (Pair)",
    metal: "18K Champagne Gold Plated",
    stone: "Micro-Pave Swarovski Zirconia",
    dimensions: "3.2 cm diameter",
    closure: "Seamless Click-Lock Hinge",
    image: "assets/images/botanical-hoop.jpg",
    description: "Contemporary huggie hoops etched with continuous laurel vine tendrils, punctuated by micro-pavé crystals that catch warm evening light.",
    features: [
      "Ergonomic curved silhouette for comfortable everyday wear",
      "Precision-set micro crystals with diamond-grade brilliance",
      "Secure click-lock clasp designed for effortless latching",
      "Water-resistant 18K protective e-coating"
    ],
    inStock: true,
    customizable: true
  },
  {
    id: "kk-004",
    name: "Fleur Rose Gold Filigree Studs",
    category: "studs",
    categoryLabel: "Studs",
    price: 1950,
    originalPrice: 2400,
    rating: 4.9,
    reviewsCount: 52,
    tag: "Daily Luxury",
    weight: "3.4 grams (Pair)",
    metal: "Rose Gold Plated Sterling Base",
    stone: "Brilliant Solitaire Diamond Zirconia",
    dimensions: "1.4 cm diameter",
    closure: "Silicone-Lined Comfort Push Back",
    image: "assets/images/floral-studs.jpg",
    description: "Petite 8-petal blooming floral studs with openwork filigree petals and a radiant center gemstone. Subtle elegance for office and dinner soirées.",
    features: [
      "Multi-layered three-dimensional petal architecture",
      "Blush rose gold finish tuned to warm skin undertones",
      "Hypoallergenic titanium post prevents earlobe irritation",
      "Ultra-compact under 3.5g total weight"
    ],
    inStock: true,
    customizable: true
  },
  {
    id: "kk-005",
    name: "Verdant Cascading Vine Danglers",
    category: "danglers",
    categoryLabel: "Danglers",
    price: 4600,
    originalPrice: 5600,
    rating: 5.0,
    reviewsCount: 31,
    tag: "Handcrafted",
    weight: "7.4 grams (Pair)",
    metal: "18K Antiqued Gold Plated",
    stone: "Marquise-Cut Emeralds & Cubic Crystals",
    dimensions: "6.5 cm length × 2.0 cm width",
    closure: "French Wire with Safety Latch",
    image: "assets/images/emerald-dangler.jpg",
    description: "Cascading botanical climber earrings with marquise-cut emerald leaves dancing along articulated golden branches with fluid movement.",
    features: [
      "Articulated multi-segment links that ripple with head turns",
      "Vibrant emerald gemstones set in prong mounts",
      "Delicate hand-brushed matte gold texture",
      "Designed specifically for gala evenings & cocktail parties"
    ],
    inStock: true,
    customizable: true
  },
  {
    id: "kk-006",
    name: "Celeste Baroque Bridal Chandeliers",
    category: "statement",
    categoryLabel: "Statement",
    price: 5200,
    originalPrice: 6500,
    rating: 4.9,
    reviewsCount: 26,
    tag: "Signature",
    weight: "8.6 grams (Pair)",
    metal: "18K Champagne Gold Plated",
    stone: "Graduated Freshwater Pearls & Crystal Halo",
    dimensions: "7.0 cm length × 3.0 cm width",
    closure: "Omega Clip & Post for Secure Grip",
    image: "assets/images/lookbook-model.jpg",
    description: "An aristocratic statement chandelier earring inspired by royal European botanical court jewels, blending intricate filigree with statement pearl drops.",
    features: [
      "Substantial visual presence with weight-balanced hollow back",
      "Grade-AAA luminous baroque teardrop drop",
      "Comfort-cushioned omega clip prevents forward tilt",
      "Arrives in signature keepsake velvet box"
    ],
    inStock: true,
    customizable: true
  },
  {
    id: "kk-007",
    name: "Gulbahar Handcrafted Heritage Jhumka",
    category: "jhumkas",
    categoryLabel: "Jhumkas",
    price: 4950,
    originalPrice: 5900,
    rating: 4.8,
    reviewsCount: 35,
    tag: "Festive Pick",
    weight: "8.2 grams (Pair)",
    metal: "18K Antique Gold Vermeil",
    stone: "Ruby Red Crystal Cabochon & Seed Pearls",
    dimensions: "5.5 cm length × 2.6 cm dome",
    closure: "Comfort Push Back with Wide Plate",
    image: "assets/images/bridal-jhumka.jpg",
    description: "Traditional bell jhumkas reborn with modern botanical leaf crowns and dangling clusters of petite river pearls.",
    features: [
      "Hand-chased floral embossing on bell dome",
      "Deep ruby doublet centerpiece",
      "Pleasant gentle acoustic chiming movement",
      "Lead and nickel-free certified"
    ],
    inStock: true,
    customizable: true
  },
  {
    id: "kk-008",
    name: "Zephyr Floating Botanical Hoops",
    category: "hoops",
    categoryLabel: "Hoops",
    price: 2450,
    originalPrice: 3100,
    rating: 4.7,
    reviewsCount: 19,
    tag: "Minimalist",
    weight: "4.8 grams (Pair)",
    metal: "18K Matte Yellow Gold",
    stone: "Fine Moissanite Accent",
    dimensions: "2.8 cm diameter",
    closure: "Endless Infinity Clasp",
    image: "assets/images/botanical-hoop.jpg",
    description: "Featherweight hoops crafted with alternating smooth gold tubes and sculpted leaf tendrils. An everyday staple for understated refinement.",
    features: [
      "Ultra-hollow lightweight construction (under 5g)",
      "Zero snagging on hair or winter knitwear",
      "Satin brushed gold texture",
      "Shower-safe durable plating"
    ],
    inStock: true,
    customizable: false
  },
  {
    id: "kk-009",
    name: "Imperial Rani Statement Danglers",
    category: "bridal",
    categoryLabel: "Bridal",
    price: 7400,
    originalPrice: 9200,
    rating: 5.0,
    reviewsCount: 41,
    tag: "Bridal Regal",
    weight: "9.9 grams (Pair)",
    metal: "18K Antique Gold Finish",
    stone: "Polki Cut Crystals & Emerald Drops",
    dimensions: "7.8 cm length × 3.4 cm width",
    closure: "Adjustable Omega Clip Post",
    image: "assets/images/lookbook-model.jpg",
    description: "Created for grand wedding receptions and sangeet celebrations. Hand-set polki mirror crystals with rich green emerald drops.",
    features: [
      "Handmade by master artisans with 20+ years atelier experience",
      "Double-welded jump rings ensure zero risk of dropping pearls",
      "Complimentary matching hair chain hook included",
      "Lifetime replating warranty available"
    ],
    inStock: true,
    customizable: true
  }
];

// Helper to format INR currency
function formatCurrency(amount) {
  return "₹" + amount.toLocaleString("en-IN");
}

// Global WhatsApp enquiry generator
function createWhatsAppEnquiryLink(productName, price, customNote = "") {
  const phoneNumber = "919876543210"; // Default boutique business number, easily configurable
  let message = `Hello KK Creations! ✨\n\nI am enchanted by your handcrafted jewellery collection and would love to enquire about:\n\n💎 *${productName}*\n💰 *Price:* ${formatCurrency(price)}`;
  
  if (customNote) {
    message += `\n📝 *Custom Request:* ${customNote}`;
  }
  
  message += `\n\nCould you please share availability, customization options, and delivery timeline? Thank you! 🌿`;
  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
}
