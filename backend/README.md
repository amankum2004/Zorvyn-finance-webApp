# Finance Data Processing and Access Control Backend

A clean, role-aware backend for a finance dashboard. It supports user management, transaction CRUD, analytics endpoints, and strict access control with JWT authentication.

## Features
- Role-based access control (Admin, Analyst, Viewer)
- JWT authentication with login/register
- User management (admin only)
- Transaction CRUD with filtering + pagination
- Dashboard analytics (summary, categories, trends, recent activity)
- Input validation and consistent error responses
- SQLite persistence (local `finance.db`)

## Roles and Permissions
Default roles are synchronized on startup.

### Admin
- Manage users
- Create/update/delete transactions
- View all transactions
- View dashboard analytics

### Analyst
- Create/update/delete transactions
- View all transactions
- View dashboard analytics

### Viewer
- View dashboard analytics only

> Note: self-registration does **not** allow creating admin accounts.

## Tech Stack
- Node.js + Express
- SQLite (via `sqlite` + `sqlite3`)
- JWT auth (`jsonwebtoken`)
- Validation (`express-validator`)

## Setup
```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:
```bash
PORT=3000
JWT_SECRET=your-super-secret
JWT_EXPIRE=7d
NODE_ENV=development
```

Run the server:
```bash
npm start
# or
npm run dev
```

The API will be available at `http://localhost:3000/api` and a health check at `http://localhost:3000/health`.

## Data Persistence
SQLite database is stored at `backend/finance.db`.
Default roles are synced on startup to ensure permissions match the expected model.

If you need a fresh database, delete `backend/finance.db` and restart the server.

## API Overview
All protected routes require `Authorization: Bearer <token>`.

### Auth
- `POST /api/auth/register`
  - Registers a new user (viewer by default). Optional `role_id` is allowed **only** for non-admin roles.
- `POST /api/auth/login`

### Users (admin only)
- `GET /api/users`
- `GET /api/users/:id`
- `POST /api/users`
- `PUT /api/users/:id`
- `DELETE /api/users/:id`

### Transactions
- `GET /api/transactions`
  - Query params: `type`, `category`, `start_date`, `end_date`, `page`, `limit`
- `GET /api/transactions/:id`
- `POST /api/transactions`
- `PUT /api/transactions/:id`
- `DELETE /api/transactions/:id`

### Dashboard
- `GET /api/dashboard/summary`
- `GET /api/dashboard/categories`
- `GET /api/dashboard/trends`
- `GET /api/dashboard/recent`

## Access Control Summary
- Viewer: dashboard analytics only
- Analyst: transactions + dashboard
- Admin: full access

## Assumptions
- Viewer users should not access transaction data.
- Analysts can view all transactions (not just their own).
- Admin accounts are created by existing admins via `/api/users`.

## Error Handling
Validation errors return 400 with structured field messages.
Auth errors return 401/403.
Unexpected errors return 500 with a safe error message.

## Optional Enhancements (Not Implemented)
- Rate limiting
- Soft delete
- Automated tests
- OpenAPI/Swagger docs
