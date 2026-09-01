# 🚀 Demo - Enterprise Task & Project Architecture

A modern, full-stack, enterprise-grade **Project and Task Management Platform** built with **JavaScript (ES Modules)**, demonstrating clean MVC + Service architecture, PostgreSQL data access with Sequelize, Redux Toolkit state management, interactive Swagger API documentation, table shimmer skeletons, and centralized constant management (zero magic strings).

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
│   │   ├── views/            # Layered presentation components (auth, dashboard, projects, tasks, profile, components)
│   │   ├── pages/            # Declarative page shells (Dashboard, Projects, Tasks, Profile, Login, Register)
│   │   ├── index.css         # Modern glassmorphism design system & skeleton animations
│   │   └── main.jsx          # Frontend entrypoint
│   └── package.json
│
├── postgres/                 # Docker Compose PostgreSQL service
├── docker-compose.yml        # Multi-container orchestration
└── package.json              # Monorepo root workspace scripts
```

---

## 🌟 Key Features & Highlights

1. **Clean Layered Separation of Concerns**:
   - **Pages (`src/pages/`)**: Declarative shells handling routing.
   - **Views (`src/views/`)**: Domain presentation views, widgets, form modals, table views, and kanban boards.
   - **Services & Handlers (`src/services/`, `src/handlers/`)**: Decoupled network and error mapping.
2. **Interactive Query Parameters & Table Skeletons**:
   - URL-synchronized pagination (`?page=`, `?limit=`), search query, sorting (`?sortBy=`, `?sortOrder=`), and view modes (`?view=grid` / `?view=table`).
   - Smooth, non-intrusive shimmering skeleton loading states across all tables and cards.
3. **Collapsible Sidebar & Mobile Hamburger Drawer**:
   - Responsive collapsible navigation sidebar with icon mode and mobile glassmorphic backdrop.
4. **Editable User Profiles**:
   - Update full name, email address, and toggleable password change sub-form with real-time feedback.
5. **1,000+ Record Seed Dataset**:
   - Generates 28 team members, 45 software engineering projects, and 1,000 realistic tasks across various priorities and timeline distributions.
6. **Zero Magic Strings**:
   - Every route, API endpoint, message, error code, label, and role is defined in centralized constants.

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
| `npm run install:all` | Installs dependencies across root, backend, and frontend packages |
| `npm run docker:up` | Builds and starts multi-container Docker Compose environment |
| `npm run docker:down` | Stops and removes Docker Compose containers |
