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
      phone: "+1 (555) 234-5678",
      avatarUrl: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=300&q=80",
    },
  });

  const kitchenUser = await prisma.user.create({
    data: {
      name: "Sous Chef Elena Rostova",
      email: "kitchen@dinedesk.com",
      role: UserRole.KITCHEN_STAFF,
      phone: "+1 (555) 345-6789",
      avatarUrl: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=300&q=80",
    },
  });

  const customerUser = await prisma.user.create({
    data: {
      name: "Sarah Jenkins",
      email: "sarah.j@example.com",
      role: UserRole.CUSTOMER,
      phone: "+1 (555) 987-6543",
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
  const appetizers = await prisma.category.create({
    data: {
      name: "Artisan Appetizers",
      slug: "appetizers",
      description: "Small plates crafted to spark the palate and ignite dining conversations.",
      sortOrder: 1,
    },
  });

  const mains = await prisma.category.create({
    data: {
      name: "Signature Mains",
      slug: "mains",
      description: "Culinary centerpieces grilled over hickory charcoal and simmered in house-made reductions.",
      sortOrder: 2,
    },
  });

  const desserts = await prisma.category.create({
    data: {
      name: "Decadent Desserts",
      slug: "desserts",
      description: "Handcrafted confectionery, velvety mousses, and artisanal pastry finishes.",
      sortOrder: 3,
    },
  });

  const beverages = await prisma.category.create({
    data: {
      name: "Craft Cocktails & Elixirs",
      slug: "beverages",
      description: "Zero-proof botanicals, barrel-aged bitters, and pressed vineyard selections.",
      sortOrder: 4,
    },
  });

  console.log("Seeding Menu Items (18 items)...");
  const dishes = [
    // Appetizers
    {
      categoryId: appetizers.id,
      name: "Truffle Burrata Bruschetta",
      description: "Creamy pugliese burrata, slow-roasted heirloom tomatoes, aged balsamic reduction, white truffle oil, grilled sourdough.",
      price: 16.50,
      imageUrl: "https://images.unsplash.com/photo-1592417817098-8f3d6eb2252a?auto=format&fit=crop&w=800&q=80",
      isVegetarian: true,
      isVegan: false,
      isGlutenFree: false,
      isAvailable: true,
      preparationTime: 12,
      calories: 420,
      allergens: ["Dairy", "Gluten"],
    },
    {
      categoryId: appetizers.id,
      name: "Crispy Calamari Fritti",
      description: "Wild Rhode Island squid lightly dredged in spiced semolina, served with smoked paprika aioli and grilled lemon.",
      price: 18.00,
      imageUrl: "https://images.unsplash.com/photo-1604909052743-94e838986d24?auto=format&fit=crop&w=800&q=80",
      isVegetarian: false,
      isVegan: false,
      isGlutenFree: false,
      isAvailable: true,
      preparationTime: 14,
      calories: 510,
      allergens: ["Molluscs", "Gluten", "Egg"],
    },
    {
      categoryId: appetizers.id,
      name: "Wood-Fired Wild Mushroom Tart",
      description: "Chanterelle and king oyster mushrooms with thyme emulsion, whipped goat cheese, and flaky puff pastry.",
      price: 15.00,
      imageUrl: "https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&w=800&q=80",
      isVegetarian: true,
      isVegan: false,
      isGlutenFree: false,
      isAvailable: true,
      preparationTime: 15,
      calories: 380,
      allergens: ["Dairy", "Gluten"],
    },
    {
      categoryId: appetizers.id,
      name: "Avocado & Yuzu Tartare",
      description: "Hass avocado diced with shallots, cucumber ribbons, toasted sesame crisp, and spicy yuzu vinaigrette.",
      price: 14.50,
      imageUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80",
      isVegetarian: true,
      isVegan: true,
      isGlutenFree: true,
      isAvailable: true,
      preparationTime: 10,
      calories: 290,
      allergens: ["Sesame"],
    },

    // Mains
    {
      categoryId: mains.id,
      name: "Dry-Aged Prime Ribeye (12oz)",
      description: "28-day aged USDA prime ribeye, bone marrow herb butter, roasted shallots, and black garlic demi-glace.",
      price: 44.00,
      imageUrl: "https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=800&q=80",
      isVegetarian: false,
      isVegan: false,
      isGlutenFree: true,
      isAvailable: true,
      preparationTime: 22,
      calories: 890,
      allergens: ["Dairy"],
    },
    {
      categoryId: mains.id,
      name: "Pan-Seared Chilean Sea Bass",
      description: "Sustainably caught sea bass, saffron cauliflower puree, charred asparagus spears, and citrus champagne beurre blanc.",
      price: 39.50,
      imageUrl: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80",
      isVegetarian: false,
      isVegan: false,
      isGlutenFree: true,
      isAvailable: true,
      preparationTime: 18,
      calories: 620,
      allergens: ["Fish", "Dairy"],
    },
    {
      categoryId: mains.id,
      name: "Handmade Pappardelle al Ragu",
      description: "Wide ribbon pasta hand-rolled daily, slow-braised wild boar shoulder, San Marzano tomatoes, and 24-month Parmigiano-Reggiano.",
      price: 27.00,
      imageUrl: "https://images.unsplash.com/photo-1621996346565-e3d5d6281724?auto=format&fit=crop&w=800&q=80",
      isVegetarian: false,
      isVegan: false,
      isGlutenFree: false,
      isAvailable: true,
      preparationTime: 16,
      calories: 740,
      allergens: ["Gluten", "Dairy", "Egg"],
    },
    {
      categoryId: mains.id,
      name: "Truffled Forest Risotto",
      description: "Carnaroli rice slow-stirred with porcini broth, shaved black truffles, mascarpone, and crispy leeks.",
      price: 26.00,
      imageUrl: "https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?auto=format&fit=crop&w=800&q=80",
      isVegetarian: true,
      isVegan: false,
      isGlutenFree: true,
      isAvailable: true,
      preparationTime: 20,
      calories: 590,
      allergens: ["Dairy"],
    },
    {
      categoryId: mains.id,
      name: "Harissa Spiced Cauliflower Steak",
      description: "Thick-cut roasted Romanesco cauliflower, pomegranate molasses, crushed pistachio dukkah, and herb tahini dip.",
      price: 22.00,
      imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
      isVegetarian: true,
      isVegan: true,
      isGlutenFree: true,
      isAvailable: true,
      preparationTime: 16,
      calories: 430,
      allergens: ["Tree Nuts", "Sesame"],
    },
    {
      categoryId: mains.id,
      name: "DineDesk Wagyu Smash Burger",
      description: "Double 4oz American Wagyu patties, smoked gouda, caramelized shallot jam, truffle aioli on toasted brioche with rosemary fries.",
      price: 24.50,
      imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
      isVegetarian: false,
      isVegan: false,
      isGlutenFree: false,
      isAvailable: true,
      preparationTime: 15,
      calories: 920,
      allergens: ["Gluten", "Dairy", "Egg"],
    },

    // Desserts
    {
      categoryId: desserts.id,
      name: "Valrhona Molten Dark Chocolate Fondant",
      description: "70% single-origin French chocolate cake with molten core, salted bourbon caramel, and Madagascar vanilla bean gelato.",
      price: 13.50,
      imageUrl: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80",
      isVegetarian: true,
      isVegan: false,
      isGlutenFree: false,
      isAvailable: true,
      preparationTime: 12,
      calories: 580,
      allergens: ["Dairy", "Gluten", "Egg"],
    },
    {
      categoryId: desserts.id,
      name: "Classic Venetian Tiramisu",
      description: "Espresso-soaked savoiardi ladyfingers, velvety mascarpone sabayon, dark cocoa powder, and dark chocolate shavings.",
      price: 12.00,
      imageUrl: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=800&q=80",
      isVegetarian: true,
      isVegan: false,
      isGlutenFree: false,
      isAvailable: true,
      preparationTime: 8,
      calories: 460,
      allergens: ["Dairy", "Gluten", "Egg"],
    },
    {
      categoryId: desserts.id,
      name: "Pistachio Raspberry Mille-Feuille",
      description: "Caramelized inverted puff pastry, Sicilian bronte pistachio cream, fresh organic raspberries, and rose sugar crystals.",
      price: 14.00,
      imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80",
      isVegetarian: true,
      isVegan: false,
      isGlutenFree: false,
      isAvailable: true,
      preparationTime: 10,
      calories: 490,
      allergens: ["Tree Nuts", "Dairy", "Gluten"],
    },
    {
      categoryId: desserts.id,
      name: "Meyer Lemon Posset & Shortbread",
      description: "Velvety chilled lemon cream, candied kumquats, blackberry coulis, and lavender butter shortbread.",
      price: 11.50,
      imageUrl: "https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=800&q=80",
      isVegetarian: true,
      isVegan: false,
      isGlutenFree: false,
      isAvailable: true,
      preparationTime: 8,
      calories: 390,
      allergens: ["Dairy", "Gluten"],
    },

    // Beverages
    {
      categoryId: beverages.id,
      name: "Smoked Rosemary Old Fashioned",
      description: "Small-batch rye whiskey, demerara syrup, Angostura bitters, flamed organic orange peel, served in a smoking oak cloche.",
      price: 16.00,
      imageUrl: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80",
      isVegetarian: true,
      isVegan: true,
      isGlutenFree: true,
      isAvailable: true,
      preparationTime: 5,
      calories: 190,
      allergens: [],
    },
    {
      categoryId: beverages.id,
      name: "Yuzu Basil Botanical Fizz (Zero-Proof)",
      description: "Fresh Japanese yuzu juice, bruised Thai sweet basil, botanical tonic, agave nectar, and pink peppercorns.",
      price: 9.50,
      imageUrl: "https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&w=800&q=80",
      isVegetarian: true,
      isVegan: true,
      isGlutenFree: true,
      isAvailable: true,
      preparationTime: 4,
      calories: 85,
      allergens: [],
    },
    {
      categoryId: beverages.id,
      name: "Blood Orange Palomita",
      description: "Blanco tequila, cold-pressed Sicilian blood orange, fresh lime juice, pink Himalayan sea salt rim, and club soda.",
      price: 15.00,
      imageUrl: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80",
      isVegetarian: true,
      isVegan: true,
      isGlutenFree: true,
      isAvailable: true,
      preparationTime: 5,
      calories: 175,
      allergens: [],
    },
    {
      categoryId: beverages.id,
      name: "Artisanal Cold Drip Reserve Coffee",
      description: "16-hour slow immersion single-origin Ethiopian Yirgacheffe, notes of bergamot, jasmine, and dark stone fruit.",
      price: 7.00,
      imageUrl: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=800&q=80",
      isVegetarian: true,
      isVegan: true,
      isGlutenFree: true,
      isAvailable: true,
      preparationTime: 3,
      calories: 5,
      allergens: [],
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
  // Order 1: Pending order for Table 2
  const order1 = await prisma.order.create({
    data: {
      orderNumber: "ORD-1001",
      type: OrderType.DINE_IN,
      status: OrderStatus.PENDING,
      tableId: createdTables[1].id, // Table 2
      userId: customerUser.id,
      customerName: "Sarah Jenkins",
      customerPhone: "+1 (555) 987-6543",
      notes: "Extra crispy calamari please. Guest has mild dairy sensitivity.",
      subtotal: 78.50,
      tax: 6.28,
      tip: 15.00,
      total: 99.78,
      paymentStatus: PaymentStatus.PAID,
      paymentMethod: "CARD",
      createdAt: new Date(Date.now() - 4 * 60 * 1000), // 4 mins ago
      items: {
        create: [
          {
            menuItemId: createdMenuItems[1].id, // Calamari
            quantity: 1,
            unitPrice: 18.00,
            customInstructions: "Extra lemon wedges on the side",
          },
          {
            menuItemId: createdMenuItems[4].id, // Ribeye
            quantity: 1,
            unitPrice: 44.00,
            customInstructions: "Cooked medium-rare, no butter glaze",
          },
          {
            menuItemId: createdMenuItems[15].id, // Botanical Fizz
            quantity: 1,
            unitPrice: 9.50,
          },
          {
            menuItemId: createdMenuItems[16].id, // Palomita
            quantity: 1,
            unitPrice: 15.00,
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
      customerPhone: "+1 (555) 432-1098",
      notes: "Gluten free bread substitute requested.",
      subtotal: 66.50,
      tax: 5.32,
      tip: 12.00,
      total: 83.82,
      paymentStatus: PaymentStatus.PAID,
      paymentMethod: "CARD",
      createdAt: new Date(Date.now() - 14 * 60 * 1000), // 14 mins ago (Yellow warning)
      items: {
        create: [
          {
            menuItemId: createdMenuItems[0].id, // Burrata
            quantity: 1,
            unitPrice: 16.50,
            customInstructions: "Gluten-free crackers instead of sourdough",
          },
          {
            menuItemId: createdMenuItems[7].id, // Truffled Risotto
            quantity: 1,
            unitPrice: 26.00,
          },
          {
            menuItemId: createdMenuItems[9].id, // Wagyu Burger
            quantity: 1,
            unitPrice: 24.50,
            customInstructions: "No onions, medium well",
          },
        ],
      },
    },
  });

  // Order 3: Ready order for Takeout
  const order3 = await prisma.order.create({
    data: {
      orderNumber: "ORD-1003",
      type: OrderType.TAKEOUT,
      status: OrderStatus.READY,
      customerName: "David Miller",
      customerPhone: "+1 (555) 765-4321",
      notes: "Customer waiting in pickup lounge area.",
      subtotal: 39.50,
      tax: 3.16,
      tip: 7.00,
      total: 49.66,
      paymentStatus: PaymentStatus.PAID,
      paymentMethod: "UPI",
      createdAt: new Date(Date.now() - 26 * 60 * 1000), // 26 mins ago (Red urgency alert)
      items: {
        create: [
          {
            menuItemId: createdMenuItems[5].id, // Chilean Sea Bass
            quantity: 1,
            unitPrice: 39.50,
            customInstructions: "Sauce packed on the side",
          },
        ],
      },
    },
  });

  // Order 4: Completed order from earlier today
  const order4 = await prisma.order.create({
    data: {
      orderNumber: "ORD-1000",
      type: OrderType.DINE_IN,
      status: OrderStatus.SERVED,
      tableId: createdTables[0].id,
      customerName: "Jessica Lee",
      customerPhone: "+1 (555) 111-2233",
      notes: "Anniversary celebration.",
      subtotal: 104.00,
      tax: 8.32,
      tip: 25.00,
      total: 137.32,
      paymentStatus: PaymentStatus.PAID,
      paymentMethod: "CARD",
      createdAt: new Date(Date.now() - 75 * 60 * 1000), // 75 mins ago
      items: {
        create: [
          {
            menuItemId: createdMenuItems[4].id, // Ribeye
            quantity: 2,
            unitPrice: 44.00,
          },
          {
            menuItemId: createdMenuItems[14].id, // Smoked Old Fashioned
            quantity: 1,
            unitPrice: 16.00,
          },
        ],
      },
    },
  });

  console.log("Seeding Table Reservations...");
  const today = new Date().toISOString().split("T")[0];
  await prisma.reservation.create({
    data: {
      tableId: createdTables[3].id, // Table 4
      customerName: "Dr. Jonathan Hayes",
      customerEmail: "j.hayes@medcenter.org",
      customerPhone: "+1 (555) 678-9012",
      guestCount: 4,
      reservationDate: today,
      timeSlot: "19:30",
      status: ReservationStatus.CONFIRMED,
      specialRequests: "Quiet corner table requested for business dinner.",
    },
  });

  await prisma.reservation.create({
    data: {
      tableId: createdTables[7].id, // Table 8 (VIP Booth)
      customerName: "Sophia Lorenzi",
      customerEmail: "sophia.lorenzi@luxury.io",
      customerPhone: "+1 (555) 789-0123",
      guestCount: 6,
      reservationDate: today,
      timeSlot: "20:00",
      status: ReservationStatus.CONFIRMED,
      specialRequests: "Champagne chilling upon arrival.",
    },
  });

  console.log("Database seeded successfully with authentic DineDesk restaurant data!");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
