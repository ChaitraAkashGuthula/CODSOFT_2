import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string; // menuItem.id
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
  customInstructions?: string;
}

export type RoleType = "CUSTOMER" | "KITCHEN_STAFF" | "ADMIN";
export type OrderType = "DINE_IN" | "TAKEOUT" | "DELIVERY";

interface AppState {
  // Role & navigation
  currentRole: RoleType;
  setCurrentRole: (role: RoleType) => void;

  // Cart
  cart: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (item: Omit<CartItem, "quantity">, quantity?: number, instructions?: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;

  // Order Details
  orderType: OrderType;
  setOrderType: (type: OrderType) => void;
  selectedTableId: string | null;
  selectedTableNumber: number | null;
  setSelectedTable: (tableId: string | null, tableNumber: number | null) => void;
  tipPercentage: number;
  setTipPercentage: (pct: number) => void;
  orderNotes: string;
  setOrderNotes: (notes: string) => void;
  customerName: string;
  setCustomerName: (name: string) => void;
  customerPhone: string;
  setCustomerPhone: (phone: string) => void;

  // Search & Filters
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  vegOnly: boolean;
  setVegOnly: (val: boolean) => void;
  veganOnly: boolean;
  setVeganOnly: (val: boolean) => void;
  glutenFreeOnly: boolean;
  setGlutenFreeOnly: (val: boolean) => void;

  // Computed helpers
  getCartSubtotal: () => number;
  getCartTax: () => number;
  getCartTip: () => number;
  getCartTotal: () => number;
  getCartCount: () => number;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentRole: "CUSTOMER",
      setCurrentRole: (role) => set({ currentRole: role }),

      cart: [],
      isCartOpen: false,
      setIsCartOpen: (open) => set({ isCartOpen: open }),

      addToCart: (item, quantity = 1, instructions = "") => {
        const { cart } = get();
        const existingIndex = cart.findIndex((i) => i.id === item.id);
        if (existingIndex > -1) {
          const updated = [...cart];
          updated[existingIndex].quantity += quantity;
          if (instructions) {
            updated[existingIndex].customInstructions = instructions;
          }
          set({ cart: updated, isCartOpen: true });
        } else {
          set({
            cart: [...cart, { ...item, quantity, customInstructions: instructions }],
            isCartOpen: true,
          });
        }
      },

      updateQuantity: (id, delta) => {
        const { cart } = get();
        const updated = cart
          .map((item) => {
            if (item.id === id) {
              const newQty = item.quantity + delta;
              return newQty > 0 ? { ...item, quantity: newQty } : null;
            }
            return item;
          })
          .filter(Boolean) as CartItem[];
        set({ cart: updated });
      },

      removeFromCart: (id) => {
        set({ cart: get().cart.filter((item) => item.id !== id) });
      },

      clearCart: () => {
        set({ cart: [], orderNotes: "" });
      },

      orderType: "DINE_IN",
      setOrderType: (orderType) => set({ orderType }),
      selectedTableId: null,
      selectedTableNumber: 2,
      setSelectedTable: (tableId, tableNumber) =>
        set({ selectedTableId: tableId, selectedTableNumber: tableNumber }),
      tipPercentage: 15,
      setTipPercentage: (tipPercentage) => set({ tipPercentage }),
      orderNotes: "",
      setOrderNotes: (orderNotes) => set({ orderNotes }),
      customerName: "Sarah Jenkins",
      setCustomerName: (customerName) => set({ customerName }),
      customerPhone: "+1 (555) 987-6543",
      setCustomerPhone: (customerPhone) => set({ customerPhone }),

      searchQuery: "",
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      selectedCategory: "all",
      setSelectedCategory: (selectedCategory) => set({ selectedCategory }),
      vegOnly: false,
      setVegOnly: (vegOnly) => set({ vegOnly }),
      veganOnly: false,
      setVeganOnly: (veganOnly) => set({ veganOnly }),
      glutenFreeOnly: false,
      setGlutenFreeOnly: (glutenFreeOnly) => set({ glutenFreeOnly }),

      getCartSubtotal: () => {
        return Number(
          get()
            .cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
            .toFixed(2)
        );
      },

      getCartTax: () => {
        const subtotal = get().getCartSubtotal();
        return Number((subtotal * 0.08).toFixed(2)); // 8% sales tax
      },

      getCartTip: () => {
        const subtotal = get().getCartSubtotal();
        const pct = get().tipPercentage;
        return Number(((subtotal * pct) / 100).toFixed(2));
      },

      getCartTotal: () => {
        const subtotal = get().getCartSubtotal();
        const tax = get().getCartTax();
        const tip = get().getCartTip();
        return Number((subtotal + tax + tip).toFixed(2));
      },

      getCartCount: () => {
        return get().cart.reduce((sum, item) => sum + item.quantity, 0);
      },
    }),
    {
      name: "dinedesk-storage",
      partialize: (state) => ({
        cart: state.cart,
        orderType: state.orderType,
        selectedTableNumber: state.selectedTableNumber,
        selectedTableId: state.selectedTableId,
        customerName: state.customerName,
        customerPhone: state.customerPhone,
        currentRole: state.currentRole,
      }),
    }
  )
);
