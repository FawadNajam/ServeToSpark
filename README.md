# On-Demand Service Application (ServeToSpark)

A full-stack **on-demand service marketplace** (similar to Urban Company or Uber for services) where users book services, providers accept/reject jobs, and admins manage the platform.

---

## Project Overview

- **Users** browse services, book a service, and track their requests.
- **Service providers** view booking requests, accept or reject jobs, and update booking status.
- **Admins** manage users, services, categories, pricing, and bookings via a web dashboard.

The repository contains:

| Folder         | Description                                                                                       |
| -------------- | ------------------------------------------------------------------------------------------------- |
| `backend/`     | Node.js + Express + TypeScript REST API with MySQL (Sequelize)                                    |
| `admin-panel/` | Next.js admin dashboard (login, dashboard, users, services, categories, bookings)                 |
| `website/`     | **Customer-facing website** — browse services, book, track bookings, profile (Next.js, port 3001) |
| `database/`    | MySQL schema (`schema.sql`) and ER diagram reference                                              |
| `docs/`        | API overview and Postman collection                                                               |

---

## Tech Stack

| Layer                | Technologies                                                                          |
| -------------------- | ------------------------------------------------------------------------------------- |
| **Backend**          | Node.js, TypeScript, Express.js, MySQL, Sequelize ORM, JWT, bcrypt, express-validator |
| **Admin Panel**      | Next.js 14 (App Router), TypeScript, React Query, Axios, Tailwind CSS                 |
| **Customer Website** | Next.js 14 (App Router), TypeScript, React Query, Axios, Tailwind CSS                 |
| **Database**         | MySQL 8 (relational schema: roles, users, services, service_categories, bookings)     |

---

## Prerequisites

- **Node.js** 18+
- **MySQL** 8 (local or remote)
- **npm** or **yarn**

---

## Setup Instructions

### 1. Database

Create the database and tables:

```bash
# Log into MySQL and run:
mysql -u root -p < database/schema.sql

# Or from MySQL shell:
source /path/to/ServeToSpark/database/schema.sql;
```

Ensure MySQL is running and note your `DB_USER`, `DB_PASSWORD`, and `DB_NAME` (default: `on_demand_service_db`).

### 2. Backend

```bash
cd backend
cp .env.example .env
# Edit .env with your DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, and JWT_SECRET.

npm install
npm run dev
```

API runs at **http://localhost:4000**. Base path for APIs: **http://localhost:4000/api**.

### 3. Admin Panel

```bash
cd admin-panel
cp .env.example .env.local
# Set NEXT_PUBLIC_API_BASE_URL=http://localhost:4000/api (if different)

npm install
npm run dev
```

Open **http://localhost:3000**. Log in with an **admin** account (create one first via API or Postman).

### 4. Customer Website

```bash
cd website
cp .env.example .env.local
# Set NEXT_PUBLIC_API_BASE_URL=http://localhost:4000/api (if different)

npm install
npm run dev
```

Open **http://localhost:3001**. Customers can sign up, browse services, book a service, view **My Bookings**, and manage **Profile**. Use the same backend; ensure backend and database are running.

---

## Sample Credentials

Create an admin user first (e.g. via Postman or curl):

```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Admin User","email":"admin@example.com","password":"password123","role":"admin"}'
```

Then log in:

| Role  | Email             | Password    |
| ----- | ----------------- | ----------- |
| Admin | admin@example.com | password123 |

Use the same credentials on the **Admin Panel** login page at http://localhost:3000/login.

For **customers** and **providers**, register via the API with `"role": "user"` or `"role": "provider"` (or omit `role` for default customer). You can also **Sign up** on the customer website at http://localhost:3001/register.

---

## API Documentation

- **Overview:** [docs/api_overview.md](docs/api_overview.md)
- **Postman:** Import [docs/postman_collection.json](docs/postman_collection.json) and set variable `baseUrl` = `http://localhost:4000/api`. Use the **Login** request and copy the returned `token` into `accessToken` for protected routes.

---

## Database Schema

- **SQL file:** [database/schema.sql](database/schema.sql)
- **ER diagram:** See `database/er-diagram.txt` for the diagram asset path.

Main tables: `roles`, `users`, `service_categories`, `services`, `bookings` with foreign keys and enums for role and booking status.

---

## Repository Structure

```
ServeToSpark/
├── backend/          # Express + Sequelize API
├── admin-panel/      # Next.js admin dashboard (port 3000)
├── website/          # Customer-facing website (port 3001)
├── database/         # schema.sql, ER diagram
├── docs/             # api_overview.md, postman_collection.json
└── README.md
```

---

## License

Private / personal project.
