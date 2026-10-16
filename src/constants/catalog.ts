/**
 * Single source of truth for restaurants, dishes, menus and reviews.
 * Home, Search and Restaurant screens all read from here.
 * Later you can replace these arrays with data from your backend / API.
 */

export const IMG = {
  burger: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80",
  pizza: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80",
  pasta: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&q=80",
  coffee: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80",
  noodles: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&q=80",
  salad: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80",
  fries: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=800&q=80",
  dessert: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800&q=80",
};

export type Restaurant = {
  id: string;
  name: string;
  image: string;
  mins: number;
  rating: number;
  reviews: string;
  price: string;
  distance: string;
  cuisines: string[];
  offer?: string;
  veg: boolean;
};

export const RESTAURANTS: Restaurant[] = [
  {
    id: "1",
    name: "The Burger House",
    image: IMG.burger,
    mins: 20,
    rating: 4.8,
    reviews: "1.2K",
    price: "₹200 for two",
    distance: "1.2 km",
    cuisines: ["Burgers", "American", "Fast Food"],
    offer: "60% OFF up to ₹120",
    veg: false,
  },
  {
    id: "2",
    name: "The Café Spot",
    image: IMG.pasta,
    mins: 25,
    rating: 4.6,
    reviews: "856",
    price: "₹300 for two",
    distance: "1.6 km",
    cuisines: ["Café", "Italian", "Pasta"],
    offer: "Flat ₹75 OFF",
    veg: true,
  },
  {
    id: "3",
    name: "Italian Bites",
    image: IMG.pizza,
    mins: 25,
    rating: 4.7,
    reviews: "910",
    price: "₹300 for two",
    distance: "2.0 km",
    cuisines: ["Pizza", "Italian", "Pasta"],
    offer: "20% OFF above ₹399",
    veg: true,
  },
  {
    id: "4",
    name: "Brew & Bites",
    image: IMG.coffee,
    mins: 15,
    rating: 4.5,
    reviews: "540",
    price: "₹250 for two",
    distance: "0.8 km",
    cuisines: ["Café", "Beverages", "Desserts"],
    veg: true,
  },
  {
    id: "5",
    name: "Sweet Tooth Bakery",
    image: IMG.dessert,
    mins: 18,
    rating: 4.4,
    reviews: "275",
    price: "₹220 for two",
    distance: "1.1 km",
    cuisines: ["Desserts", "Bakery", "Café"],
    veg: true,
  },
  {
    id: "6",
    name: "Healthy Hub",
    image: IMG.salad,
    mins: 22,
    rating: 4.6,
    reviews: "410",
    price: "₹280 for two",
    distance: "1.9 km",
    cuisines: ["Healthy", "Salads", "Bowls"],
    veg: true,
  },
  {
    id: "7",
    name: "Dragon Wok",
    image: IMG.noodles,
    mins: 35,
    rating: 4.1,
    reviews: "320",
    price: "₹350 for two",
    distance: "3.4 km",
    cuisines: ["Chinese", "Asian", "Noodles"],
    offer: "20% OFF above ₹399",
    veg: false,
  },
];

export type Dish = {
  id: string;
  name: string;
  price: number;
  image: string;
  veg: boolean;
  rating: number;
  tags: string[];
  restaurantId: string;
  restaurantName: string;
  desc?: string;
};

export const DISHES: Dish[] = [
  {
    id: "d1",
    name: "Classic Burger",
    price: 149,
    image: IMG.burger,
    veg: false,
    rating: 4.8,
    tags: ["burger", "american"],
    restaurantId: "1",
    restaurantName: "The Burger House",
    desc: "Juicy grilled patty, melted cheddar, lettuce and special house burger sauce",
  },
  {
    id: "d2",
    name: "Margherita Pizza",
    price: 249,
    image: IMG.pizza,
    veg: true,
    rating: 4.7,
    tags: ["pizza", "italian"],
    restaurantId: "3",
    restaurantName: "Italian Bites",
    desc: "Thin-crust delight loaded with fresh mozzarella, crushed tomatoes and basil",
  },
  {
    id: "d3",
    name: "White Sauce Pasta",
    price: 199,
    image: IMG.pasta,
    veg: true,
    rating: 4.6,
    tags: ["pasta", "italian", "café"],
    restaurantId: "2",
    restaurantName: "The Café Spot",
    desc: "Creamy and cheesy penne in rich béchamel sauce with seasoned herbs",
  },
  {
    id: "d4",
    name: "Iced Latte",
    price: 149,
    image: IMG.coffee,
    veg: true,
    rating: 4.5,
    tags: ["coffee", "café", "beverages"],
    restaurantId: "4",
    restaurantName: "Brew & Bites",
    desc: "Slow-dripped espresso poured over chilled fresh milk and cube ice",
  },
  {
    id: "d5",
    name: "Choco Pastry",
    price: 129,
    image: IMG.dessert,
    veg: true,
    rating: 4.6,
    tags: ["dessert", "bakery", "cake"],
    restaurantId: "5",
    restaurantName: "Sweet Tooth Bakery",
    desc: "Rich dark chocolate ganache layered with moist cocoa sponge",
  },
  {
    id: "d6",
    name: "Garden Fresh Bowl",
    price: 219,
    image: IMG.salad,
    veg: true,
    rating: 4.6,
    tags: ["healthy", "salad"],
    restaurantId: "6",
    restaurantName: "Healthy Hub",
    desc: "Crisp seasonal greens, cherry tomatoes, olives and light herb vinaigrette",
  },
  {
    id: "d7",
    name: "Hakka Noodles",
    price: 189,
    image: IMG.noodles,
    veg: true,
    rating: 4.3,
    tags: ["chinese", "noodles"],
    restaurantId: "7",
    restaurantName: "Dragon Wok",
    desc: "Wok-tossed noodles with shredded vegetables and authentic Indo-Chinese sauces",
  },
  {
    id: "d8",
    name: "Peri Peri Fries",
    price: 99,
    image: IMG.fries,
    veg: true,
    rating: 4.4,
    tags: ["fries", "snacks"],
    restaurantId: "1",
    restaurantName: "The Burger House",
    desc: "Golden crispy potato fries generously dusted with fiery peri-peri seasoning",
  },
];

export type MenuItem = {
  id: string;
  name: string;
  desc: string;
  price: number;
  image: string;
  veg: boolean;
};

export const MENUS: Record<string, MenuItem[]> = {
  Pizza: [
    { id: "m1", name: "Margherita Pizza", desc: "Classic delight with fresh basil and mozzarella", price: 249, image: IMG.pizza, veg: true },
    { id: "m2", name: "Pepperoni Pizza", desc: "Loaded with pepperoni & cheese", price: 299, image: IMG.pizza, veg: false },
    { id: "m3", name: "White Sauce Pasta", desc: "Creamy and cheesy goodness", price: 199, image: IMG.pasta, veg: true },
  ],
  Burgers: [
    { id: "m1", name: "Classic Burger", desc: "Juicy patty, cheese, lettuce and house sauce", price: 149, image: IMG.burger, veg: false },
    { id: "m2", name: "Double Cheese Burger", desc: "Two patties, double melted cheese", price: 229, image: IMG.burger, veg: false },
    { id: "m3", name: "Peri Peri Fries", desc: "Crispy fries with spicy peri peri seasoning", price: 99, image: IMG.fries, veg: true },
  ],
  Café: [
    { id: "m1", name: "Iced Latte", desc: "Chilled espresso with creamy milk", price: 149, image: IMG.coffee, veg: true },
    { id: "m2", name: "White Sauce Pasta", desc: "Creamy and cheesy goodness", price: 199, image: IMG.pasta, veg: true },
    { id: "m3", name: "Choco Pastry", desc: "Rich chocolate layers, baked fresh", price: 129, image: IMG.dessert, veg: true },
  ],
  Desserts: [
    { id: "m1", name: "Choco Pastry", desc: "Rich chocolate layers, baked fresh", price: 129, image: IMG.dessert, veg: true },
    { id: "m2", name: "Cold Coffee", desc: "Thick, creamy and chilled", price: 139, image: IMG.coffee, veg: true },
    { id: "m3", name: "Peri Peri Fries", desc: "Crispy fries with spicy peri peri seasoning", price: 99, image: IMG.fries, veg: true },
  ],
  Healthy: [
    { id: "m1", name: "Garden Fresh Bowl", desc: "Crunchy greens, veggies and house dressing", price: 219, image: IMG.salad, veg: true },
    { id: "m2", name: "Protein Salad", desc: "Chickpeas, paneer and seeds", price: 249, image: IMG.salad, veg: true },
    { id: "m3", name: "Cold Coffee", desc: "Thick, creamy and chilled", price: 139, image: IMG.coffee, veg: true },
  ],
  Chinese: [
    { id: "m1", name: "Hakka Noodles", desc: "Wok-tossed noodles with crunchy veggies", price: 189, image: IMG.noodles, veg: true },
    { id: "m2", name: "Chilli Garlic Noodles", desc: "Spicy, garlicky and full of flavour", price: 209, image: IMG.noodles, veg: true },
    { id: "m3", name: "Peri Peri Fries", desc: "Crispy fries with spicy peri peri seasoning", price: 99, image: IMG.fries, veg: true },
  ],
};

export const REVIEWS = [
  { id: "r1", name: "Aarav S.", rating: 5, text: "Loved the food, super quick delivery and still hot!", when: "2 days ago" },
  { id: "r2", name: "Meera K.", rating: 4, text: "Great taste and generous portions. Worth the price.", when: "1 week ago" },
  { id: "r3", name: "Rohit J.", rating: 5, text: "Best place around for a relaxed evening. Highly recommend.", when: "2 weeks ago" },
];

export const getRestaurant = (id: string) => RESTAURANTS.find((r) => r.id === id);