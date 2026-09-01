# 🚀 Demo - Enterprise Task & Project Architecture

A modern, full-stack, enterprise-grade **Project and Task Management Platform** built with **JavaScript (ES Modules)**, demonstrating clean MVC + Service architecture, PostgreSQL data access with Sequelize, Redux Toolkit state management, interactive Swagger API documentation, table shimmer skeletons, and centralized constant management (zero magic strings).

> 📖 **Looking for the Tech-Talk Presentation Handbook?** Check out [**`TECH_TALK_GUIDE.md`**](./TECH_TALK_GUIDE.md) for live demo scripts, performance profiling steps, and deep-dive comparisons.

---

## 🏛️ Clean Architecture

```
demo-project/
├── backend/                  # Pure JavaScript (ESM) MVC + Service Layer Backend
│   ├── src/
│   │   ├── config/           # db.js (Sequelize/PostgreSQL), env.js
│   │   ├── constants/        # Centralized HTTP, routes, errors, messages, enums
│   │   ├── controllers/      # HTTP request controllers (Auth, Project, Task, Dashboard)
│   │   ├── errors/           # Custom AppError & global error middleware
│   │   ├── middlewares/      # JWT auth, role validation, request logger
│   │   ├── models/           # Sequelize User, Project, Task, ProjectMember models + Seed (1000+ records)
│   │   ├── routes/           # Express router endpoints
│   │   ├── services/         # Business logic layer
│   │   ├── swagger/          # swagger.yaml & OpenAPI documentation
│   │   ├── utils/            # JWT, bcrypt password hashing, responses
│   │   ├── app.js            # Express app configuration
│   │   └── server.js         # Entrypoint
│   ├── build.js              # Production esbuild bundler
│   └── package.json
│
├── frontend/                 # Pure JavaScript React + Vite + Redux Toolkit
│   ├── src/
│   │   ├── app/              # App.jsx, AuthProvider, ToastProvider, ThemeProvider
│   │   ├── constants/        # Routes, API endpoints, errors, messages, UI tokens
│   │   ├── handlers/         # Global API error & response handlers
│   │   ├── hooks/            # useQueryParams.js (URL search param synchronization)
│   │   ├── redux/            # Store & slices (auth, projects, tasks, dashboard, toast)
│   │   ├── services/         # Axios API client & domain services
│   │   ├── routers/          # AppRouter.jsx & ProtectedRoute.jsx
│   │   ├── views/            # 🚀 Clean presentation components (DataTable, FilterBar, FormModal)
│   │   ├── unoptimized/      # ⚠️ Tech-talk anti-pattern demonstration suite
│   │   ├── pages/            # Declarative page shells (Dashboard, Projects, Tasks, Profile, Login, Register)
│   │   ├── index.css         # Modern glassmorphism design system & skeleton animations
│   │   └── main.jsx          # Frontend entrypoint
│   └── package.json
│
├── scripts/
│   └── toggle-mode.js        # 🔄 Architecture mode switcher script
├── postgres/                 # Docker Compose PostgreSQL service
├── docker-compose.yml        # Multi-container orchestration
└── package.json              # Monorepo root workspace scripts
```

---

## 🌟 Key Features & Highlights

1. **Clean Layered Separation of Concerns**:
   - **Pages (`src/pages/`)**: Declarative shells handling routing.
   - **Views (`src/views/`)**: Domain presentation views, widgets, form modals, table views, and kanban boards.
   - **Common Components (`src/views/components/`)**: Shared generic `DataTable`, `FilterBar`, and `FormModal`.
2. **Interactive Query Parameters & Table Skeletons**:
   - URL-synchronized pagination (`?page=`, `?limit=`), search query, sorting (`?sortBy=`, `?sortOrder=`), and view modes (`?view=grid` / `?view=table`).
   - Smooth, non-intrusive shimmering skeleton loading states across all tables and cards.
3. **Live Tech-Talk Architecture Switcher**:
   - Easily swap between **Fully Optimized**, **No-Query-Params**, and **Unoptimized Heavy Load** modes with 1 command.
4. **Collapsible Sidebar & Mobile Hamburger Drawer**:
   - Responsive collapsible navigation sidebar with icon mode and mobile glassmorphic backdrop.
5. **Editable User Profiles**:
   - Update full name, email address, and toggleable password change sub-form with real-time feedback.
6. **1,000+ Record Seed Dataset**:
   - Generates 28 team members, 45 software engineering projects, and 1,000 realistic tasks across various priorities and timeline distributions.

---

## 🔄 Live Architecture Mode Switcher

| Mode | Command | Description |
| :--- | :--- | :--- |
| **🚀 Optimized** | `npm run switch:optimized` | Full clean architecture: URL sync (`?page=2`), debounced search, `DataTable` skeletons, 60 FPS. |
| **⚠️ No Query Params** | `npm run switch:no-query-params` | Demonstrates state loss on refresh (`F5`) and non-shareable URLs when pagination uses only local state. |
| **💥 Unoptimized** | `npm run switch:unoptimized` | Demonstrates main-thread blocking (`80ms - 200ms`), 1,000 unvirtualized DOM rows, and typing jank. |
| **🔁 Toggle** | `npm run switch:toggle` | Automatically cycles through the 3 modes. |

---

## ⚡ Quick Start

### 1. Clone & Install Dependencies
```bash
git clone git@github.com:pranaybomisco/demo-project.git
cd demo-project

# Install all workspace dependencies
npm run install:all
```

### 2. Environment Configuration
Create `.env` files from their respective examples:
```bash
# Backend configuration (PostgreSQL, Port, JWT Secret)
cp backend/.env.example backend/.env

# Frontend configuration (API Base URL)
cp frontend/.env.example frontend/.env
```

### 3. Seed Database (1,000+ Records)
```bash
npm run seed
```

### 4. Run Development Servers
```bash
npm run dev
```
* **Frontend Web App:** `http://localhost:5173` (or `http://localhost:3000` via Docker)
* **Backend API:** `http://localhost:5000/api`
* **Swagger API Documentation:** `http://localhost:5000/api/docs`

---

## 🐳 Docker Deployment
```bash
# Build and run containers in background
docker compose up -d --build

# Stop containers
docker compose down
```

---

## 🔑 Demo Login Credentials

All seeded demo accounts use password: `Password123!`

| Role | Email | Description |
| :--- | :--- | :--- |
| **Admin** | `admin@example.com` | Full administrative access across all projects, members, and tasks |
| **Manager** | `manager@example.com` | Project management, task assignment, and sprint organization |
| **Member** | `member@example.com` | Team member workspace, task updates, and progress tracking |

---

## 📜 Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Runs backend and frontend concurrently in development mode |
| `npm run seed` | Seeds the PostgreSQL database with 28 users, 45 projects, and 1,000 tasks |
| `npm run build` | Builds backend with `esbuild` and frontend with `Vite` for production |
| `npm run switch:optimized` | Activates clean architecture & URL query parameter synchronization |
| `npm run switch:no-query-params` | Activates local-state pagination demo without URL query parameters |
| `npm run switch:unoptimized` | Activates heavy unvirtualized DOM & in-render CPU blocking demo |
| `npm run switch:toggle` | Cycles through all 3 architecture modes |
| `npm run install:all` | Installs dependencies across root, backend, and frontend packages |
| `npm run docker:up` | Builds and starts multi-container Docker Compose environment |
| `npm run docker:down` | Stops and removes Docker Compose containers |
