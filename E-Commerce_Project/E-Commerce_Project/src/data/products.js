export const products = [
  {
    id: 'prod-headphones',
    name: 'Noise-Cancelling Headphones',
    category: 'electronics',
    price: 249,
    badge: 'New',
    description: 'Immersive sound with 30-hour battery life and adaptive noise cancellation.',
    rating: 4.5,
    reviews: 128,
    image: '/images/headphones_1781936619495.png'
  },
  {
    id: 'prod-coat',
    name: 'Merino Wool Coat',
    category: 'fashion',
    price: 345,
    oldPrice: 430,
    badge: '−20%',
    description: 'Luxuriously soft, sustainably sourced. Built for layering through every season.',
    rating: 5,
    reviews: 87,
    image: '/images/wool_coat_1781936631647.png'
  },
  {
    id: 'prod-chair',
    name: 'Japandi Lounge Chair',
    category: 'home',
    price: 599,
    description: 'Minimalist form meets maximum comfort. Solid oak frame with premium linen upholstery.',
    rating: 4.5,
    reviews: 54,
    image: '/images/japandi_chair_1781936642841.png'
  },
  {
    id: 'prod-phone',
    name: 'Ultra Slim Smartphone',
    category: 'electronics',
    price: 899,
    badge: 'Hot',
    description: '6.7-inch AMOLED, 200MP camera system, 5000mAh battery. Photography reimagined.',
    rating: 5,
    reviews: 312,
    image: '/images/smartphone_1781936658744.png'
  },
  {
    id: 'prod-sneakers',
    name: 'Cloud Runner Sneakers',
    category: 'fashion',
    price: 145,
    description: 'Ultra-light responsive foam sole with breathable mesh upper. Runs like a dream.',
    rating: 4.5,
    reviews: 201,
    image: '/images/sneakers_1781936672778.png'
  },
  {
    id: 'prod-espresso',
    name: 'Precision Espresso Maker',
    category: 'home',
    price: 329,
    oldPrice: 389,
    badge: '−15%',
    description: 'Barista-grade 15-bar pressure, built-in grinder, and milk frother. Café at home.',
    rating: 5,
    reviews: 96,
    image: '/images/espresso_maker_1781936692624.png'
  },
  {
    id: 'prod-perfume',
    name: 'Signature Elegance Perfume',
    category: 'beauty',
    price: 120,
    badge: 'Bestseller',
    description: 'A luxurious blend of floral and woody notes. Elegance in a bottle.',
    rating: 4.8,
    reviews: 412,
    image: '/images/Perfume.jpg'
  },
  {
    id: 'prod-serum',
    name: 'Hydrating Face Serum',
    category: 'beauty',
    price: 45,
    description: 'Vitamin C and Hyaluronic Acid for a radiant, glowing complexion.',
    rating: 4.5,
    reviews: 189,
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'prod-yoga',
    name: 'Pro-Grip Yoga Mat',
    category: 'sports',
    price: 65,
    description: 'Eco-friendly, non-slip texture with perfect cushioning for your practice.',
    rating: 5,
    reviews: 320,
    image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'prod-dumbbells',
    name: 'Adjustable Dumbbells Set',
    category: 'sports',
    price: 199,
    oldPrice: 250,
    badge: '−20%',
    description: 'Space-saving design, adjust from 5 to 52.5 lbs with a simple dial.',
    rating: 4.9,
    reviews: 156,
    image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=600&auto=format&fit=crop'
  }
];

export const categories = [
  {
    id: 'electronics',
    name: 'Electronics',
    countText: '240+ items',
    iconClass: 'fa-laptop',
    bgGradient: 'linear-gradient(135deg, #667eea, #764ba2)',
    image: '/images/headphones_1781936619495.png'
  },
  {
    id: 'fashion',
    name: 'Fashion',
    countText: '1,800+ items',
    iconClass: 'fa-tshirt',
    bgGradient: 'linear-gradient(135deg, #f093fb, #f5576c)',
    image: '/images/wool_coat_1781936631647.png'
  },
  {
    id: 'home',
    name: 'Home & Kitchen',
    countText: '950+ items',
    iconClass: 'fa-blender',
    bgGradient: 'linear-gradient(135deg, #4facfe, #00f2fe)',
    image: '/images/japandi_chair_1781936642841.png'
  },
  {
    id: 'beauty',
    name: 'Beauty',
    countText: '670+ items',
    iconClass: 'fa-perfume',
    bgGradient: 'linear-gradient(135deg, #f6d365, #fda085)',
    image: '/images/Perfume.jpg'
  },
  {
    id: 'sports',
    name: 'Sports',
    countText: '430+ items',
    iconClass: 'fa-dumbbell',
    bgGradient: 'linear-gradient(135deg, #96fbc4, #f9f586)',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=600&auto=format&fit=crop'
  }
];
