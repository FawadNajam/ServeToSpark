## API Overview

Base URL: `http://localhost:4000/api`

### Authentication

- **POST** `/auth/register` – Register a new user (default role: `user`).
- **POST** `/auth/login` – Login and receive a JWT access token.

### Users

- **GET** `/users` – List all users (auth required).
- **GET** `/users/:id` – Get a single user.
- **PUT** `/users/:id` – Update user profile (self or admin).

### Services & Categories

- **GET** `/services` – List services, optional `?categoryId`.
- **GET** `/services/:id` – Get a service.
- **POST** `/services` – Create service (admin only).
- **PUT** `/services/:id` – Update service (admin only).
- **DELETE** `/services/:id` – Delete service (admin only).

- **GET** `/categories` – List service categories.
- **POST** `/categories` – Create category (admin only).

### Bookings

- **POST** `/bookings` – Create booking for a service (auth required).
- **GET** `/bookings` – List bookings for current user.
- **GET** `/bookings/:id` – Get booking (user, assigned provider, or admin).
- **PATCH** `/bookings/:id/status` – Update booking status.

### Admin

- **GET** `/admin/dashboard` – Summary statistics.
- **GET** `/admin/users` – List all users.
- **GET** `/admin/bookings` – List all bookings.

### Provider

- **GET** `/provider/bookings/requests` – Pending unassigned bookings a provider can accept.
- **GET** `/provider/bookings` – Bookings assigned to current provider.
- **PATCH** `/provider/bookings/:id/status` – Update booking status.

