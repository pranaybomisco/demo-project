# ⚙️ Demo Backend - Node.js ESM Clean Architecture

The backend service for the **Demo** platform is an enterprise-grade RESTful API built in pure **JavaScript (ES Modules)**, following a strict **Model-View-Controller-Service (MVC+S)** layered architecture with PostgreSQL data access via Sequelize.

---

## 🏛️ Layered Directory Architecture

```
backend/
├── src/
│   ├── config/               # Database connection (Sequelize & pg.Pool), env loader
│   │   ├── db.js             # PostgreSQL connection pool with retry logic
│   │   ├── env.js            # Environment validation
│   │   └── logger.js         # Standardized structured console logging
│   │
│   ├── constants/            # Centralized string constants (ZERO magic strings)
│   │   ├── app.constants.js  # App defaults, pagination limits, roles, task enums
│   │   ├── errors.constants.js # Standard error codes and user-friendly error messages
│   │   ├── http.constants.js # HTTP Status Codes, Methods, Header keys
│   │   ├── messages.constants.js # Domain success & operation messages
│   │   ├── routes.constants.js # API Route paths and URL builders
│   │   └── index.js          # Barrel export
│   │
│   ├── controllers/          # HTTP request handlers (Parses input -> Calls service -> Responds)
│   │   ├── auth.controller.js
│   │   ├── dashboard.controller.js
│   │   ├── project.controller.js
│   │   └── task.controller.js
│   │
│   ├── errors/               # Custom error domain & global error handling
│   │   ├── apperror.js       # AppError, NotFoundError, ValidationError, AuthError
│   │   └── errorhandler.js   # Centralized Express error handler middleware
│   │
│   ├── middlewares/          # Request interceptors & guards
│   │   ├── auth.middleware.js # JWT authentication & role-based access control (RBAC)
│   │   ├── requestlogger.middleware.js # Request timing & status logging
│   │   └── validator.middleware.js # Input schema validators
│   │
│   ├── models/               # Sequelize ORM schema definitions & relations
│   │   ├── user.model.js     # User entity (auth, roles)
│   │   ├── project.model.js  # Project entity (owner, metadata)
│   │   ├── projectmember.model.js # Multi-user team project membership join table
│   │   ├── task.model.js     # Task ticket entity (status, priority, assignee, due date)
│   │   ├── seed.js           # 1,000+ Record bulk database seeder
│   │   └── index.js          # Model associations & initDb()
│   │
│   ├── routes/               # Express router mounting
│   │   ├── auth.routes.js    # /api/auth endpoints (login, register, me, updateProfile)
│   │   ├── dashboard.routes.js # /api/dashboard metrics
│   │   ├── project.routes.js # /api/projects CRUD & membership management
│   │   ├── task.routes.js    # /api/tasks CRUD, filtering, pagination, sorting
│   │   └── index.js          # Global API router
│   │
│   ├── services/             # Business logic layer (Pure domain rules, validation & DB queries)
│   │   ├── auth.service.js
│   │   ├── dashboard.service.js
│   │   ├── project.service.js
│   │   └── task.service.js
│   │
│   ├── swagger/              # Interactive OpenAPI 3.0 Documentation
│   │   ├── swagger.config.js # Swagger UI mounting
│   │   └── swagger.yaml      # OpenAPI 3.0 spec definition
│   │
│   ├── utils/                # Pure utility functions
│   │   ├── jwt.util.js       # Token signing & verification
│   │   ├── password.util.js  # bcrypt hashing & comparison
│   │   └── response.util.js  # Standard JSON response formatting
│   │
│   ├── app.js                # Express app configuration & middleware pipeline
│   └── server.js             # HTTP server entrypoint
│
├── api/
│   └── index.js              # Vercel Serverless Function entrypoint
├── build.js                  # Production esbuild bundler
└── package.json
```

---

## 🔑 Key Engineering Principles

1. **Zero Magic Strings**:
   - Hardcoded strings, routes, error codes, HTTP statuses, and default limits are strictly defined in `src/constants/`.
2. **Layered Separation of Concerns**:
   - Controllers only handle HTTP translation and validation.
   - Services contain 100% of business rules and never touch `req` or `res`.
   - Models isolate database schema definitions and SQL queries.
3. **Interactive Swagger Docs (`/api/docs`)**:
   - Live OpenAPI 3.0 documentation with interactive request execution.
4. **Fast 1,000+ Record Database Seeding**:
   - Uses Sequelize `bulkCreate` with chunking to generate 28 users, 45 projects, and 1,000 tasks in < 1 second.

---

## ⚡ API Endpoints Reference

### Authentication (`/api/auth`)
* `POST /api/auth/register` — Register a new user account
* `POST /api/auth/login` — Sign in and receive JWT token
* `POST /api/auth/logout` — Invalidate user session
* `GET /api/auth/me` — Fetch currently authenticated user profile
* `PUT /api/auth/me` — Update profile information & change password

### Projects (`/api/projects`)
* `GET /api/projects` — List projects (supports `page`, `limit`, `search`, `sortBy`, `sortOrder`)
* `GET /api/projects/:id` — Get project details with owner and team members
* `POST /api/projects` — Create project (Admin/Manager only)
* `PUT /api/projects/:id` — Update project details
* `DELETE /api/projects/:id` — Delete project
* `POST /api/projects/:id/members` — Add team member to project
* `DELETE /api/projects/:id/members/:userId` — Remove team member from project

### Tasks (`/api/tasks`)
* `GET /api/tasks` — List tasks (supports `page`, `limit`, `search`, `status`, `priority`, `projectId`, `sortBy`, `sortOrder`)
* `GET /api/tasks/:id` — Get single task details
* `POST /api/tasks` — Create a new task ticket
* `PUT /api/tasks/:id` — Update task details
* `DELETE /api/tasks/:id` — Delete task

### Dashboard (`/api/dashboard`)
* `GET /api/dashboard` — Aggregated overview metrics, status breakdown, priority distribution, overdue tasks, and recent activity.

---

## 🚀 Available Scripts

```bash
# Start backend in development mode with live reload
npm run dev

# Seed database with 1,000+ records
npm run seed

# Build production bundle with esbuild
npm run build

# Start production server
npm start
```
