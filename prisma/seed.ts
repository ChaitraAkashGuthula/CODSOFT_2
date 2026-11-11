import { PrismaClient, UserRole, OrderStatus, OrderType, TableStatus, ReservationStatus, PaymentStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Cleaning existing database records...");
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.reservation.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.category.deleteMany();
  await prisma.table.deleteMany();
  await prisma.user.deleteMany();

  console.log("Seeding Users...");
  const adminUser = await prisma.user.create({
    data: {
      name: "Chef Marco Rossi",
      email: "admin@dinedesk.com",
      role: UserRole.ADMIN,
      phone: "+91 98765 43210",
      avatarUrl: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=300&q=80",
    },
  });

  const kitchenUser = await prisma.user.create({
    data: {
      name: "Master Chef Rajesh Kumar",
      email: "kitchen@dinedesk.com",
      role: UserRole.KITCHEN_STAFF,
      phone: "+91 98765 43211",
      avatarUrl: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=300&q=80",
    },
  });

  const customerUser = await prisma.user.create({
    data: {
      name: "Sarah Jenkins",
      email: "sarah.j@example.com",
      role: UserRole.CUSTOMER,
      phone: "+91 98765 43212",
      avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80",
    },
  });

  console.log("Seeding Tables...");
  const tablesData = [
    { tableNumber: 1, capacity: 2, location: "Window Bay", status: TableStatus.AVAILABLE },
    { tableNumber: 2, capacity: 2, location: "Window Bay", status: TableStatus.OCCUPIED },
    { tableNumber: 3, capacity: 4, location: "Main Dining", status: TableStatus.AVAILABLE },
    { tableNumber: 4, capacity: 4, location: "Main Dining", status: TableStatus.RESERVED },
    { tableNumber: 5, capacity: 6, location: "Main Dining", status: TableStatus.AVAILABLE },
    { tableNumber: 6, capacity: 4, location: "Patio Garden", status: TableStatus.AVAILABLE },
    { tableNumber: 7, capacity: 8, location: "Patio Garden", status: TableStatus.AVAILABLE },
    { tableNumber: 8, capacity: 6, location: "VIP Booth", status: TableStatus.AVAILABLE },
  ];

  const createdTables = [];
  for (const t of tablesData) {
    const table = await prisma.table.create({
      data: {
        tableNumber: t.tableNumber,
        capacity: t.capacity,
        location: t.location,
        status: t.status,
        qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https://dinedesk.restaurant/table/${t.tableNumber}`,
      },
    });
    createdTables.push(table);
  }

  console.log("Seeding Categories...");
  const biryaniCategory = await prisma.category.create({
    data: {
      name: "Biryani & Rice Specials",
      slug: "biryani-rice",
      description: "Royal slow-cooked dum biryanis, aromatic saffron basmati, and fragrant claypot rice specials.",
      sortOrder: 1,
    },
  });

  const pizzaBurgerCategory = await prisma.category.create({
    data: {
      name: "Handcrafted Pizzas & Burgers",
      slug: "pizzas-burgers",
      description: "Artisanal hand-stretched sourdough crusts, gourmet smash patties, and melt-in-mouth brioche buns.",
      sortOrder: 2,
    },
  });

  const parathaStarterCategory = await prisma.category.create({
    data: {
      name: "Parathas & Tandoori Starters",
      slug: "parathas-starters",
      description: "Charred clay oven kebabs, tandoori tikkas, and golden-crisp stuffed Amritsari flatbreads.",
      sortOrder: 3,
    },
  });

  const shawarmaCategory = await prisma.category.create({
    data: {
      name: "Shawarmas & Wraps",
      slug: "shawarmas-wraps",
      description: "Authentic Lebanese spiced meats, slow-roasted rotisserie, garlic toum, and warm toasted pita rolls.",
      sortOrder: 4,
    },
  });

  const dessertCategory = await prisma.category.create({
    data: {
      name: "Thick Milkshakes & Desserts",
      slug: "shakes-desserts",
      description: "Indulgent artisan thickshakes, chilled fruit pulps, decadent gulab jamuns, and classic baked cheesecakes.",
      sortOrder: 5,
    },
  });

  console.log("Seeding Real-World Dish Catalog...");
  const dishes = [
    // 1. Biryani & Rice Specials
    {
      categoryId: biryaniCategory.id,
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
    },
    {
      categoryId: biryaniCategory.id,
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
    },
    {
      categoryId: biryaniCategory.id,
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
    },

    // 2. Handcrafted Pizzas & Burgers
    {
      categoryId: pizzaBurgerCategory.id,
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
    },
    {
      categoryId: pizzaBurgerCategory.id,
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
    },
    {
      categoryId: pizzaBurgerCategory.id,
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
    },
    {
      categoryId: pizzaBurgerCategory.id,
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
    },

    // 3. Parathas & Tandoori Starters
    {
      categoryId: parathaStarterCategory.id,
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
    },
    {
      categoryId: parathaStarterCategory.id,
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
    },
    {
      categoryId: parathaStarterCategory.id,
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
    },

    // 4. Shawarmas & Wraps
    {
      categoryId: shawarmaCategory.id,
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
    },
    {
      categoryId: shawarmaCategory.id,
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
    },

    // 5. Thick Milkshakes & Desserts
    {
      categoryId: dessertCategory.id,
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
    },
    {
      categoryId: dessertCategory.id,
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
    },
    {
      categoryId: dessertCategory.id,
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
    },
    {
      categoryId: dessertCategory.id,
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
    },
  ];

  const createdMenuItems = [];
  for (const dish of dishes) {
    const item = await prisma.menuItem.create({
      data: dish,
    });
    createdMenuItems.push(item);
  }

  console.log("Seeding Mock Orders for Kitchen & Live Tracking...");
  // Order 1: Pending order for Table 2 (Sarah Jenkins)
  const order1 = await prisma.order.create({
    data: {
      orderNumber: "ORD-1001",
      type: OrderType.DINE_IN,
      status: OrderStatus.PENDING,
      tableId: createdTables[1].id, // Table 2
      userId: customerUser.id,
      customerName: "Sarah Jenkins",
      customerPhone: "+91 98765 43212",
      notes: "Please make the biryani mild spicy. Extra raita on the side.",
      subtotal: 727,
      tax: 36.35,
      tip: 50.00,
      total: 813.35,
      paymentStatus: PaymentStatus.PAID,
      paymentMethod: "UPI",
      createdAt: new Date(Date.now() - 4 * 60 * 1000), // 4 mins ago
      items: {
        create: [
          {
            menuItemId: createdMenuItems[0].id, // Hyderabadi Chicken Dum Biryani (349)
            quantity: 1,
            unitPrice: 349,
            customInstructions: "Mild spicy with extra salan and raita",
          },
          {
            menuItemId: createdMenuItems[7].id, // Amritsari Aloo Paratha (179)
            quantity: 1,
            unitPrice: 179,
            customInstructions: "Extra white butter please",
          },
          {
            menuItemId: createdMenuItems[12].id, // Belgian Chocolate Shake (199)
            quantity: 1,
            unitPrice: 199,
          },
        ],
      },
    },
  });

  // Order 2: Preparing order for Table 3
  const order2 = await prisma.order.create({
    data: {
      orderNumber: "ORD-1002",
      type: OrderType.DINE_IN,
      status: OrderStatus.PREPARING,
      tableId: createdTables[2].id, // Table 3
      customerName: "Michael Chang",
      customerPhone: "+91 98765 43213",
      notes: "Extra jalapeños on pizza.",
      subtotal: 628,
      tax: 31.40,
      tip: 40.00,
      total: 699.40,
      paymentStatus: PaymentStatus.PAID,
      paymentMethod: "CARD",
      createdAt: new Date(Date.now() - 14 * 60 * 1000), // 14 mins ago
      items: {
        create: [
          {
            menuItemId: createdMenuItems[3].id, // Farmhouse Pizza (399)
            quantity: 1,
            unitPrice: 399,
            customInstructions: "Thin crust crisp bake with extra oregano",
          },
          {
            menuItemId: createdMenuItems[6].id, // Spicy Paneer Burger (229)
            quantity: 1,
            unitPrice: 229,
            customInstructions: "Extra sriracha sauce",
          },
        ],
      },
    },
  });

  // Order 3: Ready to Serve for Takeaway
  const order3 = await prisma.order.create({
    data: {
      orderNumber: "ORD-1003",
      type: OrderType.TAKEOUT,
      status: OrderStatus.READY,
      customerName: "David Miller",
      customerPhone: "+91 98765 43214",
      notes: "Customer waiting in pickup lounge area. Pack mint chutney containers.",
      subtotal: 778,
      tax: 38.90,
      tip: 30.00,
      total: 846.90,
      paymentStatus: PaymentStatus.PAID,
      paymentMethod: "UPI",
      createdAt: new Date(Date.now() - 25 * 60 * 1000), // 25 mins ago
      items: {
        create: [
          {
            menuItemId: createdMenuItems[2].id, // Mutton Ghee Roast Biryani (449)
            quantity: 1,
            unitPrice: 449,
            customInstructions: "Packed tightly for travel",
          },
          {
            menuItemId: createdMenuItems[8].id, // Chicken Tikka Skewers (329)
            quantity: 1,
            unitPrice: 329,
            customInstructions: "Include extra sliced onions and lemon wedges",
          },
        ],
      },
    },
  });

  // Order 4: Served / Completed Dine-In
  const order4 = await prisma.order.create({
    data: {
      orderNumber: "ORD-1004",
      type: OrderType.DINE_IN,
      status: OrderStatus.SERVED,
      tableId: createdTables[4].id, // Table 5
      customerName: "Priya Sharma",
      customerPhone: "+91 98765 43215",
      subtotal: 647,
      tax: 32.35,
      tip: 50.00,
      total: 729.35,
      paymentStatus: PaymentStatus.PAID,
      paymentMethod: "CARD",
      createdAt: new Date(Date.now() - 55 * 60 * 1000), // 55 mins ago
      items: {
        create: [
          {
            menuItemId: createdMenuItems[1].id, // Paneer Tikka Dum Biryani (299)
            quantity: 1,
            unitPrice: 299,
          },
          {
            menuItemId: createdMenuItems[14].id, // Warm Gulab Jamun with Rabdi (149)
            quantity: 1,
            unitPrice: 149,
          },
          {
            menuItemId: createdMenuItems[12].id, // Belgian Chocolate Shake (199)
            quantity: 1,
            unitPrice: 199,
          },
        ],
      },
    },
  });

  // Order 5: Preparing Delivery Order
  const order5 = await prisma.order.create({
    data: {
      orderNumber: "ORD-1005",
      type: OrderType.DELIVERY,
      status: OrderStatus.PREPARING,
      customerName: "Alex Turner",
      customerPhone: "+91 98765 43216",
      notes: "Delivery Partner arriving in 10 mins. Keep bag sealed.",
      subtotal: 927,
      tax: 46.35,
      tip: 60.00,
      total: 1033.35,
      paymentStatus: PaymentStatus.PAID,
      paymentMethod: "UPI",
      createdAt: new Date(Date.now() - 10 * 60 * 1000),
      items: {
        create: [
          {
            menuItemId: createdMenuItems[4].id, // Smoky BBQ Chicken Pizza (449)
            quantity: 1,
            unitPrice: 449,
          },
          {
            menuItemId: createdMenuItems[5].id, // Crispy Double Patty Smash Burger (289)
            quantity: 1,
            unitPrice: 289,
          },
          {
            menuItemId: createdMenuItems[13].id, // Mango Alphonso Cream Shake (189)
            quantity: 1,
            unitPrice: 189,
          },
        ],
      },
    },
  });

  console.log("Seeding Table Reservations...");
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dateStr = tomorrow.toISOString().split("T")[0];

  await prisma.reservation.create({
    data: {
      tableId: createdTables[3].id, // Table 4
      customerName: "Ananya Deshmukh",
      customerEmail: "ananya.d@example.com",
      customerPhone: "+91 98765 43217",
      guestCount: 4,
      reservationDate: dateStr,
      timeSlot: "19:30",
      status: ReservationStatus.CONFIRMED,
      specialRequests: "Anniversary celebration. Window table preferred.",
    },
  });

  await prisma.reservation.create({
    data: {
      tableId: createdTables[7].id, // Table 8 (VIP Booth)
      customerName: "Vikram Malhotra",
      customerEmail: "vikram.m@example.com",
      customerPhone: "+91 98765 43218",
      guestCount: 6,
      reservationDate: dateStr,
      timeSlot: "20:30",
      status: ReservationStatus.CONFIRMED,
      specialRequests: "Corporate dinner. Chef tasting menu requested.",
    },
  });

  console.log("✅ Seed completed successfully! Real-world dishes, pizzas, biryanis, burgers, and milkshakes populated.");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
