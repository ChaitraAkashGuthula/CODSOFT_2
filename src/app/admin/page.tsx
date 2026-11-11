"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import {
  SlidersHorizontal,
  DollarSign,
  TrendingUp,
  Clock,
  Utensils,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Users,
  CalendarCheck,
  RefreshCw,
  MapPin,
  CheckCircle2,
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

  // Add Item Modal
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

  const updatePrice = async (id: string, currentPrice: number) => {
    const val = prompt("Enter new price in USD:", currentPrice.toString());
    if (!val) return;
    const num = parseFloat(val);
    if (isNaN(num) || num <= 0) {
      alert("Invalid price format");
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

  const deleteItem = async (id: string) => {
    if (!confirm("Are you sure you want to remove this dish?")) return;
    try {
      setMenuItems((prev) => prev.filter((item) => item.id !== id));
      await fetch(`/api/menu/${id}`, { method: "DELETE" });
    } catch (err) {
      console.error(err);
      loadAllData();
    }
  };

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
        throw new Error(data.error || "Failed to add dish");
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
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E8E8]">
        <div>
          <span className="text-xs font-bold text-[#E23744] uppercase tracking-wider">
            Restaurant Operations
          </span>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#1C1C1C] mt-0.5">
            Admin & Inventory Dashboard
          </h1>
          <p className="text-xs text-[#686B78] mt-1">
            Real-time revenue metrics, menu catalog stock controls, and floor table management.
          </p>
        </div>

        <button
          onClick={loadAllData}
          className="flex items-center gap-2 rounded-xl border border-[#E8E8E8] bg-[#FFFFFF] px-4 py-2 text-xs font-bold text-[#1C1C1C] hover:bg-[#F8F9FA] transition"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E8E8E8] pb-2">
        <button
          onClick={() => setActiveTab("analytics")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition ${
            activeTab === "analytics"
              ? "bg-[#E23744] text-white shadow-sm"
              : "text-[#686B78] hover:bg-[#F8F9FA]"
          }`}
        >
          <TrendingUp className="h-4 w-4" />
          <span>Analytics & Sales</span>
        </button>

        <button
          onClick={() => setActiveTab("menu")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition ${
            activeTab === "menu"
              ? "bg-[#E23744] text-white shadow-sm"
              : "text-[#686B78] hover:bg-[#F8F9FA]"
          }`}
        >
          <Utensils className="h-4 w-4" />
          <span>Menu Inventory ({menuItems.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("tables")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition ${
            activeTab === "tables"
              ? "bg-[#E23744] text-white shadow-sm"
              : "text-[#686B78] hover:bg-[#F8F9FA]"
          }`}
        >
          <CalendarCheck className="h-4 w-4" />
          <span>Floor & Reservations ({reservations.length})</span>
        </button>
      </div>

      {/* TAB 1: Analytics */}
      {activeTab === "analytics" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-[#E8E8E8] bg-[#FFFFFF] p-5 shadow-sm">
              <div className="flex items-center justify-between text-[#686B78]">
                <span className="text-xs font-bold">Daily Revenue</span>
                <DollarSign className="h-4 w-4 text-[#0F8A65]" />
              </div>
              <div className="mt-2 text-2xl font-heading font-extrabold text-[#1C1C1C] tabular-nums">
                {formatPrice(metrics?.totalRevenue || 0)}
              </div>
              <span className="text-xs font-bold text-[#0F8A65] flex items-center gap-1 mt-1">
                <TrendingUp className="h-3.5 w-3.5" /> +18.4% from yesterday
              </span>
            </div>

            <div className="rounded-2xl border border-[#E8E8E8] bg-[#FFFFFF] p-5 shadow-sm">
              <div className="flex items-center justify-between text-[#686B78]">
                <span className="text-xs font-bold">Active Orders</span>
                <Clock className="h-4 w-4 text-[#FC8019]" />
              </div>
              <div className="mt-2 text-2xl font-heading font-extrabold text-[#1C1C1C] tabular-nums">
                {metrics?.activeOrdersCount ?? 3} active
              </div>
              <span className="text-xs text-[#686B78] mt-1 block">In preparation queue</span>
            </div>

            <div className="rounded-2xl border border-[#E8E8E8] bg-[#FFFFFF] p-5 shadow-sm">
              <div className="flex items-center justify-between text-[#686B78]">
                <span className="text-xs font-bold">Table Occupancy</span>
                <Users className="h-4 w-4 text-[#2563EB]" />
              </div>
              <div className="mt-2 text-2xl font-heading font-extrabold text-[#1C1C1C] tabular-nums">
                {metrics?.occupancyRate ?? 38}%
              </div>
              <span className="text-xs text-[#686B78] mt-1 block">
                {metrics?.tableStats?.occupied ?? 1} occupied • {metrics?.tableStats?.reserved ?? 2} reserved
              </span>
            </div>

            <div className="rounded-2xl border border-[#E8E8E8] bg-[#FFFFFF] p-5 shadow-sm">
              <div className="flex items-center justify-between text-[#686B78]">
                <span className="text-xs font-bold">Average Prep Time</span>
                <Clock className="h-4 w-4 text-[#0F8A65]" />
              </div>
              <div className="mt-2 text-2xl font-heading font-extrabold text-[#1C1C1C] tabular-nums">
                {metrics?.avgPrepMinutes ?? 16} mins
              </div>
              <span className="text-xs text-[#0F8A65] font-bold mt-1 block">98% on-time pace</span>
            </div>
          </div>

          {/* Popular Dishes Leaderboard */}
          <div className="rounded-2xl border border-[#E8E8E8] bg-[#FFFFFF] p-6 shadow-sm">
            <h3 className="font-heading text-base font-extrabold text-[#1C1C1C] mb-4">
              Top Selling Dishes
            </h3>
            <div className="divide-y divide-[#E8E8E8]">
              {metrics?.popularDishes?.map((dish: any, idx: number) => (
                <div key={idx} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[#93959F] font-bold w-5">#{idx + 1}</span>
                    <div className="relative h-11 w-11 overflow-hidden rounded-xl bg-[#F4F5F7] shrink-0">
                      <Image
                        src={dish.imageUrl}
                        alt={dish.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-heading font-bold text-[#1C1C1C] text-xs">
                        {dish.name}
                      </h4>
                      <span className="text-[11px] text-[#686B78]">
                        {dish.count} orders fulfilled
                      </span>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-[#0F8A65] text-sm tabular-nums">
                    {formatPrice(dish.revenue)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Menu Inventory Management */}
      {activeTab === "menu" && (
        <div className="rounded-2xl border border-[#E8E8E8] bg-[#FFFFFF] p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-[#E8E8E8]">
            <div>
              <h3 className="font-heading text-lg font-bold text-[#1C1C1C]">
                Menu Inventory & Pricing
              </h3>
              <p className="text-xs text-[#686B78]">
                Toggle dish availability in real time, edit prices, or add new dishes to catalog.
              </p>
            </div>
            <button
              onClick={() => setIsAddOpen(true)}
              className="flex items-center gap-1.5 rounded-xl bg-[#E23744] hover:bg-[#cb202d] px-4 py-2 text-xs font-bold text-white shadow-sm transition"
            >
              <Plus className="h-4 w-4" />
              <span>Add New Dish</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8F9FA] text-[#686B78] uppercase tracking-wider font-bold text-[11px]">
                <tr>
                  <th className="p-3">Dish</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Dietary</th>
                  <th className="p-3">Stock Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E8E8] text-[#1C1C1C]">
                {menuItems.map((item) => (
                  <tr key={item.id} className="hover:bg-[#F8F9FA]">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 overflow-hidden rounded-lg bg-[#F4F5F7] shrink-0">
                          <Image
                            src={item.imageUrl}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <strong className="text-[#1C1C1C] block text-xs">{item.name}</strong>
                          <span className="text-[11px] text-[#686B78]">
                            {item.preparationTime}m prep • {item.calories ?? 0} cal
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-[#686B78] font-medium">{item.category?.name}</td>
                    <td className="p-3 font-mono font-bold text-[#1C1C1C] tabular-nums">
                      {formatPrice(item.price)}
                    </td>
                    <td className="p-3">
                      <div className="flex gap-1 text-[10px]">
                        {item.isVegetarian && (
                          <span className="rounded bg-[#0F8A65]/10 px-1.5 py-0.5 text-[#0F8A65] font-bold">
                            Veg
                          </span>
                        )}
                        {item.isVegan && (
                          <span className="rounded bg-[#0F8A65]/10 px-1.5 py-0.5 text-[#0F8A65] font-bold">
                            Vegan
                          </span>
                        )}
                        {item.isGlutenFree && (
                          <span className="rounded bg-[#FC8019]/10 px-1.5 py-0.5 text-[#FC8019] font-bold">
                            GF
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => toggleItemAvailability(item.id, item.isAvailable)}
                        className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold transition ${
                          item.isAvailable
                            ? "bg-[#0F8A65]/10 text-[#0F8A65]"
                            : "bg-rose-100 text-[#E23744]"
                        }`}
                      >
                        {item.isAvailable ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                        <span>{item.isAvailable ? "In Stock" : "Sold Out"}</span>
                      </button>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => updatePrice(item.id, item.price)}
                          className="rounded-lg p-1.5 text-[#686B78] hover:bg-[#F4F5F7] hover:text-[#1C1C1C]"
                          title="Edit price"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => deleteItem(item.id)}
                          className="rounded-lg p-1.5 text-[#93959F] hover:bg-rose-50 hover:text-[#E23744]"
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
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <div className="w-full max-w-lg rounded-2xl border border-[#E8E8E8] bg-[#FFFFFF] p-6 shadow-2xl text-[#1C1C1C] space-y-4">
                <div className="flex items-center justify-between border-b border-[#E8E8E8] pb-3">
                  <h3 className="font-heading text-lg font-bold">Add New Menu Dish</h3>
                  <button onClick={() => setIsAddOpen(false)} className="text-[#93959F] hover:text-[#1C1C1C]">
                    ✕
                  </button>
                </div>

                <form onSubmit={handleAddDish} className="space-y-3 text-xs">
                  <div>
                    <label className="block text-[#686B78] font-bold mb-1">Dish Name</label>
                    <input
                      type="text"
                      required
                      value={newDishName}
                      onChange={(e) => setNewDishName(e.target.value)}
                      placeholder="e.g. Butter Garlic Naan"
                      className="w-full rounded-xl border border-[#E8E8E8] bg-[#F8F9FA] p-2.5"
                    />
                  </div>

                  <div>
                    <label className="block text-[#686B78] font-bold mb-1">Description</label>
                    <textarea
                      required
                      rows={2}
                      value={newDishDesc}
                      onChange={(e) => setNewDishDesc(e.target.value)}
                      placeholder="Taste notes, prep style, ingredients..."
                      className="w-full rounded-xl border border-[#E8E8E8] bg-[#F8F9FA] p-2.5"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[#686B78] font-bold mb-1">Price (₹)</label>
                      <input
                        type="number"
                        step="1"
                        required
                        value={newDishPrice}
                        onChange={(e) => setNewDishPrice(e.target.value)}
                        placeholder="349"
                        className="w-full rounded-xl border border-[#E8E8E8] bg-[#F8F9FA] p-2.5 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[#686B78] font-bold mb-1">Category</label>
                      <select
                        value={newDishCategory}
                        onChange={(e) => setNewDishCategory(e.target.value)}
                        className="w-full rounded-xl border border-[#E8E8E8] bg-[#F8F9FA] p-2.5"
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
                    <label className="block text-[#686B78] font-bold mb-1">Image URL</label>
                    <input
                      type="url"
                      required
                      value={newDishImg}
                      onChange={(e) => setNewDishImg(e.target.value)}
                      className="w-full rounded-xl border border-[#E8E8E8] bg-[#F8F9FA] p-2.5"
                    />
                  </div>

                  <div className="flex gap-4 pt-1 font-bold">
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
                      className="flex-1 rounded-xl bg-[#F4F5F7] py-2.5 font-bold text-[#686B78]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 rounded-xl bg-[#E23744] hover:bg-[#cb202d] py-2.5 font-bold text-white shadow-sm"
                    >
                      Save Dish
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Floor & Tables */}
      {activeTab === "tables" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-[#E8E8E8] bg-[#FFFFFF] p-6 shadow-sm">
            <h3 className="font-heading text-base font-extrabold text-[#1C1C1C] mb-1">
              Live Floor Layout Overrides
            </h3>
            <p className="text-xs text-[#686B78] mb-4">
              Click status to manually toggle table state between Open, Reserved, and Occupied.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {tables.map((table) => (
                <div
                  key={table.id}
                  className="rounded-xl border border-[#E8E8E8] bg-[#F8F9FA] p-4 text-xs space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <strong className="font-heading text-sm text-[#1C1C1C]">
                      Table #{table.tableNumber}
                    </strong>
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${
                        table.status === "AVAILABLE"
                          ? "bg-[#0F8A65]"
                          : table.status === "RESERVED"
                          ? "bg-[#FC8019]"
                          : "bg-[#93959F]"
                      }`}
                    ></span>
                  </div>

                  <div className="text-xs text-[#686B78]">
                    <span>{table.location}</span> • <span>{table.capacity} Seater</span>
                  </div>

                  <div className="grid grid-cols-3 gap-1 pt-1">
                    {(["AVAILABLE", "RESERVED", "OCCUPIED"] as const).map((st) => (
                      <button
                        key={st}
                        onClick={() => updateTableStatus(table.id, st)}
                        className={`rounded-lg py-1 text-[10px] uppercase font-bold transition ${
                          table.status === st
                            ? "bg-[#1C1C1C] text-white shadow-sm"
                            : "bg-[#FFFFFF] text-[#686B78] border border-[#E8E8E8] hover:bg-[#F4F5F7]"
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

          {/* Active Reservations */}
          <div className="rounded-2xl border border-[#E8E8E8] bg-[#FFFFFF] p-6 shadow-sm">
            <h3 className="font-heading text-base font-extrabold text-[#1C1C1C] mb-1">
              Active Table Reservations
            </h3>
            <p className="text-xs text-[#686B78] mb-4">
              Seat arriving diners or process cancellations directly with floor map synchronization.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F8F9FA] text-[#686B78] uppercase tracking-wider font-bold text-[11px]">
                  <tr>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Table</th>
                    <th className="p-3">Slot</th>
                    <th className="p-3">Guests</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E8E8] text-[#1C1C1C]">
                  {reservations.map((res) => (
                    <tr key={res.id} className="hover:bg-[#F8F9FA]">
                      <td className="p-3">
                        <strong className="text-[#1C1C1C] block text-xs">{res.customerName}</strong>
                        <span className="text-[11px] text-[#686B78]">
                          {res.customerPhone} • {res.customerEmail}
                        </span>
                        {res.specialRequests && (
                          <span className="block text-[11px] text-[#E23744] italic">
                            &quot;{res.specialRequests}&quot;
                          </span>
                        )}
                      </td>
                      <td className="p-3 font-bold text-[#E23744]">
                        Table #{res.table?.tableNumber} ({res.table?.location})
                      </td>
                      <td className="p-3">
                        {res.reservationDate} at <strong>{res.timeSlot}</strong>
                      </td>
                      <td className="p-3 font-semibold">{res.guestCount} Diners</td>
                      <td className="p-3">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                            res.status === "SEATED"
                              ? "bg-[#0F8A65]/10 text-[#0F8A65]"
                              : res.status === "CONFIRMED"
                              ? "bg-[#FC8019]/10 text-[#FC8019]"
                              : "bg-gray-100 text-[#93959F]"
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
                              className="rounded-lg bg-[#0F8A65] px-3 py-1 text-xs font-bold text-white hover:bg-[#0c7354] transition shadow-sm"
                            >
                              Seat Diner
                            </button>
                          )}
                          {res.status !== "CANCELLED" && res.status !== "COMPLETED" && (
                            <button
                              onClick={() => updateReservationStatus(res.id, "CANCELLED")}
                              className="rounded-lg border border-[#E8E8E8] bg-[#FFFFFF] px-2.5 py-1 text-xs font-medium text-[#686B78] hover:text-[#E23744] hover:bg-rose-50 transition"
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
