# 🎨 Demo Frontend - React 18 & Redux Toolkit Clean Architecture

The frontend client for the **Demo** platform is a modern, high-performance Single Page Application (SPA) built with **React 18**, **Vite**, **Redux Toolkit**, and **Vanilla CSS (Glassmorphic Design System)**.

---

## 🏛️ Clean Directory Architecture

```
frontend/
├── src/
│   ├── app/                  # Application bootstrap & providers
│   │   ├── app.jsx           # Root provider mounting & layout
│   │   └── providers/        # AuthProvider, ThemeProvider, ToastProvider
│   │
│   ├── constants/            # Centralized string constants (ZERO magic strings)
│   │   ├── api.constants.js  # API endpoints & localStorage keys
│   │   ├── errors.constants.js # Centralized client error codes
│   │   ├── messages.constants.js # UI copy, headings, notifications
│   │   ├── routes.constants.js # Client route paths & path builders
│   │   ├── ui.constants.js   # Badges, labels, placeholders
│   │   └── index.js          # Barrel export
│   │
│   ├── handlers/             # Global error and response handling
│   │   ├── apiresponsehandler.js
│   │   └── globalerrorhandler.js
│   │
│   ├── hooks/                # Custom reusable hooks
│   │   └── useQueryParams.js # Two-way URL Search Param state synchronization
│   │
│   ├── pages/                # Declarative routing shells (Lean page components)
│   │   ├── dashboardpage.jsx
│   │   ├── loginpage.jsx
│   │   ├── notfoundpage.jsx
│   │   ├── profilepage.jsx
│   │   ├── projectdetailpage.jsx
│   │   ├── projectspage.jsx
│   │   ├── registerpage.jsx
│   │   └── taskspage.jsx
│   │
│   ├── redux/                # Redux Toolkit state management
│   │   ├── slices/           # authslice, projectslice, taskslice, dashboardslice
│   │   └── store.js          # Centralized store configuration
│   │
│   ├── routers/              # React Router v6 declarations
│   │   ├── approuter.jsx     # Route definitions
│   │   └── protectedroute.jsx # Route authentication & redirect guard
│   │
│   ├── services/             # Axios API service layer
│   │   ├── api.service.js    # Axios client with JWT interceptor
│   │   ├── auth.service.js
│   │   ├── dashboard.service.js
│   │   ├── project.service.js
│   │   └── task.service.js
│   │
│   ├── views/                # 🚀 OPTIMIZED: Domain presentation components
│   │   ├── auth/             # LoginView, RegisterView
│   │   ├── components/       # Common shared components (DataTable, FilterBar, FormModal, Skeleton, Pagination)
│   │   ├── dashboard/        # DashboardView & Metrics Widgets
│   │   ├── layout/           # AppLayout, Navbar, Sidebar, NotFoundView
│   │   ├── profile/          # ProfileView (Profile editing & password change)
│   │   ├── projects/         # ProjectsView, ProjectTableView, ProjectDetailView, ProjectModal
│   │   └── tasks/            # TasksView, TaskTableView, TaskBoardView, TaskModal
│   │
│   ├── unoptimized/          # ⚠️ UNOPTIMIZED: Tech-talk anti-pattern benchmark suite
│   │   ├── components/       # UnoptimizedTable, UnoptimizedFilterBar, UnoptimizedModal, PerformanceModeToggle
│   │   └── views/            # Unoptimized domain views (in-render blocking loops, 1,000 DOM rows)
│   │
│   ├── index.css             # Glassmorphic design tokens, utilities & skeleton shimmer
│   └── main.jsx              # Vite entrypoint
│
├── vercel.json               # SPA client route rewrites
├── vite.config.js            # Vite build configuration
└── package.json
```

---

## 🌟 Key Frontend Features

1. **Strict Page-to-View Separation**:
   - `src/pages/` components serve strictly as lean routing shells.
   - `src/views/` components handle 100% of UI presentation, data fetching, forms, and tables.
2. **Common Reusable Components**:
   - **`DataTable`**: Generic data table with sortable headers and custom cell renders.
   - **`FilterBar`**: Generic filter bar with 300ms debounced search, sort controls, and view toggles.
   - **`FormModal`**: Generic dialog wrapper with backdrop blur, submit handling, and responsive action buttons.
   - **`Skeleton`**: GPU-accelerated gradient wave shimmer animations matching exact table/card footprints.
3. **URL-Synchronized State (`useQueryParams`)**:
   - Two-way URL synchronization for pagination (`?page=2`), search (`?search=api`), sorting (`?sortBy=dueDate`), and view modes (`?view=table`).
   - Bookmarking, sharing URLs, and refreshing (`F5`) flawlessly preserves user state.
4. **Live Architecture Mode Switcher**:
   - Seamlessly toggle the entire application between **Optimized**, **No-Query-Params**, and **Unoptimized** modes.

---

## 🔄 Performance Architecture Modes

```bash
# 🚀 1. Fully Optimized Clean Architecture (URL sync, DataTable skeletons, 60 FPS)
npm run switch:optimized

# ⚠️ 2. Pagination WITHOUT URL Query Params (Local useState Only)
npm run switch:no-query-params

# 💥 3. Unoptimized Heavy Load (1,000 DOM rows + In-Render CPU Blocking)
npm run switch:unoptimized

# 🔁 4. Instant Mode Toggle
npm run switch:toggle
```

---

## 🚀 Available Scripts

```bash
# Start Vite development server (http://localhost:5173)
npm run dev

# Build production bundle with Vite
npm run build

# Preview production build locally
npm run preview

# Mode switcher commands
npm run switch:optimized
npm run switch:no-query-params
npm run switch:unoptimized
npm run switch:toggle
```
