export enum UserRole {
  CUSTOMER = "CUSTOMER",
  KITCHEN_STAFF = "KITCHEN_STAFF",
  ADMIN = "ADMIN",
}

export enum OrderStatus {
  PENDING = "PENDING",
  PREPARING = "PREPARING",
  READY = "READY",
  SERVED = "SERVED",
  CANCELLED = "CANCELLED",
}

export enum OrderType {
  DINE_IN = "DINE_IN",
  TAKEOUT = "TAKEOUT",
  DELIVERY = "DELIVERY",
}

export enum TableStatus {
  AVAILABLE = "AVAILABLE",
  RESERVED = "RESERVED",
  OCCUPIED = "OCCUPIED",
}

export enum PaymentStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  FAILED = "FAILED",
}

export enum ReservationStatus {
  CONFIRMED = "CONFIRMED",
  SEATED = "SEATED",
  CANCELLED = "CANCELLED",
  COMPLETED = "COMPLETED",
}
