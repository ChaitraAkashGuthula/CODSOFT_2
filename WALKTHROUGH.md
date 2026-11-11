# DineDesk (CodSoft Task 2: Restaurant Platform) — Architecture, Verification & Demo Guide

## 1. System Architecture Overview
**DineDesk** is an enterprise-grade restaurant ordering and table management platform. It combines guest-facing digital menus and table reservations with high-throughput line cook operations (Kitchen Display System) and executive analytics.

```mermaid
flowchart TD
    Guest["🧑‍🍳 Guest / Customer Portal\n(Next.js App Router, Tailwind, Zustand)"]
    KDS["🍳 Kitchen Display System (KDS)\n(Real-Time Kanban & Audio Chimes)"]
    Admin["📊 Executive Admin Command\n(Analytics, Inventory CRUD, Floor Map)"]

    API_Orders["/api/orders\n(Zod Validation, Transactions)"]
    API_Reservations["/api/reservations\n(Double-Booking Guard)"]
    API_Menu["/api/menu\n(Catalog CRUD & Stock)"]
    API_Analytics["/api/analytics\n(KPIs & Dish Leaderboard)"]
    
    SSE_Hub["⚡ Real-Time SSE Dispatcher\n(/api/realtime/events, Sub-100ms Sync)"]
    DB[("🐘 PostgreSQL + Prisma ORM\n(Public Schema, Connection Pooling)")]

    Guest -->|Place Order / Pay| API_Orders
    Guest -->|Select Floor Table| API_Reservations
    API_Orders -->|Atomic Transaction| DB
    API_Reservations -->|Check Table & Lock| DB

    API_Orders -->|order:created| SSE_Hub
    API_Orders -->|order:updated| SSE_Hub
    API_Reservations -->|table:updated| SSE_Hub

    SSE_Hub -->|Push Live Tickets & Chime| KDS
    SSE_Hub -->|Push Stage Transitions| Guest
    SSE_Hub -->|Push Table State| Admin

    KDS -->|Status Transition| API_Orders
    Admin -->|Catalog CRUD| API_Menu
    Admin -->|Floor Operations| API_Reservations
    Admin -->|Revenue Telemetry| API_Analytics
```

---

## 2. Core Capabilities & Module Matrix

| Module | Core Features | Technology / Protocol |
| :--- | :--- | :--- |
| **Digital Menu** | 18 dishes, category tabs, Veg/Vegan/Gluten-Free filters, instant search, calorie & allergen badges, detail modals | React 19, Tailwind CSS, Lucide |
| **Cart & Checkout** | Live price math, tip presets (0%-25%), custom prep notes, Dine-in vs Takeout toggle, mock Stripe payment modal, confetti celebration | Zustand Persist, Canvas Confetti, Web Audio |
| **Table Reservations** | Interactive floor plan (Window Bay, Main Hall, Patio, VIP Booth), atomic double-booking prevention, guest capacity enforcement | PostgreSQL Transactions, Zod, Prisma |
| **Live Order Tracker** | 4-stage visual progress tracker (Placed -> Cooking -> Ready -> Served), live elapsed timer, dish breakdown | Server-Sent Events (SSE), EventSource |
| **Kitchen Display (KDS)** | 4-column Kanban board, color-coded urgency timers (<10m green, 10-20m yellow, >20m red pulse), two-tone synthetic audio bell chime | Web Audio API, SSE, Optimistic UI |
| **Admin Operations** | Daily revenue KPIs, top-selling dish leaderboard, in-stock/sold-out toggles, live floor map override, guest check-in | Next.js Route Handlers, Prisma Aggregations |

---

## 3. Local Setup & Spin-Up Instructions

### Prerequisites
- **Node.js**: v18+ (tested on Node v24.22)
- **PostgreSQL**: Local or hosted instance (running on port 5432)

### 1. Configure Database Connection
Edit `.env` with your PostgreSQL connection URL:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/dinedesk_db"
NEXT_PUBLIC_APP_URL="http://localhost:3005"
NODE_ENV="development"
```

### 2. Synchronize Schema & Seed Data
```bash
# Push Prisma schema to PostgreSQL
npm run prisma:push

# Seed 18 authentic dishes, 8 tables, mock orders, and staff roles
npm run prisma:seed
```

### 3. Launch the Production Application
```bash
# Build optimized production bundle
npm run build

# Start production server
npm run start -- -p 3005
```
Open **[http://localhost:3005](http://localhost:3005)** in your browser.

---

## 4. Verification Test Matrix (Observed Results)

- [x] **Order Placement**: Placing an order atomically writes to `Order` and `OrderItem` tables and updates Table status to `OCCUPIED`.
- [x] **Kitchen Display (KDS) Live Ingestion**: Server-Sent Events (SSE) immediately pushes new tickets to the `Pending` Kanban column with synthetic audio chime.
- [x] **Status Progression**: Line cook clicks `"Start Cooking"` (moves to `PREPARING`) -> `"Mark Ready"` (moves to `READY`) -> `"Mark Served"` (moves to `SERVED`).
- [x] **Live Order Tracker Real-Time Reflection**: Customer tracker at `/tracker?orderId=ORD-1005` advances its step indicator automatically without page reload.
- [x] **Atomic Reservation Engine**:
  - Successfully reserved Table #5 for 4 guests.
  - Attempting to book the identical table and slot rejected with: `Table is already booked for this slot`.
  - Attempting to seat 6 guests at a 2-person table rejected with: `Table seats up to 2 guests`.

---

## 5. 60-Second Video Demo Script (For LinkedIn / Portfolio Submission)

> **[0:00 - 0:10] Hook & Introduction**
> *(Screen sharing the dark-themed DineDesk menu with warm red accents)*
> "Hey everyone! For CodSoft Web Development Task 2, I built **DineDesk** — an enterprise-grade restaurant ordering and table management platform built with Next.js 15, React 19, TypeScript, Tailwind, and PostgreSQL with Prisma ORM."

> **[0:10 - 0:25] Customer Ordering & Real-Time Cart**
> *(Clicking through Appetizers, filtering for Gluten-Free, adding Truffle Burrata and Wagyu Burger)*
> "Guests can explore an interactive seasonal menu with dietary badges, calories, and allergen alerts. In the cart drawer, we have live tax and tip calculation, dine-in table assignments, and custom prep notes. Let's hit checkout — payment is verified, and confetti confirms the order!"

> **[0:25 - 0:42] The Real-Time Kitchen Display System (KDS)**
> *(Switching to the /kds screen on another tab or split view)*
> "Instantly, over Server-Sent Events (SSE), the Kitchen Display System receives the ticket with a kitchen chime bell! Notice the urgency timers that transition from green to amber to red as ticket time elapses. With one click, the sous chef starts cooking, and then marks the ticket ready."

> **[0:42 - 0:52] Live Order Tracker & Interactive Table Reservation**
> *(Opening /tracker to show the progress stage advancing to 'Ready', then clicking /reservations)*
> "Back on the customer's live tracker, the status jumps to 'Ready for Service' with zero page reload. Guests can also reserve tables via our interactive visual floor map, backed by atomic database transactions that prevent double-booking."

> **[0:52 - 1:00] Admin Dashboard & Wrap-Up**
> *(Showing /admin analytics KPIs, dish leaderboard, and stock toggle)*
> "Finally, the manager dashboard monitors revenue, popular dishes, and inventory stock in real-time. The code is modular, fully accessible, and production-ready. Check out the GitHub repository below!"
