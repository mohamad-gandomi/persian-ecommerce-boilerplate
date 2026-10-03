# 🛍️ Modern E-Commerce Backend & Admin Boilerplate

> **Enterprise-grade, Modular Full-Stack E-Commerce Boilerplate** featuring a high-performance **NestJS REST API**, **Prisma ORM (PostgreSQL)**, and a **Next.js 14 Admin Dashboard** with variable products, dynamic attributes, media asset management, and Persian/RTL support.

---

## 🏗️ Architecture & Tech Stack

```mermaid
flowchart TD
    subgraph Clients["Clients Layer"]
        Admin["Admin Dashboard (Next.js 14)"]
        Storefront["Your Custom Storefront / Mobile App"]
    end

    subgraph Backend["NestJS Backend API (Port 4000)"]
        Auth["Auth (JWT / OTP / Password)"]
        Catalog["Catalog & Variations (WooCommerce style)"]
        Orders["Orders & Shipping"]
        Media["Media Library & Sharp (WebP)"]
        Swagger["Swagger OpenAPI Docs"]
    end

    subgraph Data["Database & Storage"]
        Postgres[(PostgreSQL 16)]
        Uploads["Local / CDN Media Storage"]
    end

    Admin -->|REST / JSON| Backend
    Storefront -.->|REST / JSON| Backend
    Backend --> Postgres
    Backend --> Uploads
```

| Layer | Technology | Key Highlights |
| :--- | :--- | :--- |
| **Backend API** | **NestJS 10 + TypeScript** | Modular Clean Architecture, Swagger OpenAPI, JWT Auth, OTP Mobile Login, Multer & Sharp WebP Processing |
| **Database & ORM** | **PostgreSQL 16 + Prisma ORM 5** | Relational schemas for variable products, attributes matrix, categories hierarchy, orders, coupons, media |
| **Frontend Admin** | **Next.js 14 (App Router) + React 18** | Tailwind CSS, Radix UI Primitives, TanStack React Query v5, Sonner Toasts, RTL Persian UI |
| **Containers** | **Docker & Docker Compose** | Isolated PostgreSQL 16 Alpine + pgAdmin 4 Web GUI |
| **Package Manager** | **pnpm Workspaces** | Monorepo structure with disk-efficient dependency resolution |

---

## 📋 Prerequisites

Before running the project, make sure you have the following installed:

- **Node.js**: `v18.x` or `v20.x` (LTS recommended) — [Download](https://nodejs.org/)
- **pnpm**: `v8.x` or `v9.x` — Install globally via:
  ```bash
  npm install -g pnpm
  ```
- **Docker & Docker Desktop**: For running PostgreSQL and pgAdmin — [Download Docker](https://www.docker.com/products/docker-desktop/)  
  *(Alternatively, you can connect to any existing PostgreSQL instance by updating `DATABASE_URL` in `.env`)*

---

## 🚀 Quick Start Guide

### Step 1: Install Dependencies

From the project root, install all workspace dependencies:

```bash
pnpm install
```

---

### Step 2: Configure Environment Variables

Create your local `.env` files from the provided templates:

**Root (.env):**
```bash
cp .env.example .env
```
*(On Windows PowerShell: `Copy-Item .env.example .env`)*

> Default configuration works out-of-the-box with Docker Compose:
> ```env
> PORT=4000
> NODE_ENV=development
> API_PREFIX=api/v1
> CORS_ORIGIN=http://localhost:4000,http://localhost:4001
> DATABASE_URL="postgresql://boilerplate_user:boilerplate_password@localhost:5432/boilerplate_db?schema=public"
> JWT_SECRET="replace_with_a_secure_random_key"
> JWT_EXPIRES_IN="7d"
> UPLOAD_DIR="./uploads"
> MAX_FILE_SIZE_MB=5
> ```

**Frontend (.env.local):**
```bash
cp frontend/.env.example frontend/.env.local
```
*(On Windows PowerShell: `Copy-Item frontend/.env.example frontend/.env.local`)*

---

### Step 3: Start the PostgreSQL Database

Launch PostgreSQL and pgAdmin containers in the background:

```bash
pnpm docker:up
```
*(Or manually: `docker compose up -d`)*

Verify that containers are healthy:
```bash
docker ps
```

---

### Step 4: Initialize and Seed the Database

Generate the Prisma Client, push schema tables to PostgreSQL, and seed initial demo data (admin user, categories, attributes, products, and coupons):

```bash
pnpm db:setup
```
*(This command runs: `pnpm prisma:generate && pnpm prisma:push && pnpm prisma:seed`)*

---

### Step 5: Start the Backend API (NestJS)

Run the NestJS server in development watch mode:

```bash
pnpm dev:backend
```
*(Runs on: `http://localhost:4000/api/v1`)*
- **Swagger Interactive API Documentation**: `http://localhost:4000/api/docs`

---

### Step 6: Start the Frontend Admin Dashboard (Next.js)

In a separate terminal window, launch the Next.js admin frontend:

```bash
pnpm dev:frontend
```
*(Runs on: `http://localhost:4001`)*

---

## 🔑 Default Credentials

### 1. Admin Dashboard Portal (`http://localhost:4001/login` or `/auth/otp`)
| Role | Email / Identifier | Password |
| :--- | :--- | :--- |
| **Administrator** | `admin@store.local` | `Admin@123456` |
| **Customer (Demo)** | `customer@store.local` | `Customer@123456` |

> 💡 *The login portal supports both **Username/Password** and **Mobile OTP** (simulated dev OTP code is logged in the console).*

### 2. pgAdmin 4 Web GUI (`http://localhost:5050`)
| Property | Value |
| :--- | :--- |
| **Email** | `admin@store.local` |
| **Password** | `admin` |
| **Database Host** | `postgres` *(inside Docker network)* or `localhost` *(from host machine)* |
| **Port** | `5432` |
| **Database** | `boilerplate_db` |
| **Username** | `boilerplate_user` |
| **Password** | `boilerplate_password` |

---

## 📂 Project Structure

```
├── docker-compose.yml       # PostgreSQL 16 & pgAdmin 4 services
├── package.json             # Root scripts & backend dependencies
├── pnpm-workspace.yaml      # Monorepo workspace configuration
├── .env.example             # Root environment variables template
├── prisma/
│   ├── schema.prisma        # Complete E-Commerce schema (Products, Variants, Orders, etc.)
│   └── seed.ts              # Database seeder with realistic store catalog
├── src/                     # NestJS Backend API
│   ├── main.ts              # Entry point, validation pipes, Swagger setup
│   ├── app.module.ts        # Root NestJS module
│   ├── common/              # Decorators, filters, interceptors, guards
│   ├── config/              # Centralized environment config
│   ├── database/            # PrismaService database client
│   └── modules/
│       ├── auth/            # JWT authentication, OTP, strategies
│       ├── products/        # Products & WooCommerce-like variations CRUD
│       ├── attributes/      # Global attributes & attribute terms (color/size swatches)
│       ├── categories/      # Hierarchical category tree
│       ├── orders/          # Orders, items, order transactions, statuses
│       ├── coupons/         # Discount coupons & promo engine
│       ├── upload/          # Media upload, disk storage, WebP optimization
│       └── users/           # User management, addresses, roles
├── frontend/                # Next.js 14 Admin Dashboard
│   ├── package.json         # Frontend dependencies & scripts
│   ├── tailwind.config.ts   # Design tokens & responsive layout
│   └── src/
│       ├── app/             # App Router pages ((admin), login, auth)
│       │   ├── (admin)/     # Protected dashboard pages (products, orders, coupons, media...)
│       │   ├── auth/        # Authentication routes (OTP verification)
│       │   └── login/       # Login portal (Email/Password or Phone OTP toggle)
│       ├── components/      # UI components (Kpis, Tables, Dialogs, MediaPicker)
│       ├── lib/             # API client, auth helpers, formatters
│       └── types/           # TypeScript domain definitions
├── scripts/                 # Utility scripts & maintenance helpers
└── uploads/                 # Local media upload folder (.gitkeep)
```

---

## 🛠️ CLI Scripts Cheatsheet

| Command | Action |
| :--- | :--- |
| `pnpm dev:backend` | Start NestJS backend with live watch on port `4000` |
| `pnpm dev:frontend` | Start Next.js admin frontend on port `4001` |
| `pnpm docker:up` | Launch PostgreSQL & pgAdmin in Docker containers |
| `pnpm docker:down` | Stop Docker containers |
| `pnpm db:setup` | Generate Prisma client, push schema, and seed data |
| `pnpm prisma:generate` | Re-generate Prisma TypeScript client |
| `pnpm prisma:push` | Sync Prisma schema changes directly to PostgreSQL |
| `pnpm prisma:migrate` | Create a formal Prisma SQL migration |
| `pnpm prisma:seed` | Re-run database seeder script |
| `pnpm prisma:studio` | Launch visual browser for PostgreSQL tables on `http://localhost:5555` |
| `pnpm build` | Compile NestJS backend to `dist/` |
| `pnpm build:frontend` | Compile Next.js production build |

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
