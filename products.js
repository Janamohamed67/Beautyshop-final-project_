/* =====================================================
   products.js - product data + sale helpers
   Shared "contract" between both team members.
   Prices are in EGP (approximate, adjust before submitting).
   ===================================================== */

// ----- Black Friday sale settings (change here only) -----
const SALE = {
  active: true,                 // set to false to hide the sale everywhere
  name: "Black Friday Sale",
  endsOn: "2026-11-30"          // shown in the banner
};

// ----- Product list -----
// discount = percentage off (0 = not in sale)
const PRODUCTS = [

  /* ---------- Makeup ---------- */
  {
    id: 1, category: "Makeup", brand: "Maybelline",
    name: "Lash Sensational Sky High Mascara",
    price: 450, discount: 30, featured: true,
    image: "images/maybelline-sky-high-mascara.jpg",
    description: "Lightweight, flexible mascara that lengthens and lifts lashes from root to tip. The flex tower brush reaches every lash for a full, fluttery look that lasts all day."
  },
  {
    id: 2, category: "Makeup", brand: "L'Oréal Paris",
    name: "Infallible 32H Fresh Wear Foundation",
    price: 620, discount: 25, featured: false,
    image: "images/loreal-infallible-foundation.jpg",
    description: "Medium to full coverage liquid foundation with a breathable, natural finish. Long wearing for up to 32 hours and transfer resistant, with SPF 25."
  },
  {
    id: 3, category: "Makeup", brand: "Maybelline",
    name: "SuperStay Matte Ink Liquid Lipstick",
    price: 330, discount: 20, featured: true,
    image: "images/maybelline-matte-ink.jpg",
    description: "Highly pigmented liquid lipstick with a smooth matte finish. Long lasting colour that stays put through meals and drinks."
  },
  {
    id: 4, category: "Makeup", brand: "NYX Professional Makeup",
    name: "Ultimate Shadow Palette (16 Shades)",
    price: 750, discount: 35, featured: false,
    image: "images/nyx-ultimate-shadow-palette.jpg",
    description: "Sixteen richly pigmented shades in matte, shimmer and metallic finishes. Blends easily for both everyday and bold evening looks."
  },
  {
    id: 5, category: "Makeup", brand: "Maybelline",
    name: "Fit Me Matte + Poreless Blush",
    price: 380, discount: 15, featured: false,
    image: "images/maybelline-fit-me-blush.jpg",
    description: "Soft, buildable powder blush that gives a natural flush of colour while keeping skin looking smooth and matte."
  },

  /* ---------- Skincare ---------- */
  {
    id: 6, category: "Skincare", brand: "The Ordinary",
    name: "Niacinamide 10% + Zinc 1% Serum (30 ml)",
    price: 450, discount: 25, featured: true,
    image: "images/the-ordinary-niacinamide.jpg",
    description: "Water-based serum that helps reduce the look of blemishes and congestion and balance visible oil. Suitable for oily and combination skin."
  },
  {
    id: 7, category: "Skincare", brand: "CeraVe",
    name: "Moisturizing Cream (454 g)",
    price: 850, discount: 30, featured: false,
    image: "images/cerave-moisturizing-cream.jpg",
    description: "Rich, non-greasy cream with three essential ceramides and hyaluronic acid. Hydrates for 24 hours; for dry to very dry skin on face and body."
  },
  {
    id: 8, category: "Skincare", brand: "La Roche-Posay",
    name: "Anthelios UVMune 400 Invisible Fluid SPF 50+ (50 ml)",
    price: 1100, discount: 20, featured: true,
    image: "images/lrp-anthelios-spf50.jpg",
    description: "Ultra-light invisible sunscreen fluid with very high UVA and UVB protection. Fast absorbing, no white cast, and suitable for sensitive skin."
  },
  {
    id: 9, category: "Skincare", brand: "CeraVe",
    name: "Foaming Facial Cleanser (236 ml)",
    price: 700, discount: 25, featured: false,
    image: "images/cerave-foaming-cleanser.jpg",
    description: "Gel-to-foam cleanser with niacinamide and ceramides that removes oil and dirt without stripping the skin. For normal to oily skin."
  },
  {
    id: 10, category: "Skincare", brand: "Garnier",
    name: "Hydra Bomb Tissue Face Mask",
    price: 120, discount: 15, featured: false,
    image: "images/garnier-hydra-bomb-mask.jpg",
    description: "Single-use sheet mask soaked in a hydrating serum with hyaluronic acid. Leaves skin fresh, plump and glowing in 15 minutes."
  },

  /* ---------- Fragrance ---------- */
  {
    id: 11, category: "Fragrance", brand: "Dior",
    name: "Sauvage Eau de Toilette (100 ml)",
    price: 5200, discount: 15, featured: true,
    image: "images/dior-sauvage-edt.jpg",
    description: "A fresh and spicy men's fragrance built around bergamot and ambroxan. Bold, clean and long lasting."
  },
  {
    id: 12, category: "Fragrance", brand: "Lancôme",
    name: "La Vie Est Belle Eau de Parfum (50 ml)",
    price: 4200, discount: 20, featured: false,
    image: "images/lancome-la-vie-est-belle.jpg",
    description: "A sweet, gourmand women's fragrance with iris, patchouli and vanilla notes. Elegant and feminine for day or night."
  },
  {
    id: 14, category: "Fragrance", brand: "Bath & Body Works",
    name: "Japanese Cherry Blossom Fine Fragrance Mist (236 ml)",
    price: 900, discount: 30, featured: false,
    image: "images/bbw-japanese-cherry-blossom.jpg",
    description: "A light, floral body mist with notes of cherry blossom, pear and sandalwood. Fresh and feminine for everyday wear."
  },
  {
    id: 15, category: "Fragrance", brand: "Victoria's Secret",
    name: "Bare Vanilla Fragrance Mist (250 ml)",
    price: 750, discount: 35, featured: false,
    image: "images/vs-bare-vanilla-mist.jpg",
    description: "Light, sweet body mist with warm vanilla and soft musk. Perfect for a gentle everyday scent."
  },
  {
    id: 21, category: "Fragrance", brand: "Lattafa",
    name: "Yara Eau de Parfum (100 ml)",
    price: 1300, discount: 20, featured: true,
    image: "images/lattafa-yara.jpg",
    description: "A soft, creamy women's fragrance with orchid, tropical fruits and warm vanilla. Sweet, powdery and long lasting."
  },

  /* ---------- Hair Care ---------- */
  {
    id: 16, category: "Hair Care", brand: "Pantene",
    name: "Pro-V Repair & Protect Shampoo (400 ml)",
    price: 190, discount: 20, featured: false,
    image: "images/pantene-repair-shampoo.jpg",
    description: "Cleanses gently while helping repair and protect damaged hair, leaving it smoother and stronger with every wash."
  },
  {
    id: 17, category: "Hair Care", brand: "L'Oréal Paris",
    name: "Elvive Total Repair 5 Conditioner (400 ml)",
    price: 260, discount: 15, featured: false,
    image: "images/elvive-total-repair-conditioner.jpg",
    description: "Conditioner for damaged hair that targets five signs of damage: dryness, roughness, dullness, split ends and breakage."
  },
  {
    id: 18, category: "Hair Care", brand: "Moroccanoil",
    name: "Treatment Original Argan Oil (100 ml)",
    price: 2300, discount: 25, featured: true,
    image: "images/moroccanoil-treatment.jpg",
    description: "The classic argan oil treatment that nourishes, adds shine and reduces frizz and drying time. Use on damp or dry hair."
  },
  {
    id: 19, category: "Hair Care", brand: "Olaplex",
    name: "No. 3 Hair Perfector (100 ml)",
    price: 1900, discount: 30, featured: false,
    image: "images/olaplex-no3.jpg",
    description: "At-home bond-building treatment that helps repair and strengthen hair damaged by colouring, heat and styling."
  },
  {
    id: 20, category: "Hair Care", brand: "TRESemmé",
    name: "Keratin Smooth Heat Protection Spray (200 ml)",
    price: 280, discount: 20, featured: false,
    image: "images/tresemme-heat-protection.jpg",
    description: "Lightweight spray that protects hair from heat styling up to 230°C while keeping it smooth and shiny."
  }
];

// ----- Helper functions (used by main.js, cart.js and checkout.js) -----

// Is this product currently on sale?
function isOnSale(product) {
  return SALE.active && product.discount > 0;
}

// Final price the customer pays (use THIS in cart and checkout)
function getFinalPrice(product) {
  if (!isOnSale(product)) return product.price;
  return Math.round(product.price * (1 - product.discount / 100));
}

// Find a product by id
function getProductById(id) {
  return PRODUCTS.find(function (p) { return p.id === Number(id); });
}

// Format a number as Egyptian pounds
function formatPrice(amount) {
  return amount.toLocaleString("en-US") + " EGP";
}
