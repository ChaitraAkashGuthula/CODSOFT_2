import { realtimeDispatcher } from "@/lib/events";
import {
  OrderType,
  OrderStatus,
  TableStatus,
  ReservationStatus,
  PaymentStatus,
} from "@/lib/types";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sortOrder: number;
  items?: MenuItem[];
}

export interface MenuItem {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  isAvailable: boolean;
  preparationTime: number;
  calories: number | null;
  allergens: string[];
  createdAt: Date;
  updatedAt: Date;
  category?: Category;
}

export interface Table {
  id: string;
  tableNumber: number;
  capacity: number;
  location: string;
  status: TableStatus;
  qrCodeUrl: string | null;
  createdAt: Date;
  orders?: any[];
  reservations?: any[];
}

export interface OrderItem {
  id: string;
  orderId: string;
  menuItemId: string;
  quantity: number;
  unitPrice: number;
  customInstructions: string | null;
  menuItem?: MenuItem;
}

export interface Order {
  id: string;
  orderNumber: string;
  type: OrderType;
  status: OrderStatus;
  tableId: string | null;
  userId: string | null;
  customerName: string;
  customerPhone: string | null;
  customerEmail: string | null;
  notes: string | null;
  subtotal: number;
  tax: number;
  tip: number;
  total: number;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  createdAt: Date;
  updatedAt: Date;
  table?: Table | null;
  items: OrderItem[];
}

export interface Reservation {
  id: string;
  tableId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  guestCount: number;
  reservationDate: string;
  timeSlot: string;
  status: ReservationStatus;
  specialRequests: string | null;
  createdAt: Date;
  table?: Table;
}

// Initial In-Memory Seed Data
function getInitialData() {
  const categories: Category[] = [
    {
      id: "cat-1",
      name: "Biryani & Rice Specials",
      slug: "biryani-rice",
      description: "Royal slow-cooked dum biryanis, aromatic saffron basmati, and fragrant claypot rice specials.",
      sortOrder: 1,
    },
    {
      id: "cat-2",
      name: "Handcrafted Pizzas & Burgers",
      slug: "pizzas-burgers",
      description: "Artisanal hand-stretched sourdough crusts, gourmet smash patties, and melt-in-mouth brioche buns.",
      sortOrder: 2,
    },
    {
      id: "cat-3",
      name: "Parathas & Tandoori Starters",
      slug: "parathas-starters",
      description: "Charred clay oven kebabs, tandoori tikkas, and golden-crisp stuffed Amritsari flatbreads.",
      sortOrder: 3,
    },
    {
      id: "cat-4",
      name: "Shawarmas & Wraps",
      slug: "shawarmas-wraps",
      description: "Authentic Lebanese spiced meats, slow-roasted rotisserie, garlic toum, and warm toasted pita rolls.",
      sortOrder: 4,
    },
    {
      id: "cat-5",
      name: "Thick Milkshakes & Desserts",
      slug: "shakes-desserts",
      description: "Indulgent artisan thickshakes, chilled fruit pulps, decadent gulab jamuns, and classic baked cheesecakes.",
      sortOrder: 5,
    },
  ];

  const menuItems: MenuItem[] = [
    // 1. Biryani & Rice Specials
    {
      id: "item-1",
      categoryId: "cat-1",
      name: "Hyderabadi Chicken Dum Biryani",
      description: "Slow-cooked aromatic basmati rice layered with spiced marinated chicken, saffron, and fresh mint. Served with mirchi ka salan and raita.",
      price: 349,
      imageUrl: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80",
      isVegetarian: false,
      isVegan: false,
      isGlutenFree: false,
      isAvailable: true,
      preparationTime: 25,
      calories: 780,
      allergens: ["Dairy", "Nuts"],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "item-2",
      categoryId: "cat-1",
      name: "Paneer Tikka Dum Biryani",
      description: "Fragrant long-grain basmati rice with smoky grilled paneer cubes, caramelized onions, and royal spices.",
      price: 299,
      imageUrl: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=600&q=80",
      isVegetarian: true,
      isVegan: false,
      isGlutenFree: true,
      isAvailable: true,
      preparationTime: 20,
      calories: 650,
      allergens: ["Dairy"],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "item-3",
      categoryId: "cat-1",
      name: "Mutton Ghee Roast Biryani",
      description: "Tender mutton cuts slow-braised in rich clarified butter with roasted spices over fragrant rice.",
      price: 449,
      imageUrl: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=600&q=80",
      isVegetarian: false,
      isVegan: false,
      isGlutenFree: false,
      isAvailable: true,
      preparationTime: 30,
      calories: 890,
      allergens: ["Dairy"],
      createdAt: new Date(),
      updatedAt: new Date(),
    },

    // 2. Handcrafted Pizzas & Burgers
    {
      id: "item-4",
      categoryId: "cat-2",
      name: "Overloaded Farmhouse Pizza",
      description: "Crisp hand-tossed sourdough topped with herb-infused marinara, fresh mozzarella, bell peppers, olives, corn, and jalapeños.",
      price: 399,
      imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80",
      isVegetarian: true,
      isVegan: false,
      isGlutenFree: false,
      isAvailable: true,
      preparationTime: 18,
      calories: 720,
      allergens: ["Gluten", "Dairy"],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "item-5",
      categoryId: "cat-2",
      name: "Smoky BBQ Chicken Pizza",
      description: "Grilled BBQ chicken chunks, caramelized red onions, smoked scamorza, and house-made BBQ glaze.",
      price: 449,
      imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80",
      isVegetarian: false,
      isVegan: false,
      isGlutenFree: false,
      isAvailable: true,
      preparationTime: 20,
      calories: 810,
      allergens: ["Gluten", "Dairy"],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "item-6",
      categoryId: "cat-2",
      name: "Crispy Double Patty Smash Burger",
      description: "Two seared crispy smashed patties, melted cheddar, house secret relish, and dill pickles in a toasted brioche bun.",
      price: 289,
      imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80",
      isVegetarian: false,
      isVegan: false,
      isGlutenFree: false,
      isAvailable: true,
      preparationTime: 15,
      calories: 680,
      allergens: ["Gluten", "Dairy", "Egg"],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "item-7",
      categoryId: "cat-2",
      name: "Spicy Paneer Crunch Burger",
      description: "Golden panko-crusted cottage cheese patty with fiery sriracha mayo, iceberg lettuce, and cheese blend.",
      price: 229,
      imageUrl: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&q=80",
      isVegetarian: true,
      isVegan: false,
      isGlutenFree: false,
      isAvailable: true,
      preparationTime: 15,
      calories: 590,
      allergens: ["Gluten", "Dairy"],
      createdAt: new Date(),
      updatedAt: new Date(),
    },

    // 3. Parathas & Tandoori Starters
    {
      id: "item-8",
      categoryId: "cat-3",
      name: "Amritsari Stuffed Aloo Paratha",
      description: "Flaky, golden-crisp tandoori wheat flatbread stuffed with spiced crushed potatoes, served with white butter and curd.",
      price: 179,
      imageUrl: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80",
      isVegetarian: true,
      isVegan: false,
      isGlutenFree: false,
      isAvailable: true,
      preparationTime: 12,
      calories: 480,
      allergens: ["Gluten", "Dairy"],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "item-9",
      categoryId: "cat-3",
      name: "Chicken Tikka Kebab Skewers",
      description: "Charred succulent boneless chicken thighs marinated overnight in Kashmiri chili, ginger-garlic paste, and hung curd.",
      price: 329,
      imageUrl: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=600&q=80",
      isVegetarian: false,
      isVegan: false,
      isGlutenFree: true,
      isAvailable: true,
      preparationTime: 18,
      calories: 420,
      allergens: ["Dairy"],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "item-10",
      categoryId: "cat-3",
      name: "Paneer Malai Tikka",
      description: "Melt-in-mouth cottage cheese chunks marinated in cashew cream, cardamom, and gentle spices.",
      price: 299,
      imageUrl: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=600&q=80",
      isVegetarian: true,
      isVegan: false,
      isGlutenFree: true,
      isAvailable: true,
      preparationTime: 15,
      calories: 490,
      allergens: ["Dairy", "Nuts"],
      createdAt: new Date(),
      updatedAt: new Date(),
    },

    // 4. Shawarmas & Wraps
    {
      id: "item-11",
      categoryId: "cat-4",
      name: "Lebanese Chicken Shawarma Roll",
      description: "Tender grilled spiced chicken shavings wrapped in soft rumali bread with creamy garlic toum and pickled gherkins.",
      price: 219,
      imageUrl: "https://images.unsplash.com/photo-1648750835471-c7d67ff94c77?auto=format&fit=crop&w=600&q=80",
      isVegetarian: false,
      isVegan: false,
      isGlutenFree: false,
      isAvailable: true,
      preparationTime: 12,
      calories: 510,
      allergens: ["Gluten", "Garlic"],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "item-12",
      categoryId: "cat-4",
      name: "Falafel & Hummus Pita Wrap",
      description: "Crispy golden chickpea falafels with velvety tahini hummus, fresh sumac salad, and mint dressing in toasted pita.",
      price: 189,
      imageUrl: "https://images.unsplash.com/photo-1540914124281-342587941389?auto=format&fit=crop&w=600&q=80",
      isVegetarian: true,
      isVegan: true,
      isGlutenFree: false,
      isAvailable: true,
      preparationTime: 12,
      calories: 440,
      allergens: ["Gluten", "Sesame"],
      createdAt: new Date(),
      updatedAt: new Date(),
    },

    // 5. Thick Milkshakes & Desserts
    {
      id: "item-13",
      categoryId: "cat-5",
      name: "Belgian Chocolate Mud Thickshake",
      description: "Rich Belgian dark chocolate ganache blended with creamy vanilla ice cream, topped with chocolate curls.",
      price: 199,
      imageUrl: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80",
      isVegetarian: true,
      isVegan: false,
      isGlutenFree: true,
      isAvailable: true,
      preparationTime: 8,
      calories: 520,
      allergens: ["Dairy"],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "item-14",
      categoryId: "cat-5",
      name: "Mango Alphonso Cream Shake",
      description: "Real Ratnagiri Alphonso mango pulp churned with chilled whole milk and topped with mango cubes.",
      price: 189,
      imageUrl: "https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=600&q=80",
      isVegetarian: true,
      isVegan: false,
      isGlutenFree: true,
      isAvailable: true,
      preparationTime: 8,
      calories: 410,
      allergens: ["Dairy"],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "item-15",
      categoryId: "cat-5",
      name: "Warm Gulab Jamun with Rabdi",
      description: "Classic golden fried khoya dumplings soaked in rose-cardamom syrup, served over thick chilled rabdi.",
      price: 149,
      imageUrl: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80",
      isVegetarian: true,
      isVegan: false,
      isGlutenFree: false,
      isAvailable: true,
      preparationTime: 10,
      calories: 380,
      allergens: ["Dairy", "Gluten", "Nuts"],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "item-16",
      categoryId: "cat-5",
      name: "New York Baked Cheesecake",
      description: "Dense, velvety cream cheese filling with a buttery graham cracker crust and wild berry compote.",
      price: 229,
      imageUrl: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=600&q=80",
      isVegetarian: true,
      isVegan: false,
      isGlutenFree: false,
      isAvailable: true,
      preparationTime: 5,
      calories: 450,
      allergens: ["Dairy", "Gluten", "Egg"],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const tables: Table[] = [
    { id: "tbl-1", tableNumber: 1, capacity: 2, location: "Window Bay", status: TableStatus.AVAILABLE, qrCodeUrl: "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https://dinedesk.restaurant/table/1", createdAt: new Date() },
    { id: "tbl-2", tableNumber: 2, capacity: 2, location: "Window Bay", status: TableStatus.OCCUPIED, qrCodeUrl: "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https://dinedesk.restaurant/table/2", createdAt: new Date() },
    { id: "tbl-3", tableNumber: 3, capacity: 4, location: "Main Dining", status: TableStatus.AVAILABLE, qrCodeUrl: "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https://dinedesk.restaurant/table/3", createdAt: new Date() },
    { id: "tbl-4", tableNumber: 4, capacity: 4, location: "Main Dining", status: TableStatus.RESERVED, qrCodeUrl: "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https://dinedesk.restaurant/table/4", createdAt: new Date() },
    { id: "tbl-5", tableNumber: 5, capacity: 6, location: "Main Dining", status: TableStatus.AVAILABLE, qrCodeUrl: "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https://dinedesk.restaurant/table/5", createdAt: new Date() },
    { id: "tbl-6", tableNumber: 6, capacity: 4, location: "Patio Garden", status: TableStatus.AVAILABLE, qrCodeUrl: "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https://dinedesk.restaurant/table/6", createdAt: new Date() },
    { id: "tbl-7", tableNumber: 7, capacity: 8, location: "Patio Garden", status: TableStatus.AVAILABLE, qrCodeUrl: "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https://dinedesk.restaurant/table/7", createdAt: new Date() },
    { id: "tbl-8", tableNumber: 8, capacity: 6, location: "VIP Booth", status: TableStatus.AVAILABLE, qrCodeUrl: "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https://dinedesk.restaurant/table/8", createdAt: new Date() },
  ];

  const now = Date.now();
  const orders: Order[] = [
    {
      id: "ord-1",
      orderNumber: "ORD-1001",
      type: OrderType.DINE_IN,
      status: OrderStatus.PENDING,
      tableId: "tbl-2",
      userId: null,
      customerName: "Sarah Jenkins",
      customerPhone: "+91 98765 43212",
      customerEmail: "sarah.j@example.com",
      notes: "Please make the biryani mild spicy. Extra raita on the side.",
      subtotal: 727,
      tax: 36.35,
      tip: 50.0,
      total: 813.35,
      paymentStatus: PaymentStatus.PAID,
      paymentMethod: "UPI",
      createdAt: new Date(now - 4 * 60 * 1000),
      updatedAt: new Date(now - 4 * 60 * 1000),
      items: [
        {
          id: "oi-1",
          orderId: "ord-1",
          menuItemId: "item-1",
          quantity: 1,
          unitPrice: 349,
          customInstructions: "Mild spicy with extra salan and raita",
        },
        {
          id: "oi-2",
          orderId: "ord-1",
          menuItemId: "item-8",
          quantity: 1,
          unitPrice: 179,
          customInstructions: "Extra white butter please",
        },
        {
          id: "oi-3",
          orderId: "ord-1",
          menuItemId: "item-13",
          quantity: 1,
          unitPrice: 199,
          customInstructions: null,
        },
      ],
    },
    {
      id: "ord-2",
      orderNumber: "ORD-1002",
      type: OrderType.DINE_IN,
      status: OrderStatus.PREPARING,
      tableId: "tbl-4",
      userId: null,
      customerName: "Aditya Mehta",
      customerPhone: "+91 98765 43213",
      customerEmail: "aditya.m@example.com",
      notes: "Thin crust preferred if possible, crispy well-done.",
      subtotal: 688,
      tax: 34.4,
      tip: 40.0,
      total: 762.4,
      paymentStatus: PaymentStatus.PAID,
      paymentMethod: "CARD",
      createdAt: new Date(now - 14 * 60 * 1000),
      updatedAt: new Date(now - 10 * 60 * 1000),
      items: [
        {
          id: "oi-4",
          orderId: "ord-2",
          menuItemId: "item-4",
          quantity: 1,
          unitPrice: 399,
          customInstructions: "Extra jalapeños and crispy crust",
        },
        {
          id: "oi-5",
          orderId: "ord-2",
          menuItemId: "item-6",
          quantity: 1,
          unitPrice: 289,
          customInstructions: "No onions, extra melted cheddar",
        },
      ],
    },
    {
      id: "ord-3",
      orderNumber: "ORD-1003",
      type: OrderType.TAKEOUT,
      status: OrderStatus.READY,
      tableId: null,
      userId: null,
      customerName: "Pooja Hegde",
      customerPhone: "+91 98765 43214",
      customerEmail: "pooja.h@example.com",
      notes: "Takeaway order. Please pack spoons and napkins.",
      subtotal: 408,
      tax: 20.4,
      tip: 20.0,
      total: 448.4,
      paymentStatus: PaymentStatus.PAID,
      paymentMethod: "UPI",
      createdAt: new Date(now - 22 * 60 * 1000),
      updatedAt: new Date(now - 5 * 60 * 1000),
      items: [
        {
          id: "oi-6",
          orderId: "ord-3",
          menuItemId: "item-11",
          quantity: 1,
          unitPrice: 219,
          customInstructions: "Extra garlic toum dip",
        },
        {
          id: "oi-7",
          orderId: "ord-3",
          menuItemId: "item-14",
          quantity: 1,
          unitPrice: 189,
          customInstructions: "Chilled with extra mango pulp",
        },
      ],
    },
    {
      id: "ord-4",
      orderNumber: "ORD-1004",
      type: OrderType.DINE_IN,
      status: OrderStatus.SERVED,
      tableId: "tbl-1",
      userId: null,
      customerName: "Rohan Varma",
      customerPhone: "+91 98765 43215",
      customerEmail: "rohan.v@example.com",
      notes: null,
      subtotal: 598,
      tax: 29.9,
      tip: 50.0,
      total: 677.9,
      paymentStatus: PaymentStatus.PAID,
      paymentMethod: "CARD",
      createdAt: new Date(now - 55 * 60 * 1000),
      updatedAt: new Date(now - 25 * 60 * 1000),
      items: [
        {
          id: "oi-8",
          orderId: "ord-4",
          menuItemId: "item-2",
          quantity: 1,
          unitPrice: 299,
          customInstructions: null,
        },
        {
          id: "oi-9",
          orderId: "ord-4",
          menuItemId: "item-10",
          quantity: 1,
          unitPrice: 299,
          customInstructions: null,
        },
      ],
    },
    {
      id: "ord-5",
      orderNumber: "ORD-1005",
      type: OrderType.DELIVERY,
      status: OrderStatus.SERVED,
      tableId: null,
      userId: null,
      customerName: "Vikram Malhotra",
      customerPhone: "+91 98765 43216",
      customerEmail: "vikram.m@example.com",
      notes: "Leave at door, ring bell twice.",
      subtotal: 678,
      tax: 33.9,
      tip: 60.0,
      total: 771.9,
      paymentStatus: PaymentStatus.PAID,
      paymentMethod: "UPI",
      createdAt: new Date(now - 85 * 60 * 1000),
      updatedAt: new Date(now - 40 * 60 * 1000),
      items: [
        {
          id: "oi-10",
          orderId: "ord-5",
          menuItemId: "item-5",
          quantity: 1,
          unitPrice: 449,
          customInstructions: null,
        },
        {
          id: "oi-11",
          orderId: "ord-5",
          menuItemId: "item-16",
          quantity: 1,
          unitPrice: 229,
          customInstructions: null,
        },
      ],
    },
  ];

  const reservations: Reservation[] = [
    {
      id: "res-1",
      tableId: "tbl-4",
      customerName: "Ananya Sharma",
      customerEmail: "ananya.s@example.com",
      customerPhone: "+91 98765 43220",
      guestCount: 4,
      reservationDate: new Date().toISOString().split("T")[0],
      timeSlot: "19:30",
      status: ReservationStatus.CONFIRMED,
      specialRequests: "Anniversary dinner. Quiet table preferred.",
      createdAt: new Date(now - 3 * 3600 * 1000),
    },
    {
      id: "res-2",
      tableId: "tbl-8",
      customerName: "Karan Johar",
      customerEmail: "karan.j@example.com",
      customerPhone: "+91 98765 43221",
      guestCount: 6,
      reservationDate: new Date().toISOString().split("T")[0],
      timeSlot: "20:30",
      status: ReservationStatus.CONFIRMED,
      specialRequests: "VIP business dinner. Ready bottle of sparkling water on arrival.",
      createdAt: new Date(now - 5 * 3600 * 1000),
    },
  ];

  return { categories, menuItems, tables, orders, reservations };
}

// Global in-memory singleton that persists across API calls in Node.js / Vercel serverless containers
const globalForStore = globalThis as unknown as {
  __dinedesk_store?: ReturnType<typeof getInitialData>;
};

if (!globalForStore.__dinedesk_store) {
  globalForStore.__dinedesk_store = getInitialData();
}

const store = globalForStore.__dinedesk_store!;

export const dataStore = {
  // --- Categories & Menu Items ---
  getCategories(includeItems = true, availableOnly = false, search = "") {
    return store.categories
      .slice()
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((cat) => {
        if (!includeItems) return { ...cat };
        let items = store.menuItems.filter((i) => i.categoryId === cat.id);
        if (availableOnly) items = items.filter((i) => i.isAvailable);
        if (search) {
          const q = search.toLowerCase();
          items = items.filter(
            (i) =>
              i.name.toLowerCase().includes(q) ||
              i.description.toLowerCase().includes(q)
          );
        }
        return {
          ...cat,
          items: items.slice().sort((a, b) => a.name.localeCompare(b.name)),
        };
      });
  },

  getMenuItems(availableOnly = false, search = "") {
    let items = store.menuItems.slice();
    if (availableOnly) items = items.filter((i) => i.isAvailable);
    if (search) {
      const q = search.toLowerCase();
      items = items.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.description.toLowerCase().includes(q)
      );
    }
    return items.map((item) => ({
      ...item,
      category: store.categories.find((c) => c.id === item.categoryId),
    }));
  },

  getMenuItemById(id: string) {
    const item = store.menuItems.find((i) => i.id === id);
    if (!item) return null;
    return {
      ...item,
      category: store.categories.find((c) => c.id === item.categoryId),
    };
  },

  createMenuItem(data: any) {
    const id = `item-${Date.now()}`;
    const newItem: MenuItem = {
      id,
      categoryId: data.categoryId,
      name: data.name,
      description: data.description,
      price: Number(data.price),
      imageUrl: data.imageUrl,
      isVegetarian: Boolean(data.isVegetarian),
      isVegan: Boolean(data.isVegan),
      isGlutenFree: Boolean(data.isGlutenFree),
      isAvailable: data.isAvailable ?? true,
      preparationTime: Number(data.preparationTime || 15),
      calories: data.calories ? Number(data.calories) : null,
      allergens: Array.isArray(data.allergens) ? data.allergens : [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    store.menuItems.push(newItem);
    return {
      ...newItem,
      category: store.categories.find((c) => c.id === newItem.categoryId),
    };
  },

  updateMenuItem(id: string, data: any) {
    const idx = store.menuItems.findIndex((i) => i.id === id);
    if (idx === -1) return null;
    store.menuItems[idx] = {
      ...store.menuItems[idx],
      ...data,
      updatedAt: new Date(),
    };
    return {
      ...store.menuItems[idx],
      category: store.categories.find((c) => c.id === store.menuItems[idx].categoryId),
    };
  },

  deleteMenuItem(id: string) {
    const idx = store.menuItems.findIndex((i) => i.id === id);
    if (idx === -1) return false;
    store.menuItems.splice(idx, 1);
    return true;
  },

  // --- Tables ---
  getTables() {
    return store.tables.map((tbl) => {
      const activeOrders = store.orders
        .filter(
          (o) =>
            o.tableId === tbl.id &&
            ["PENDING", "PREPARING", "READY"].includes(o.status)
        )
        .map((o) => ({
          id: o.id,
          orderNumber: o.orderNumber,
          status: o.status,
          customerName: o.customerName,
          total: o.total,
          createdAt: o.createdAt,
        }));

      const activeReservations = store.reservations.filter(
        (r) =>
          r.tableId === tbl.id && ["CONFIRMED", "SEATED"].includes(r.status)
      );

      return {
        ...tbl,
        orders: activeOrders,
        reservations: activeReservations,
      };
    });
  },

  updateTableStatus(tableId: string, status: TableStatus) {
    const tbl = store.tables.find((t) => t.id === tableId);
    if (!tbl) return null;
    tbl.status = status;
    return tbl;
  },

  // --- Orders ---
  getOrders(status?: string, tableId?: string, limit = 50) {
    let orders = store.orders.slice();
    if (status) orders = orders.filter((o) => o.status === status);
    if (tableId) orders = orders.filter((o) => o.tableId === tableId);

    // Sort descending by creation date
    orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return orders.slice(0, limit).map((o) => ({
      ...o,
      table: store.tables.find((t) => t.id === o.tableId) || null,
      items: o.items.map((item) => ({
        ...item,
        menuItem: store.menuItems.find((m) => m.id === item.menuItemId),
      })),
    }));
  },

  getOrderById(idOrOrderNumber: string) {
    const order = store.orders.find(
      (o) => o.id === idOrOrderNumber || o.orderNumber.toUpperCase() === idOrOrderNumber.toUpperCase()
    );
    if (!order) return null;
    return {
      ...order,
      table: store.tables.find((t) => t.id === order.tableId) || null,
      items: order.items.map((item) => ({
        ...item,
        menuItem: store.menuItems.find((m) => m.id === item.menuItemId),
      })),
    };
  },

  createOrder(data: any) {
    const subtotal = data.items.reduce(
      (acc: number, item: any) => acc + item.unitPrice * item.quantity,
      0
    );
    const tax = Number((subtotal * 0.08).toFixed(2));
    const tip = Number((data.tip || 0).toFixed(2));
    const total = Number((subtotal + tax + tip).toFixed(2));

    const orderNumber = `ORD-${1000 + store.orders.length + 1}`;
    const orderId = `ord-${Date.now()}`;

    const newOrder: Order = {
      id: orderId,
      orderNumber,
      type: data.type || OrderType.DINE_IN,
      status: OrderStatus.PENDING,
      tableId: data.tableId || null,
      userId: null,
      customerName: data.customerName,
      customerPhone: data.customerPhone || null,
      customerEmail: data.customerEmail || null,
      notes: data.notes || null,
      subtotal: Number(subtotal.toFixed(2)),
      tax,
      tip,
      total,
      paymentStatus: PaymentStatus.PAID,
      paymentMethod: data.paymentMethod || "CARD",
      createdAt: new Date(),
      updatedAt: new Date(),
      items: data.items.map((item: any, idx: number) => ({
        id: `oi-${orderId}-${idx}`,
        orderId,
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        customInstructions: item.customInstructions || null,
      })),
    };

    // If dine-in, mark table as occupied
    if (data.tableId) {
      const tbl = store.tables.find((t) => t.id === data.tableId);
      if (tbl) tbl.status = TableStatus.OCCUPIED;
    }

    store.orders.unshift(newOrder);

    const fullOrder = {
      ...newOrder,
      table: store.tables.find((t) => t.id === newOrder.tableId) || null,
      items: newOrder.items.map((item) => ({
        ...item,
        menuItem: store.menuItems.find((m) => m.id === item.menuItemId),
      })),
    };

    // Broadcast live event for KDS & Admin
    try {
      realtimeDispatcher.broadcast("order:created", fullOrder);
    } catch {}

    return fullOrder;
  },

  updateOrderStatus(idOrOrderNumber: string, status: OrderStatus) {
    const order = store.orders.find(
      (o) => o.id === idOrOrderNumber || o.orderNumber.toUpperCase() === idOrOrderNumber.toUpperCase()
    );
    if (!order) return null;

    order.status = status;
    order.updatedAt = new Date();

    // If served or cancelled and table was occupied, check if table can be released
    if (
      (status === OrderStatus.SERVED || status === OrderStatus.CANCELLED) &&
      order.tableId
    ) {
      const remainingActive = store.orders.some(
        (o) =>
          o.tableId === order.tableId &&
          o.id !== order.id &&
          ["PENDING", "PREPARING", "READY"].includes(o.status)
      );
      if (!remainingActive) {
        const tbl = store.tables.find((t) => t.id === order.tableId);
        if (tbl) tbl.status = TableStatus.AVAILABLE;
      }
    }

    const fullOrder = {
      ...order,
      table: store.tables.find((t) => t.id === order.tableId) || null,
      items: order.items.map((item) => ({
        ...item,
        menuItem: store.menuItems.find((m) => m.id === item.menuItemId),
      })),
    };

    try {
      realtimeDispatcher.broadcast("order:updated", fullOrder);
    } catch {}

    return fullOrder;
  },

  // --- Reservations ---
  getReservations(date?: string, status?: string) {
    let list = store.reservations.slice();
    if (date) list = list.filter((r) => r.reservationDate === date);
    if (status) list = list.filter((r) => r.status === status);

    list.sort((a, b) => a.timeSlot.localeCompare(b.timeSlot));

    return list.map((r) => ({
      ...r,
      table: store.tables.find((t) => t.id === r.tableId),
    }));
  },

  createReservation(data: any) {
    // Check double-booking
    const exists = store.reservations.some(
      (r) =>
        r.tableId === data.tableId &&
        r.reservationDate === data.reservationDate &&
        r.timeSlot === data.timeSlot &&
        ["CONFIRMED", "SEATED"].includes(r.status)
    );

    if (exists) {
      throw new Error("This table is already reserved for the selected date and time slot.");
    }

    const newRes: Reservation = {
      id: `res-${Date.now()}`,
      tableId: data.tableId,
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone,
      guestCount: data.guestCount,
      reservationDate: data.reservationDate,
      timeSlot: data.timeSlot,
      status: ReservationStatus.CONFIRMED,
      specialRequests: data.specialRequests || null,
      createdAt: new Date(),
    };

    store.reservations.push(newRes);

    const tbl = store.tables.find((t) => t.id === data.tableId);
    if (tbl) tbl.status = TableStatus.RESERVED;

    const fullRes = {
      ...newRes,
      table: tbl,
    };

    try {
      realtimeDispatcher.broadcast("reservation:created", fullRes);
    } catch {}

    return fullRes;
  },

  updateReservationStatus(id: string, status: ReservationStatus) {
    const res = store.reservations.find((r) => r.id === id);
    if (!res) return null;

    res.status = status;
    const tbl = store.tables.find((t) => t.id === res.tableId);
    if (tbl) {
      if (status === ReservationStatus.SEATED) {
        tbl.status = TableStatus.OCCUPIED;
      } else if (
        status === ReservationStatus.COMPLETED ||
        status === ReservationStatus.CANCELLED
      ) {
        tbl.status = TableStatus.AVAILABLE;
      }
    }

    const fullRes = {
      ...res,
      table: tbl,
    };

    try {
      realtimeDispatcher.broadcast("table:updated", fullRes);
    } catch {}

    return fullRes;
  },

  // --- Analytics ---
  getAnalytics() {
    const orders = store.orders;
    const tables = store.tables;
    const reservations = store.reservations;

    const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0);
    const completedOrders = orders.filter((o) => o.status === OrderStatus.SERVED);
    const activeOrders = orders.filter((o) =>
      ["PENDING", "PREPARING", "READY"].includes(o.status)
    );

    const dishMap: Record<
      string,
      { name: string; count: number; revenue: number; category: string; imageUrl: string }
    > = {};

    for (const order of orders) {
      for (const item of order.items) {
        const dish = store.menuItems.find((m) => m.id === item.menuItemId);
        if (!dish) continue;
        if (!dishMap[item.menuItemId]) {
          dishMap[item.menuItemId] = {
            name: dish.name,
            count: 0,
            revenue: 0,
            category: dish.categoryId,
            imageUrl: dish.imageUrl,
          };
        }
        dishMap[item.menuItemId].count += item.quantity;
        dishMap[item.menuItemId].revenue += item.quantity * item.unitPrice;
      }
    }

    const popularDishes = Object.values(dishMap)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const totalTables = tables.length;
    const occupiedTables = tables.filter((t) => t.status === TableStatus.OCCUPIED).length;
    const reservedTables = tables.filter((t) => t.status === TableStatus.RESERVED).length;
    const availableTables = tables.filter((t) => t.status === TableStatus.AVAILABLE).length;
    const occupancyRate =
      totalTables > 0
        ? Math.round(((occupiedTables + reservedTables) / totalTables) * 100)
        : 0;

    const statusCounts = {
      pending: orders.filter((o) => o.status === OrderStatus.PENDING).length,
      preparing: orders.filter((o) => o.status === OrderStatus.PREPARING).length,
      ready: orders.filter((o) => o.status === OrderStatus.READY).length,
      served: orders.filter((o) => o.status === OrderStatus.SERVED).length,
    };

    return {
      totalRevenue: Number(totalRevenue.toFixed(2)),
      totalOrders: orders.length,
      activeOrdersCount: activeOrders.length,
      completedOrdersCount: completedOrders.length,
      occupancyRate,
      avgPrepMinutes: 16,
      tableStats: {
        total: totalTables,
        occupied: occupiedTables,
        reserved: reservedTables,
        available: availableTables,
      },
      statusCounts,
      popularDishes,
      totalReservations: reservations.length,
    };
  },
};

export default dataStore;
