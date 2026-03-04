export interface Product {
  id: string;
  name: string;
  brand: string;
  description: string;
  longDescription: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewCount: number;
  category: string;
  categorySlug: string;
  image: string;
  images: string[];
  sizes?: string[];
  colors?: { name: string; value: string }[];
  inStock: boolean;
  isNew: boolean;
  isFeatured: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  productCount: number;
  image: string;
}

export interface Review {
  id: number;
  userName: string;
  userAvatar: string;
  date: string;
  rating: number;
  content: string;
  likes: number;
  comments: number;
  productId: string;
}

export const categories: Category[] = [
  {
    id: "cat-1",
    name: "Electronics",
    slug: "electronics",
    description: "Premium audio, wearables, and smart devices for the modern lifestyle.",
    productCount: 4,
    image: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "cat-2",
    name: "Home & Living",
    slug: "home-living",
    description: "Curated pieces to elevate every corner of your space.",
    productCount: 4,
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "cat-3",
    name: "Fashion",
    slug: "fashion",
    description: "Timeless essentials and statement pieces for every occasion.",
    productCount: 4,
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "cat-4",
    name: "Wellness",
    slug: "wellness",
    description: "Thoughtfully crafted skincare, aromatherapy, and self-care essentials.",
    productCount: 4,
    image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "cat-5",
    name: "Books & Stationery",
    slug: "books-stationery",
    description: "Beautiful journals, curated reads, and premium writing instruments.",
    productCount: 4,
    image: "https://images.unsplash.com/photo-1524578271613-d550eacf6090?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "cat-6",
    name: "Kitchen & Dining",
    slug: "kitchen-dining",
    description: "Elevated cookware, barware, and tabletop essentials.",
    productCount: 4,
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&auto=format&fit=crop&q=80",
  },
];

export const products: Product[] = [
  // Electronics
  {
    id: "prod-1",
    name: "Wireless Noise-Canceling Headphones",
    brand: "Sony",
    description: "Premium over-ear headphones with industry-leading noise cancellation and 30-hour battery life.",
    longDescription: "Experience audio like never before with these premium wireless headphones. Featuring advanced noise-canceling technology, plush ear cushions, and a 30-hour battery that keeps up with your longest journeys. Touch controls, multipoint connectivity, and Hi-Res Audio support make these the perfect companion for audiophiles and commuters alike.",
    price: 199.99,
    originalPrice: 249.99,
    rating: 4.8,
    reviewCount: 1247,
    category: "Electronics",
    categorySlug: "electronics",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=600&auto=format&fit=crop&q=80",
    ],
    colors: [
      { name: "Black", value: "#000000" },
      { name: "Silver", value: "#C0C0C0" },
      { name: "Navy", value: "#1E3A8A" },
    ],
    inStock: true,
    isNew: true,
    isFeatured: true,
  },
  {
    id: "prod-2",
    name: "Smart Watch Series 9",
    brand: "Apple",
    description: "The most advanced smartwatch with always-on display, health monitoring, and crash detection.",
    longDescription: "The latest in wearable technology. Track your fitness, monitor blood oxygen, take ECGs, and stay connected — all from your wrist. With a brighter always-on Retina display, precision finding for iPhone, and double-tap gesture, it's the ultimate health and productivity companion.",
    price: 279.99,
    originalPrice: 349.99,
    rating: 4.9,
    reviewCount: 892,
    category: "Electronics",
    categorySlug: "electronics",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1546868871-af0de0ae72be?w=600&auto=format&fit=crop&q=80",
    ],
    sizes: ["41mm", "45mm"],
    colors: [
      { name: "Midnight", value: "#1F2937" },
      { name: "Starlight", value: "#F3F4F6" },
      { name: "Gold", value: "#F59E0B" },
    ],
    inStock: true,
    isNew: false,
    isFeatured: true,
  },
  {
    id: "prod-3",
    name: "Portable Bluetooth Speaker",
    brand: "Bose",
    description: "Waterproof, dustproof speaker with 360-degree sound and 12-hour battery.",
    longDescription: "Take your music anywhere with this rugged, portable Bluetooth speaker. IP67-rated for water and dust resistance, it delivers immersive 360-degree sound in a compact, travel-friendly design. Party mode lets you pair two speakers for stereo sound.",
    price: 129.99,
    originalPrice: 149.99,
    rating: 4.6,
    reviewCount: 634,
    category: "Electronics",
    categorySlug: "electronics",
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&auto=format&fit=crop&q=80",
    ],
    colors: [
      { name: "Black", value: "#000000" },
      { name: "Blue", value: "#3B82F6" },
      { name: "Red", value: "#EF4444" },
    ],
    inStock: true,
    isNew: false,
    isFeatured: false,
  },
  {
    id: "prod-4",
    name: "Wireless Earbuds Pro",
    brand: "Apple",
    description: "Active noise cancellation, spatial audio, and MagSafe charging in a compact design.",
    longDescription: "Reimagined from the ground up. Featuring the most advanced Active Noise Cancellation ever, Adaptive Transparency, and personalized Spatial Audio with dynamic head tracking. The all-new design delivers up to 2x more noise cancellation and significantly improved sound quality.",
    price: 179.99,
    originalPrice: 249.99,
    rating: 4.7,
    reviewCount: 2103,
    category: "Electronics",
    categorySlug: "electronics",
    image: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=600&auto=format&fit=crop&q=80",
    ],
    inStock: true,
    isNew: true,
    isFeatured: true,
  },

  // Home & Living
  {
    id: "prod-5",
    name: "Handcrafted Ceramic Vase",
    brand: "Meridian Home",
    description: "Artisan-made ceramic vase with an organic, minimalist silhouette.",
    longDescription: "Each vase is individually handcrafted by skilled artisans, ensuring no two pieces are exactly alike. The matte finish and organic curves bring a sense of calm and sophistication to any room. Perfect as a standalone sculpture or filled with dried botanicals.",
    price: 89.99,
    originalPrice: 89.99,
    rating: 4.5,
    reviewCount: 156,
    category: "Home & Living",
    categorySlug: "home-living",
    image: "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=600&auto=format&fit=crop&q=80",
    ],
    colors: [
      { name: "Sand", value: "#D2B48C" },
      { name: "Ivory", value: "#FFFFF0" },
      { name: "Charcoal", value: "#36454F" },
    ],
    inStock: true,
    isNew: false,
    isFeatured: false,
  },
  {
    id: "prod-6",
    name: "Linen Throw Blanket",
    brand: "Parachute",
    description: "Stonewashed European linen throw in a relaxed, lived-in texture.",
    longDescription: "Wrap yourself in luxury with this stonewashed European flax linen throw. Pre-washed for supreme softness from day one, it drapes beautifully over sofas, chairs, and beds. Breathable in summer, warm in winter — a year-round essential.",
    price: 149.99,
    originalPrice: 179.99,
    rating: 4.8,
    reviewCount: 312,
    category: "Home & Living",
    categorySlug: "home-living",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=80",
    ],
    colors: [
      { name: "Oat", value: "#E8DCC8" },
      { name: "Sage", value: "#9CAF88" },
      { name: "Dusk", value: "#967BB6" },
    ],
    inStock: true,
    isNew: true,
    isFeatured: true,
  },
  {
    id: "prod-7",
    name: "Soy Candle Collection",
    brand: "Meridian Home",
    description: "Set of three hand-poured soy candles in amber glass vessels.",
    longDescription: "Crafted with 100% natural soy wax and cotton wicks for a clean, even burn. Each candle features a unique botanical scent: Eucalyptus & Sage, Cedarwood & Vanilla, and Lavender & Bergamot. 45-hour burn time per candle.",
    price: 54.99,
    originalPrice: 64.99,
    rating: 4.6,
    reviewCount: 489,
    category: "Home & Living",
    categorySlug: "home-living",
    image: "https://images.unsplash.com/photo-1602028915047-37269d1a73f7?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1602028915047-37269d1a73f7?w=600&auto=format&fit=crop&q=80",
    ],
    inStock: true,
    isNew: false,
    isFeatured: false,
  },
  {
    id: "prod-8",
    name: "Minimalist Wall Clock",
    brand: "BRAUN",
    description: "Clean Bauhaus-inspired wall clock with silent sweep movement.",
    longDescription: "Inspired by Dieter Rams' timeless design philosophy. This wall clock features a silent sweep mechanism — no ticking — with a clean, easy-to-read face. The perfect intersection of form and function for any modern interior.",
    price: 79.99,
    originalPrice: 79.99,
    rating: 4.4,
    reviewCount: 97,
    category: "Home & Living",
    categorySlug: "home-living",
    image: "https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=600&auto=format&fit=crop&q=80",
    ],
    colors: [
      { name: "White", value: "#FFFFFF" },
      { name: "Black", value: "#000000" },
    ],
    inStock: true,
    isNew: false,
    isFeatured: false,
  },

  // Fashion
  {
    id: "prod-9",
    name: "Wool Overcoat",
    brand: "COS",
    description: "Tailored Italian wool-blend overcoat with a relaxed silhouette.",
    longDescription: "Expertly tailored from a premium Italian wool-cashmere blend. Features a relaxed, slightly oversized silhouette with notch lapels, concealed button closure, and interior pockets. A timeless investment piece that elevates any outfit.",
    price: 349.99,
    originalPrice: 449.99,
    rating: 4.7,
    reviewCount: 208,
    category: "Fashion",
    categorySlug: "fashion",
    image: "https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=600&auto=format&fit=crop&q=80",
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Camel", value: "#C19A6B" },
      { name: "Charcoal", value: "#36454F" },
      { name: "Black", value: "#000000" },
    ],
    inStock: true,
    isNew: false,
    isFeatured: true,
  },
  {
    id: "prod-10",
    name: "Leather Crossbody Bag",
    brand: "Everlane",
    description: "Full-grain Italian leather crossbody with adjustable strap.",
    longDescription: "Crafted from premium full-grain Italian leather that develops a beautiful patina over time. Features a zippered main compartment, interior slip pocket, and adjustable crossbody strap. Compact enough for everyday, spacious enough for essentials.",
    price: 198.00,
    originalPrice: 198.00,
    rating: 4.6,
    reviewCount: 347,
    category: "Fashion",
    categorySlug: "fashion",
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&auto=format&fit=crop&q=80",
    ],
    colors: [
      { name: "Cognac", value: "#9A4D2E" },
      { name: "Black", value: "#000000" },
      { name: "Bone", value: "#E3DAC9" },
    ],
    inStock: true,
    isNew: false,
    isFeatured: false,
  },
  {
    id: "prod-11",
    name: "Merino Wool Sweater",
    brand: "Uniqlo",
    description: "Ultra-fine merino crew neck in a versatile, everyday fit.",
    longDescription: "Made from superfine 19.5 micron Australian merino wool for an incredibly soft hand feel. Machine washable, naturally temperature-regulating, and pill-resistant. The elevated basic your wardrobe has been missing.",
    price: 89.90,
    originalPrice: 89.90,
    rating: 4.5,
    reviewCount: 1834,
    category: "Fashion",
    categorySlug: "fashion",
    image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&auto=format&fit=crop&q=80",
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [
      { name: "Sage", value: "#9CAF88" },
      { name: "Navy", value: "#1E3A5F" },
      { name: "Cream", value: "#FFFDD0" },
      { name: "Black", value: "#000000" },
    ],
    inStock: true,
    isNew: true,
    isFeatured: false,
  },
  {
    id: "prod-12",
    name: "Canvas Sneakers",
    brand: "Common Projects",
    description: "Minimalist low-top sneakers in premium Italian canvas.",
    longDescription: "The quintessential minimalist sneaker. Handmade in Italy with premium cotton canvas upper, Italian leather lining, and a margom rubber outsole. The signature gold serial number at the heel adds a subtle mark of distinction.",
    price: 295.00,
    originalPrice: 295.00,
    rating: 4.8,
    reviewCount: 567,
    category: "Fashion",
    categorySlug: "fashion",
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=600&auto=format&fit=crop&q=80",
    ],
    sizes: ["7", "8", "9", "10", "11", "12"],
    colors: [
      { name: "White", value: "#FFFFFF" },
      { name: "Black", value: "#000000" },
    ],
    inStock: true,
    isNew: false,
    isFeatured: true,
  },

  // Wellness
  {
    id: "prod-13",
    name: "Vitamin C Serum",
    brand: "The Ordinary",
    description: "Brightening serum with 15% L-Ascorbic acid and hyaluronic acid.",
    longDescription: "A potent vitamin C serum that targets uneven skin tone, dullness, and signs of aging. Formulated with 15% pure L-Ascorbic acid in a silicone-free base, paired with hyaluronic acid for lasting hydration. Visible results in 2 weeks.",
    price: 32.00,
    originalPrice: 32.00,
    rating: 4.4,
    reviewCount: 2891,
    category: "Wellness",
    categorySlug: "wellness",
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80",
    ],
    inStock: true,
    isNew: false,
    isFeatured: false,
  },
  {
    id: "prod-14",
    name: "Essential Oil Diffuser",
    brand: "Vitruvi",
    description: "Handcrafted stone diffuser with ultrasonic mist technology.",
    longDescription: "Designed to look beautiful in your home, this porcelain stone diffuser uses ultrasonic technology to evenly disperse essential oils as a fine mist. No heat, no wax — just pure aromatherapy. Covers up to 500 sq ft with auto shut-off.",
    price: 119.00,
    originalPrice: 119.00,
    rating: 4.7,
    reviewCount: 423,
    category: "Wellness",
    categorySlug: "wellness",
    image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&auto=format&fit=crop&q=80",
    ],
    colors: [
      { name: "White", value: "#FFFFFF" },
      { name: "Black", value: "#000000" },
      { name: "Terracotta", value: "#E2725B" },
    ],
    inStock: true,
    isNew: true,
    isFeatured: true,
  },
  {
    id: "prod-15",
    name: "Jade Face Roller",
    brand: "Mount Lai",
    description: "Genuine jade dual-ended facial roller for lymphatic drainage.",
    longDescription: "Handcrafted from authentic jade stone, this dual-ended roller helps reduce puffiness, promote lymphatic drainage, and enhance product absorption. The large end is perfect for cheeks and forehead; the small end targets under-eyes and brow bone.",
    price: 34.00,
    originalPrice: 48.00,
    rating: 4.3,
    reviewCount: 756,
    category: "Wellness",
    categorySlug: "wellness",
    image: "https://images.unsplash.com/photo-1590439471364-192aa70c0b53?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1590439471364-192aa70c0b53?w=600&auto=format&fit=crop&q=80",
    ],
    inStock: true,
    isNew: false,
    isFeatured: false,
  },
  {
    id: "prod-16",
    name: "Meditation Cushion",
    brand: "Halfmoon",
    description: "Organic buckwheat hull zafu cushion for seated meditation.",
    longDescription: "Designed to support proper spinal alignment during meditation. Filled with organic buckwheat hulls that conform to your body, with a durable organic cotton cover. The carry handle makes it easy to move between rooms or take to class.",
    price: 68.00,
    originalPrice: 68.00,
    rating: 4.6,
    reviewCount: 189,
    category: "Wellness",
    categorySlug: "wellness",
    image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=600&auto=format&fit=crop&q=80",
    ],
    colors: [
      { name: "Charcoal", value: "#36454F" },
      { name: "Indigo", value: "#4B0082" },
      { name: "Natural", value: "#F5F5DC" },
    ],
    inStock: true,
    isNew: false,
    isFeatured: false,
  },

  // Books & Stationery
  {
    id: "prod-17",
    name: "Leather-Bound Journal",
    brand: "Leuchtturm1917",
    description: "Hardcover dotted notebook with numbered pages and index.",
    longDescription: "The gold standard of notebooks. 251 numbered pages of acid-free 80gsm paper, dotted grid, with table of contents, two ribbon bookmarks, and a gusseted pocket at the back. Ink-proof paper prevents bleed-through.",
    price: 24.95,
    originalPrice: 24.95,
    rating: 4.8,
    reviewCount: 4521,
    category: "Books & Stationery",
    categorySlug: "books-stationery",
    image: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=600&auto=format&fit=crop&q=80",
    ],
    colors: [
      { name: "Black", value: "#000000" },
      { name: "Navy", value: "#1E3A5F" },
      { name: "Forest", value: "#228B22" },
      { name: "Berry", value: "#8E4585" },
    ],
    inStock: true,
    isNew: false,
    isFeatured: false,
  },
  {
    id: "prod-18",
    name: "Fountain Pen Set",
    brand: "LAMY",
    description: "Bauhaus-designed fountain pen with converter and ink cartridges.",
    longDescription: "The iconic LAMY Safari fountain pen in a complete starter set. Includes the pen with a polished steel nib (medium), Z 28 converter for bottled ink, and a pack of five T10 ink cartridges. The triangular grip section ensures effortless writing.",
    price: 42.00,
    originalPrice: 42.00,
    rating: 4.7,
    reviewCount: 891,
    category: "Books & Stationery",
    categorySlug: "books-stationery",
    image: "https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=600&auto=format&fit=crop&q=80",
    ],
    colors: [
      { name: "Charcoal", value: "#36454F" },
      { name: "White", value: "#FFFFFF" },
      { name: "Red", value: "#DC2626" },
    ],
    inStock: true,
    isNew: false,
    isFeatured: true,
  },
  {
    id: "prod-19",
    name: "Coffee Table Book — Architecture",
    brand: "Taschen",
    description: "A stunning visual journey through 100 contemporary architectural masterpieces.",
    longDescription: "This oversized hardcover showcases 100 of the most striking buildings of the 21st century. From Zaha Hadid to Bjarke Ingels, each project is presented with full-page photography and insightful commentary. A statement piece for any living room.",
    price: 65.00,
    originalPrice: 80.00,
    rating: 4.9,
    reviewCount: 234,
    category: "Books & Stationery",
    categorySlug: "books-stationery",
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&auto=format&fit=crop&q=80",
    ],
    inStock: true,
    isNew: true,
    isFeatured: false,
  },
  {
    id: "prod-20",
    name: "Desk Organizer Set",
    brand: "Grovemade",
    description: "Walnut and brass desk organizer with pen holder and tray.",
    longDescription: "CNC-milled from premium American black walnut with solid brass accents. Includes a pen holder, accessory tray, and phone stand. Each piece is hand-finished with natural oil for a warm, tactile surface that ages beautifully.",
    price: 125.00,
    originalPrice: 125.00,
    rating: 4.5,
    reviewCount: 178,
    category: "Books & Stationery",
    categorySlug: "books-stationery",
    image: "https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?w=600&auto=format&fit=crop&q=80",
    ],
    inStock: true,
    isNew: false,
    isFeatured: false,
  },

  // Kitchen & Dining
  {
    id: "prod-21",
    name: "Pour-Over Coffee Set",
    brand: "Chemex",
    description: "Iconic borosilicate glass brewer with natural wood collar.",
    longDescription: "The Chemex is as much a work of art as it is a coffee brewer — it's part of the permanent collection at MoMA. The patented Chemex bonded filters remove oils and sediment for a remarkably clean, pure cup of coffee. 8-cup capacity.",
    price: 49.50,
    originalPrice: 49.50,
    rating: 4.7,
    reviewCount: 1567,
    category: "Kitchen & Dining",
    categorySlug: "kitchen-dining",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&auto=format&fit=crop&q=80",
    ],
    inStock: true,
    isNew: false,
    isFeatured: true,
  },
  {
    id: "prod-22",
    name: "Cast Iron Dutch Oven",
    brand: "Le Creuset",
    description: "Enameled cast iron round Dutch oven in 5.5 qt capacity.",
    longDescription: "The legendary Le Creuset Dutch oven in a versatile 5.5-quart size. Cast from molten iron in individual sand molds and hand-inspected by 30 artisans. The colorful enamel exterior never needs seasoning and resists staining. Oven-safe to 500°F.",
    price: 379.95,
    originalPrice: 419.95,
    rating: 4.9,
    reviewCount: 3421,
    category: "Kitchen & Dining",
    categorySlug: "kitchen-dining",
    image: "https://images.unsplash.com/photo-1585442115883-81a908a29a04?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1585442115883-81a908a29a04?w=600&auto=format&fit=crop&q=80",
    ],
    colors: [
      { name: "Cerise", value: "#DE3163" },
      { name: "Marseille", value: "#4169E1" },
      { name: "Flame", value: "#E25822" },
    ],
    inStock: true,
    isNew: false,
    isFeatured: false,
  },
  {
    id: "prod-23",
    name: "Japanese Chef Knife",
    brand: "Shun",
    description: "8-inch Damascus steel chef's knife with pakkawood handle.",
    longDescription: "Hand-crafted in Seki City, Japan. 34 layers of Damascus-clad steel surround a VG-MAX cutting core hardened to 61 Rockwell. The D-shaped pakkawood handle provides comfortable control for both right and left-handed users. A lifetime investment for serious cooks.",
    price: 169.95,
    originalPrice: 199.95,
    rating: 4.8,
    reviewCount: 945,
    category: "Kitchen & Dining",
    categorySlug: "kitchen-dining",
    image: "https://images.unsplash.com/photo-1593618998160-e34014e67546?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1593618998160-e34014e67546?w=600&auto=format&fit=crop&q=80",
    ],
    inStock: true,
    isNew: true,
    isFeatured: false,
  },
  {
    id: "prod-24",
    name: "Cocktail Mixing Set",
    brand: "W&P",
    description: "Professional-grade cocktail set with Boston shaker and jigger.",
    longDescription: "Everything you need to craft cocktails at home. Includes a weighted Boston shaker, Japanese-style jigger, Hawthorne strainer, bar spoon, and muddler — all in brushed stainless steel. Comes in a beautiful gift box.",
    price: 85.00,
    originalPrice: 95.00,
    rating: 4.5,
    reviewCount: 312,
    category: "Kitchen & Dining",
    categorySlug: "kitchen-dining",
    image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&auto=format&fit=crop&q=80",
    ],
    inStock: true,
    isNew: false,
    isFeatured: false,
  },
];

export const reviews: Review[] = [
  {
    id: 1,
    userName: "Emma Davis",
    userAvatar: "https://notion-avatars.netlify.app/api/avatar?preset=female-1",
    date: "20 Mar, 2026",
    rating: 5,
    content: "Absolutely love these headphones! The noise cancellation is incredible — I can't hear anything when I'm on the train. Battery life is outstanding too. Best purchase I've made this year.",
    likes: 12,
    comments: 3,
    productId: "prod-1",
  },
  {
    id: 2,
    userName: "Anuj Mishra",
    userAvatar: "https://notion-avatars.netlify.app/api/avatar?preset=male-1",
    date: "15 Feb, 2026",
    rating: 5,
    content: "Premium quality that you can feel the moment you pick it up. The attention to detail is remarkable — from the packaging to the product itself. Worth every penny.",
    likes: 8,
    comments: 2,
    productId: "prod-2",
  },
  {
    id: 3,
    userName: "Sarah Chen",
    userAvatar: "https://notion-avatars.netlify.app/api/avatar?preset=female-2",
    date: "10 Jan, 2026",
    rating: 4,
    content: "Great product overall. The build quality is excellent and it looks beautiful. Only giving 4 stars because shipping took a bit longer than expected, but the product itself is perfect.",
    likes: 5,
    comments: 1,
    productId: "prod-1",
  },
  {
    id: 4,
    userName: "Robert Kim",
    userAvatar: "https://notion-avatars.netlify.app/api/avatar?preset=male-2",
    date: "28 Dec, 2025",
    rating: 5,
    content: "Third time buying from MERIDIAN and they never disappoint. The quality is consistently excellent and the customer service is top-notch. This has become my go-to store for gifts.",
    likes: 15,
    comments: 4,
    productId: "prod-9",
  },
  {
    id: 5,
    userName: "Lisa Park",
    userAvatar: "https://notion-avatars.netlify.app/api/avatar?preset=female-1",
    date: "5 Mar, 2026",
    rating: 4,
    content: "Beautiful design and comfortable to wear all day. The material quality is noticeable compared to similar products I've tried. Would definitely recommend to friends.",
    likes: 7,
    comments: 0,
    productId: "prod-11",
  },
  {
    id: 6,
    userName: "Marcus Johnson",
    userAvatar: "https://notion-avatars.netlify.app/api/avatar?preset=male-1",
    date: "1 Mar, 2026",
    rating: 5,
    content: "Exceeded my expectations in every way. The craftsmanship is superb and it looks even better in person than in the photos. Fast shipping and great packaging too.",
    likes: 10,
    comments: 2,
    productId: "prod-21",
  },
];

export function getProductsByCategory(categorySlug: string): Product[] {
  return products.filter((p) => p.categorySlug === categorySlug);
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.isFeatured);
}

export function getNewProducts(): Product[] {
  return products.filter((p) => p.isNew);
}

export function getReviewsForProduct(productId: string): Review[] {
  return reviews.filter((r) => r.productId === productId);
}

export function searchProducts(query: string): Product[] {
  const lower = query.toLowerCase();
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(lower) ||
      p.brand.toLowerCase().includes(lower) ||
      p.description.toLowerCase().includes(lower) ||
      p.category.toLowerCase().includes(lower)
  );
}
