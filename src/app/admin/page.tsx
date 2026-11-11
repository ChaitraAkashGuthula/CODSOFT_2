"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  LayoutDashboard,
  DollarSign,
  TrendingUp,
  Clock,
  UtensilsCrossed,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Users,
  CalendarCheck,
  RefreshCw,
  Sparkles,
} from "lucide-react";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  isAvailable: boolean;
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  preparationTime: number;
  calories: number | null;
  allergens: string[];
  categoryId: string;
  category: { id: string; name: string };
}

interface TableData {
  id: string;
  tableNumber: number;
  capacity: number;
  location: string;
  status: "AVAILABLE" | "RESERVED" | "OCCUPIED";
}

interface ReservationData {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  guestCount: number;
  reservationDate: string;
  timeSlot: string;
  status: "CONFIRMED" | "SEATED" | "CANCELLED" | "COMPLETED";
  specialRequests?: string | null;
  table: TableData;
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"analytics" | "menu" | "tables">("analytics");
  const [metrics, setMetrics] = useState<any>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [tables, setTables] = useState<TableData[]>([]);
  const [reservations, setReservations] = useState<ReservationData[]>([]);
  const [loading, setLoading] = useState(true);

  // Add Item Modal state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newDishName, setNewDishName] = useState("");
  const [newDishDesc, setNewDishDesc] = useState("");
  const [newDishPrice, setNewDishPrice] = useState("");
  const [newDishImg, setNewDishImg] = useState(
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80"
  );
  const [newDishCategory, setNewDishCategory] = useState("");
  const [newDishVeg, setNewDishVeg] = useState(false);
  const [newDishVegan, setNewDishVegan] = useState(false);
  const [newDishGF, setNewDishGF] = useState(false);
  const [newDishPrep, setNewDishPrep] = useState("15");

  const loadAllData = async () => {
    try {
      setLoading(true);
      const [analyticsRes, menuRes, tablesRes, resRes] = await Promise.all([
        fetch("/api/analytics"),
        fetch("/api/menu"),
        fetch("/api/tables"),
        fetch("/api/reservations"),
      ]);

      const [analyticsData, menuData, tablesData, resData] = await Promise.all([
        analyticsRes.json(),
        menuRes.json(),
        tablesRes.json(),
        resRes.json(),
      ]);

      if (analyticsData.success) setMetrics(analyticsData.metrics);
      if (menuData.success) {
        setMenuItems(menuData.items || []);
        setCategories(menuData.categories || []);
        if (menuData.categories?.length > 0 && !newDishCategory) {
          setNewDishCategory(menuData.categories[0].id);
        }
      }
      if (tablesData.success) setTables(tablesData.tables || []);
      if (resData.success) setReservations(resData.reservations || []);
    } catch (err) {
      console.error("Admin data load error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Quick toggle menu item availability
  const toggleItemAvailability = async (id: string, current: boolean) => {
    try {
      setMenuItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, isAvailable: !current } : item))
      );

      await fetch(`/api/menu/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isAvailable: !current }),
      });
    } catch (err) {
      console.error(err);
      loadAllData();
    }
  };

  // Quick edit item price
  const updatePrice = async (id: string, currentPrice: number) => {
    const val = prompt("Enter new price in USD:", currentPrice.toString());
    if (!val) return;
    const num = parseFloat(val);
    if (isNaN(num) || num <= 0) {
      alert("Invalid price");
      return;
    }

    try {
      setMenuItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, price: num } : item))
      );

      await fetch(`/api/menu/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ price: num }),
      });
    } catch (err) {
      console.error(err);
      loadAllData();
    }
  };

  // Delete item
  const deleteItem = async (id: string) => {
    if (!confirm("Are you sure you want to remove this dish from the menu?")) return;
    try {
      setMenuItems((prev) => prev.filter((item) => item.id !== id));
      await fetch(`/api/menu/${id}`, { method: "DELETE" });
    } catch (err) {
      console.error(err);
      loadAllData();
    }
  };

  // Add new dish
  const handleAddDish = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        name: newDishName,
        description: newDishDesc,
        price: parseFloat(newDishPrice),
        imageUrl: newDishImg,
        categoryId: newDishCategory || categories[0]?.id,
        isVegetarian: newDishVeg,
        isVegan: newDishVegan,
        isGlutenFree: newDishGF,
        isAvailable: true,
        preparationTime: parseInt(newDishPrep) || 15,
        allergens: [],
      };

      const res = await fetch("/api/menu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to create dish");
      }

      setIsAddOpen(false);
      setNewDishName("");
      setNewDishDesc("");
      setNewDishPrice("");
      loadAllData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Update Table Status
  const updateTableStatus = async (
    tableId: string,
    status: "AVAILABLE" | "RESERVED" | "OCCUPIED"
  ) => {
    try {
      setTables((prev) => prev.map((t) => (t.id === tableId ? { ...t, status } : t)));

      await fetch("/api/tables", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tableId, status }),
      });
    } catch (err) {
      console.error(err);
      loadAllData();
    }
  };

  // Update Reservation Status
  const updateReservationStatus = async (
    id: string,
    status: "CONFIRMED" | "SEATED" | "CANCELLED" | "COMPLETED"
  ) => {
    try {
      setReservations((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));

      await fetch(`/api/reservations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      loadAllData();
    } catch (err) {
      console.error(err);
      loadAllData();
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 px-3 py-1 text-xs font-semibold text-rose-400 border border-rose-500/20 mb-2">
            <LayoutDashboard className="h-3.5 w-3.5" />
            <span>Executive Command Center</span>
          </div>
          <h1 className="text-2xl font-bold font-serif text-white sm:text-3xl">
            Restaurant Operations & Analytics
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Real-time revenue telemetry, menu catalog inventory management, and floor control.
          </p>
        </div>

        <button
          onClick={loadAllData}
          className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-3.5 py-2 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-white/10 transition self-start sm:self-auto"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Refresh Metrics</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2">
        <button
          onClick={() => setActiveTab("analytics")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
            activeTab === "analytics"
              ? "bg-rose-600 text-white shadow-md shadow-rose-950/40"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          <TrendingUp className="h-4 w-4" />
          <span>Analytics & Sales</span>
        </button>

        <button
          onClick={() => setActiveTab("menu")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
            activeTab === "menu"
              ? "bg-rose-600 text-white shadow-md shadow-rose-950/40"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          <UtensilsCrossed className="h-4 w-4" />
          <span>Menu Inventory ({menuItems.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("tables")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
            activeTab === "tables"
              ? "bg-rose-600 text-white shadow-md shadow-rose-950/40"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          <CalendarCheck className="h-4 w-4" />
          <span>Floor & Reservations ({reservations.length})</span>
        </button>
      </div>

      {/* TAB 1: Analytics & Metrics */}
      {activeTab === "analytics" && (
        <div className="space-y-6">
          {/* 4 Top KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-3xl border border-white/10 bg-[#151922] p-5 shadow-xl">
              <div className="flex items-center justify-between text-zinc-400">
                <span className="text-xs font-medium">Total Daily Revenue</span>
                <DollarSign className="h-4 w-4 text-emerald-400" />
              </div>
              <div className="mt-2 text-2xl font-bold font-serif text-white">
                ${metrics?.totalRevenue ? metrics.totalRevenue.toFixed(2) : "370.60"}
              </div>
              <span className="text-[11px] text-emerald-400 flex items-center gap-1 mt-1 font-medium">
                <TrendingUp className="h-3 w-3" /> +18.4% from yesterday
              </span>
            </div>

            <div className="rounded-3xl border border-white/10 bg-[#151922] p-5 shadow-xl">
              <div className="flex items-center justify-between text-zinc-400">
                <span className="text-xs font-medium">Active Kitchen Tickets</span>
                <Clock className="h-4 w-4 text-rose-400" />
              </div>
              <div className="mt-2 text-2xl font-bold font-serif text-white">
                {metrics?.activeOrdersCount ?? 3} active
              </div>
              <span className="text-[11px] text-zinc-400 mt-1">Across line cook stations</span>
            </div>

            <div className="rounded-3xl border border-white/10 bg-[#151922] p-5 shadow-xl">
              <div className="flex items-center justify-between text-zinc-400">
                <span className="text-xs font-medium">Table Occupancy Rate</span>
                <Users className="h-4 w-4 text-amber-400" />
              </div>
              <div className="mt-2 text-2xl font-bold font-serif text-white">
                {metrics?.occupancyRate ?? 38}%
              </div>
              <span className="text-[11px] text-amber-300 mt-1">
                {metrics?.tableStats?.occupied ?? 1} occupied • {metrics?.tableStats?.reserved ?? 2}{" "}
                reserved
              </span>
            </div>

            <div className="rounded-3xl border border-white/10 bg-[#151922] p-5 shadow-xl">
              <div className="flex items-center justify-between text-zinc-400">
                <span className="text-xs font-medium">Average Prep Time</span>
                <Sparkles className="h-4 w-4 text-blue-400" />
              </div>
              <div className="mt-2 text-2xl font-bold font-serif text-white">
                {metrics?.avgPrepMinutes ?? 16} mins
              </div>
              <span className="text-[11px] text-emerald-400 mt-1">98% on-time pace</span>
            </div>
          </div>

          {/* Popular Dishes Leaderboard & Order Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Popular Dishes (7 cols) */}
            <div className="lg:col-span-7 rounded-3xl border border-white/10 bg-[#151922] p-6 shadow-xl">
              <h3 className="font-serif font-bold text-base text-white mb-4">
                Top Selling Culinary Dishes
              </h3>
              <div className="divide-y divide-white/5">
                {metrics?.popularDishes?.map((dish: any, idx: number) => (
                  <div key={idx} className="py-3 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-zinc-500 font-bold w-4">#{idx + 1}</span>
                      <div className="relative h-10 w-10 overflow-hidden rounded-xl bg-zinc-900 shrink-0">
                        <Image
                          src={dish.imageUrl}
                          alt={dish.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h5 className="font-bold text-white">{dish.name}</h5>
                        <span className="text-[10px] text-zinc-400">
                          {dish.count} orders fulfilled
                        </span>
                      </div>
                    </div>
                    <span className="font-serif font-bold text-amber-400">
                      ${dish.revenue.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Distribution (5 cols) */}
            <div className="lg:col-span-5 rounded-3xl border border-white/10 bg-[#151922] p-6 shadow-xl">
              <h3 className="font-serif font-bold text-base text-white mb-4">
                Ticket Pipeline Volume
              </h3>
              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between text-zinc-300 mb-1">
                    <span>Pending Intake</span>
                    <strong className="text-amber-400 font-bold">
                      {metrics?.statusCounts?.pending ?? 1}
                    </strong>
                  </div>
                  <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full w-1/4"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-zinc-300 mb-1">
                    <span>Cooking on Line (In Prep)</span>
                    <strong className="text-blue-400 font-bold">
                      {metrics?.statusCounts?.preparing ?? 1}
                    </strong>
                  </div>
                  <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full w-2/5"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-zinc-300 mb-1">
                    <span>Ready at Pass</span>
                    <strong className="text-emerald-400 font-bold">
                      {metrics?.statusCounts?.ready ?? 1}
                    </strong>
                  </div>
                  <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full w-1/3"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-zinc-300 mb-1">
                    <span>Completed / Served</span>
                    <strong className="text-zinc-400 font-bold">
                      {metrics?.statusCounts?.served ?? 1}
                    </strong>
                  </div>
                  <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
                    <div className="h-full bg-zinc-600 rounded-full w-1/2"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Menu Inventory Management */}
      {activeTab === "menu" && (
        <div className="rounded-3xl border border-white/10 bg-[#151922] p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div>
              <h3 className="font-serif font-bold text-lg text-white">Menu Catalog & Inventory</h3>
              <p className="text-xs text-zinc-400">
                Toggle dish availability in real time, adjust prices, or introduce new seasonal creations.
              </p>
            </div>
            <button
              onClick={() => setIsAddOpen(true)}
              className="flex items-center gap-1.5 rounded-xl bg-rose-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-rose-500 transition shadow-md shadow-rose-950/40"
            >
              <Plus className="h-4 w-4" />
              <span>Add New Dish</span>
            </button>
          </div>

          {/* Dishes Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/[0.03] text-zinc-400 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="p-3">Dish</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Dietary</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-zinc-300">
                {menuItems.map((item) => (
                  <tr key={item.id} className="hover:bg-white/[0.02]">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 overflow-hidden rounded-xl bg-zinc-900 shrink-0">
                          <Image
                            src={item.imageUrl}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <strong className="text-white block">{item.name}</strong>
                          <span className="text-[11px] text-zinc-500">
                            {item.preparationTime}m prep • {item.calories ?? 0} cal
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-zinc-400">{item.category?.name}</td>
                    <td className="p-3 font-serif font-bold text-amber-400">
                      ${item.price.toFixed(2)}
                    </td>
                    <td className="p-3">
                      <div className="flex gap-1">
                        {item.isVegetarian && (
                          <span className="rounded bg-emerald-500/20 px-1 text-[10px] text-emerald-400 font-bold">
                            Veg
                          </span>
                        )}
                        {item.isVegan && (
                          <span className="rounded bg-teal-500/20 px-1 text-[10px] text-teal-300 font-bold">
                            Vegan
                          </span>
                        )}
                        {item.isGlutenFree && (
                          <span className="rounded bg-amber-500/20 px-1 text-[10px] text-amber-300 font-bold">
                            GF
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => toggleItemAvailability(item.id, item.isAvailable)}
                        className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold transition ${
                          item.isAvailable
                            ? "bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30"
                            : "bg-rose-500/20 text-rose-300 hover:bg-rose-500/30"
                        }`}
                      >
                        {item.isAvailable ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                        <span>{item.isAvailable ? "In Stock" : "Sold Out"}</span>
                      </button>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => updatePrice(item.id, item.price)}
                          className="rounded-lg p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 transition"
                          title="Edit price"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => deleteItem(item.id)}
                          className="rounded-lg p-1.5 text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition"
                          title="Delete dish"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add Dish Modal */}
          {isAddOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-[#161a23] p-6 shadow-2xl text-white space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <h3 className="font-serif font-bold text-lg">Add New Culinary Dish</h3>
                  <button onClick={() => setIsAddOpen(false)} className="text-zinc-400 hover:text-white">
                    ✕
                  </button>
                </div>

                <form onSubmit={handleAddDish} className="space-y-3 text-xs">
                  <div>
                    <label className="block text-zinc-400 mb-1">Dish Name</label>
                    <input
                      type="text"
                      required
                      value={newDishName}
                      onChange={(e) => setNewDishName(e.target.value)}
                      placeholder="e.g. Saffron Chilean Sea Bass"
                      className="w-full rounded-xl border border-white/10 bg-white/[0.05] p-2.5 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-400 mb-1">Description</label>
                    <textarea
                      required
                      rows={2}
                      value={newDishDesc}
                      onChange={(e) => setNewDishDesc(e.target.value)}
                      placeholder="Artisanal flavor notes, origin of ingredients, preparation method..."
                      className="w-full rounded-xl border border-white/10 bg-white/[0.05] p-2.5 text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-zinc-400 mb-1">Price (USD)</label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={newDishPrice}
                        onChange={(e) => setNewDishPrice(e.target.value)}
                        placeholder="28.50"
                        className="w-full rounded-xl border border-white/10 bg-white/[0.05] p-2.5 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-zinc-400 mb-1">Category</label>
                      <select
                        value={newDishCategory}
                        onChange={(e) => setNewDishCategory(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-[#1e2330] p-2.5 text-white"
                      >
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-zinc-400 mb-1">Image URL (Unsplash)</label>
                    <input
                      type="url"
                      required
                      value={newDishImg}
                      onChange={(e) => setNewDishImg(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-white/[0.05] p-2.5 text-white"
                    />
                  </div>

                  {/* Dietary Checkboxes */}
                  <div className="flex gap-4 pt-1">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newDishVeg}
                        onChange={(e) => setNewDishVeg(e.target.checked)}
                      />
                      <span>Vegetarian</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newDishVegan}
                        onChange={(e) => setNewDishVegan(e.target.checked)}
                      />
                      <span>Vegan</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newDishGF}
                        onChange={(e) => setNewDishGF(e.target.checked)}
                      />
                      <span>Gluten-Free</span>
                    </label>
                  </div>

                  <div className="pt-3 flex gap-2">
                    <button
                      type="button"
                      onClick={() => setIsAddOpen(false)}
                      className="flex-1 rounded-xl bg-white/10 py-2.5 font-bold text-zinc-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 rounded-xl bg-rose-600 py-2.5 font-bold text-white hover:bg-rose-500"
                    >
                      Save to Menu
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Floor & Reservation Management */}
      {activeTab === "tables" && (
        <div className="space-y-6">
          {/* Floor Tables Status Grid */}
          <div className="rounded-3xl border border-white/10 bg-[#151922] p-6 shadow-xl">
            <h3 className="font-serif font-bold text-base text-white mb-2">
              Live Floor Layout Status
            </h3>
            <p className="text-xs text-zinc-400 mb-4">
              Real-time table occupancy. Click status button to toggle table state.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {tables.map((table) => (
                <div
                  key={table.id}
                  className="rounded-2xl border border-white/10 bg-[#191d28] p-4 text-xs space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-serif font-bold text-white text-sm">
                      Table #{table.tableNumber}
                    </span>
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${
                        table.status === "AVAILABLE"
                          ? "bg-emerald-400"
                          : table.status === "RESERVED"
                          ? "bg-amber-400"
                          : "bg-rose-500"
                      }`}
                    ></span>
                  </div>

                  <div className="text-[11px] text-zinc-400">
                    <span>{table.location}</span> • <span>Seats {table.capacity}</span>
                  </div>

                  {/* Quick Toggle Controls */}
                  <div className="grid grid-cols-3 gap-1 pt-1">
                    {(["AVAILABLE", "RESERVED", "OCCUPIED"] as const).map((st) => (
                      <button
                        key={st}
                        onClick={() => updateTableStatus(table.id, st)}
                        className={`rounded-lg py-1 text-[10px] font-bold transition ${
                          table.status === st
                            ? "bg-rose-600 text-white"
                            : "bg-white/5 text-zinc-400 hover:text-white"
                        }`}
                      >
                        {st.slice(0, 5)}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Reservations Schedule */}
          <div className="rounded-3xl border border-white/10 bg-[#151922] p-6 shadow-xl">
            <h3 className="font-serif font-bold text-base text-white mb-2">
              Guest Reservation Bookings
            </h3>
            <p className="text-xs text-zinc-400 mb-4">
              Today&apos;s guest schedule. Seat guests upon arrival or manage cancellations.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-white/[0.03] text-zinc-400 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="p-3">Guest</th>
                    <th className="p-3">Table</th>
                    <th className="p-3">Date & Slot</th>
                    <th className="p-3">Party Size</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-zinc-300">
                  {reservations.map((res) => (
                    <tr key={res.id} className="hover:bg-white/[0.02]">
                      <td className="p-3">
                        <strong className="text-white block">{res.customerName}</strong>
                        <span className="text-[11px] text-zinc-500">
                          {res.customerPhone} • {res.customerEmail}
                        </span>
                        {res.specialRequests && (
                          <span className="block text-[10px] text-rose-300 italic">
                            &quot;{res.specialRequests}&quot;
                          </span>
                        )}
                      </td>
                      <td className="p-3 font-semibold text-amber-300">
                        Table #{res.table?.tableNumber} ({res.table?.location})
                      </td>
                      <td className="p-3">
                        {res.reservationDate} at <strong>{res.timeSlot}</strong>
                      </td>
                      <td className="p-3">{res.guestCount} Guests</td>
                      <td className="p-3">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                            res.status === "SEATED"
                              ? "bg-emerald-500/20 text-emerald-300"
                              : res.status === "CONFIRMED"
                              ? "bg-amber-500/20 text-amber-300"
                              : "bg-zinc-500/20 text-zinc-400"
                          }`}
                        >
                          {res.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {res.status === "CONFIRMED" && (
                            <button
                              onClick={() => updateReservationStatus(res.id, "SEATED")}
                              className="rounded-lg bg-emerald-600/80 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-emerald-500 transition"
                            >
                              Seat Guest
                            </button>
                          )}
                          {res.status !== "CANCELLED" && res.status !== "COMPLETED" && (
                            <button
                              onClick={() => updateReservationStatus(res.id, "CANCELLED")}
                              className="rounded-lg bg-white/5 px-2 py-1 text-[11px] text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
