# 🛍️ Modern Persian E-Commerce Boilerplate

> **Enterprise-grade, Modular Full-Stack E-Commerce Boilerplate** featuring a high-performance **NestJS REST API**, **Prisma ORM (PostgreSQL)**, and a **Next.js 14 Admin Dashboard** with variable products, dynamic attributes, media asset management, and Persian/RTL support.

---

## 🏗️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Backend API** | **NestJS 10 + TypeScript** (Modular Architecture, Swagger Docs, JWT & OTP Auth) |
| **Database & ORM** | **PostgreSQL 16 + Prisma ORM 5** (Unified relational schema) |
| **Frontend Admin** | **Next.js 14 (App Router) + Tailwind CSS + TanStack Query v5** (Persian RTL) |
| **Containers & Media**| **Docker Compose** (Postgres 16 + pgAdmin 4) & **Sharp** (WebP optimization) |

---

## ⚙️ Modular Feature Flags

Easily customize modules per client without altering the database schema or breaking future updates. Features are toggled via `.env` and automatically adapt both backend API guards and admin UI navigation/settings.

```env
# Example: Enable or disable modules per client requirement
FEATURE_BLOG=true
FEATURE_WALLET=true
FEATURE_REFERRAL=true
FEATURE_COUPONS=true
FEATURE_ATTRIBUTES=true
FEATURE_FLASH_DEALS=true
FEATURE_NOTIFICATIONS=true
```

> 💡 *Core operations like **Shipping**, **Orders**, and **Media** are always active. Features automatically adapt both backend API guards, database queries, and admin UI navigation/dashboard widgets.*

### 🧩 Available Feature Modules
* **🔔 Notifications & SMS Gateway**: In-app notifications center, realtime SSE stream, multi-provider SMS (Kavenegar & Melipayamak), and automated store event triggers.
* **⚡ Timed Flash Deals**: Special offer campaigns with countdown timers, customer cashbacks, and referrer bonuses.
* **👛 Wallet & Expiry Policy**: Store balance system, auto-expiry of inactive credits, and transaction auditing.
* **🎁 Referral & Affiliates**: Customer invite links, commission payouts, and referral stats.
* **🏷️ Coupons & Promotions**: Percentage or fixed amount coupons with usage limits and date constraints.
* **🎨 Variable Products & Attributes**: WooCommerce-like attributes, variations, colors, sizes, and specs.
* **📝 Blog & SEO Content**: SEO-friendly articles, categories, and shopping guides.
* **🔍 Adaptive Search & Command Palette**: Instant search across orders, products, coupons, SMS settings, wallets, and routes with active-feature filtering.
* **🔌 Headless Architecture**: Completely decoupled NestJS REST API and Next.js Admin Dashboard, allowing any custom customer storefront to plug in cleanly via Swagger docs.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Configure Environment
```bash
# Backend config
cp .env.example .env

# Frontend config
cp frontend/.env.example frontend/.env.local
```

### 3. Start Database (Docker)
```bash
pnpm docker:up
```

### 4. Setup Database
```bash
# Clean production setup (creates tables, admin user, default shipping & settings — NO dummy data)
pnpm db:setup

# (Optional) Seed realistic demo catalog & test orders using local placeholder assets:
pnpm db:seed
```

### 5. Launch Development Servers
```bash
# Terminal 1: Backend API (http://localhost:4000/api/v1 | Swagger: /api/docs)
pnpm dev:backend

# Terminal 2: Admin Dashboard (http://localhost:4001)
pnpm dev:frontend
```

---

## 🔑 Default Credentials

| Portal | URL | Username / Email | Password |
| :--- | :--- | :--- | :--- |
| **Admin Dashboard** | `http://localhost:4001/login` | `admin@store.local` | `Admin@123456` |
| **pgAdmin 4 GUI** | `http://localhost:5050` | `admin@store.local` | `admin` |

---

## 🛠️ Essential Scripts

| Command | Description |
| :--- | :--- |
| `pnpm db:setup` | Push schema & initialize clean database (zero demo data) |
| `pnpm db:seed` | Seed demo catalog, products, orders & local placeholder |
| `pnpm prisma:studio`| Launch Prisma Studio database browser (`http://localhost:5555`) |
| `pnpm build` | Compile NestJS backend |
| `pnpm --dir frontend build` | Compile Next.js admin frontend |

---

## 📄 License
MIT License.
