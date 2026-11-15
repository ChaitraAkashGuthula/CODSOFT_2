import { z } from "zod";
import { OrderType, OrderStatus, TableStatus, ReservationStatus } from "@/lib/types";

export const CreateOrderItemSchema = z.object({
  menuItemId: z.string().min(1, "Menu item ID is required"),
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
  unitPrice: z.number().positive("Unit price must be positive"),
  customInstructions: z.string().optional().nullable(),
});

export const CreateOrderSchema = z.object({
  type: z.nativeEnum(OrderType).default(OrderType.DINE_IN),
  tableId: z.string().optional().nullable(),
  customerName: z.string().min(2, "Customer name must be at least 2 characters"),
  customerPhone: z.string().min(7, "Valid phone number required").optional().nullable(),
  customerEmail: z.string().email("Valid email required").optional().nullable(),
  notes: z.string().optional().nullable(),
  tip: z.number().min(0).default(0),
  paymentMethod: z.string().default("CARD"),
  items: z.array(CreateOrderItemSchema).min(1, "Order must contain at least one item"),
});

export const UpdateOrderStatusSchema = z.object({
  status: z.nativeEnum(OrderStatus),
});

export const CreateReservationSchema = z.object({
  tableId: z.string().min(1, "Table selection is required"),
  customerName: z.string().min(2, "Name is required"),
  customerEmail: z.string().email("Valid email required"),
  customerPhone: z.string().min(7, "Phone number required"),
  guestCount: z.number().int().min(1).max(20),
  reservationDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format must be YYYY-MM-DD"),
  timeSlot: z.string().min(1, "Time slot is required"),
  specialRequests: z.string().optional().nullable(),
});

export const UpdateReservationStatusSchema = z.object({
  status: z.nativeEnum(ReservationStatus),
});

export const MenuItemSchema = z.object({
  categoryId: z.string().min(1, "Category is required"),
  name: z.string().min(2, "Dish name is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.number().positive("Price must be positive"),
  imageUrl: z.string().url("Valid image URL required"),
  isVegetarian: z.boolean().default(false),
  isVegan: z.boolean().default(false),
  isGlutenFree: z.boolean().default(false),
  isAvailable: z.boolean().default(true),
  preparationTime: z.number().int().min(1).default(15),
  calories: z.number().int().optional().nullable(),
  allergens: z.array(z.string()).default([]),
});

export const UpdateTableStatusSchema = z.object({
  status: z.nativeEnum(TableStatus),
});
