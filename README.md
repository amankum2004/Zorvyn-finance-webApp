# Zorvyn Finance WebApp

A full-stack finance dashboard with role-based access control, transaction management, and analytics. The backend is Express + SQLite with JWT auth; the frontend is React + Vite + Tailwind.

**Status**
This repo includes a working backend and frontend with demo data and a documented API. It is suitable for the assessment described in the prompt (backend design, access control, validation, and analytics).

**Tech Stack**
- Backend: Node.js, Express, SQLite, JWT, bcrypt, express-validator
- Frontend: React, Vite, Tailwind CSS, Axios

**Repo Structure**
- `backend/` Backend API and SQLite database
- `frontend/` React client

**Quick Start**
1. Backend install:
```bash
cd backend
npm install
```

2. Backend env file:
```bash
PORT=3000
JWT_SECRET=your-super-secret
JWT_EXPIRE=7d
NODE_ENV=development
```
Save that in `backend/.env`.

3. Start backend:
```bash
npm start
# or
npm run dev
```

4. Frontend install:
```bash
cd ../frontend
npm install
```

5. Frontend env (optional, only if backend is not on port 3000):
```bash
REACT_APP_API_URL=http://localhost:3000/api
```
Save that in `frontend/.env`.

6. Start frontend:
```bash
npm run dev
```

Frontend: `http://localhost:5173`
Backend: `http://localhost:3000`
Health check: `http://localhost:3000/health`

**Demo Accounts**
These are stored in `backend/finance.db`:
- Admin: `admin@example.com` / `admin123`
- Analyst: `analyst@example.com` / `analyst123`
- Viewer: `viewer@example.com` / `viewer123`

If you delete `backend/finance.db`, these accounts will be removed. You can re-register users via the API and create an admin through the admin user endpoint.

**Roles and Access Control**
- Admin: full access to users, transactions, and dashboard
- Analyst: transactions + dashboard access
- Viewer: dashboard only

Self-registration does not allow creating admin accounts.

**Backend API**
All protected routes require `Authorization: Bearer <token>`.

Auth:
- `POST /api/auth/register` Create a new user (viewer by default)
- `POST /api/auth/login` Login and receive token

Users (admin only):
- `GET /api/users` List users
- `GET /api/users/:id` Get user
- `POST /api/users` Create user
- `PUT /api/users/:id` Update user
- `DELETE /api/users/:id` Delete user

Transactions:
- `GET /api/transactions` List transactions with filters and pagination
- `GET /api/transactions/:id` Get one transaction
- `POST /api/transactions` Create transaction
- `PUT /api/transactions/:id` Update transaction
- `DELETE /api/transactions/:id` Delete transaction

Dashboard:
- `GET /api/dashboard/summary` Totals and net balance
- `GET /api/dashboard/categories` Category totals
- `GET /api/dashboard/trends` Monthly trends
- `GET /api/dashboard/recent` Recent activity

**Filtering and Pagination**
Transaction listing supports:
- `type` (income, expense)
- `category`
- `start_date` (YYYY-MM-DD)
- `end_date` (YYYY-MM-DD)
- `page` (default 1)
- `limit` (default 50)

**Data Model**
Users:
- `id`, `username`, `email`, `password_hash`, `role_id`, `status`, timestamps

Roles:
- `id`, `name`, `permissions`

Transactions:
- `id`, `user_id`, `amount`, `type`, `category`, `date`, `description`, timestamps

**Validation and Errors**
- Validation errors return 400 with field details
- Unauthorized requests return 401
- Forbidden actions return 403
- Not found returns 404
- Server errors return 500

**Rate Limiting**
Basic API rate limiting is enabled (200 requests per 15 minutes per IP) on `/api/*`.

**Soft Delete**
Transactions are soft-deleted using a `deleted_at` timestamp. Deleted records are hidden from lists and analytics.

**OpenAPI / Swagger**
Interactive API docs are available at `http://localhost:3000/api/docs`.

**Automated Tests**
Backend tests use Jest + Supertest. Run:
```bash
cd backend
npm test
```

**Persistence**
SQLite database is stored at `backend/finance.db`. Roles are synced on startup so permissions remain correct.

**Assumptions**
- Viewer users cannot access transactions
- Analysts can view all transactions
- Admin accounts are created via the users endpoint

**Optional Enhancements Not Implemented**
- API rate limiting tuning
- Soft delete restore endpoints
- CI workflow for tests
