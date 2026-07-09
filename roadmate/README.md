# Roadmate

Roadmate is a platform containing a Customer App, Vendor App, Admin Web, and a backend server.

## Apps Included
- Customer App (Expo React Native)
- Vendor App (Expo React Native)
- Admin Web (Vite + React)
- Backend (Node.js + Express)

## Tech Stack
- Frontend (Mobile): Expo, React Native, JavaScript
- Frontend (Web): React, Vite, Tailwind CSS, JavaScript
- Backend: Node.js, Express.js
- Database: PostgreSQL, Prisma ORM
- Notifications: FCM (Firebase Cloud Messaging)
- Storage: Cloudinary

## Phase 0 Goal
The goal of this phase is to establish the basic monorepo structure, set up backend and frontends, configure Prisma, and verify connectivity between all apps and the backend.

## Setup Steps

### 1. Database Setup
Make sure PostgreSQL is running locally.

### 2. Environment Setup
Copy the `.env.example` files to `.env` in each workspace:
- `server/.env`
- `apps/customer-app/.env`
- `apps/vendor-app/.env`
- `apps/admin-web/.env`

Update `server/.env` with your PostgreSQL connection URL and other required keys (Cloudinary, Firebase, JWT secrets).

### 3. Install Dependencies
Run from the root directory:
```bash
npm install
```

### 4. Database Setup
```bash
npm run db:migrate
npm run db:seed
```

### 5. Run Backend
```bash
npm run dev:server
```

### 6. Run Customer App
```bash
npm run dev:customer
```

### 7. Run Vendor App
```bash
npm run dev:vendor
```

### 8. Run Admin Web
```bash
npm run dev:admin
```

## Connectivity Test Checklist
- [ ] Backend runs on port 5000.
- [ ] Admin Web can call `GET /api/health` and display "Admin Web Connected".
- [ ] Customer App can call `GET /api/health` and display "Customer App Connected".
- [ ] Vendor App can call `GET /api/health` and display "Vendor App Connected".
- [ ] Seed data is inserted in PostgreSQL.
