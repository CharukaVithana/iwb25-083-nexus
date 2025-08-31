# Travel Helper Project

## Cloning the Repository

To get started, clone this project from GitHub:

```sh
git clone https://github.com/CharukaVithana/iwb25-083-nexus.git
cd iwb25-083-nexus
```

This repository contains the source code for the Travel Helper application, which helps users plan trips, explore destinations, and manage travel preferences. The project is organized into two main parts: a Next.js frontend and a Ballerina backend.

## Project Structure

- `frontend/` — Next.js frontend app
  - `app/` — Main application pages and API routes
  - `components/` — Reusable React components (UI, chat, hotel cards, etc.)
  - `hooks/` — Custom React hooks for authentication, currency, etc.
  - `lib/` — Utility functions and API helpers
  - `public/` — Static assets (images, etc.)
  - `styles/` — Global and component CSS
  - `travel-service/` — (if present) Additional service logic
- `backend/` — Ballerina backend services
  - `main.bal` — Main entry point for backend
  - `modules/` — Ballerina modules (e.g., MySQL integration)
  - `migrations/` — Database migration scripts
  - `seed/` — SQL seed data for attractions and restaurants
  - `Config.toml` — Configuration file for backend

## Setup Instructions

### 1. Clone the Repository

```sh
git clone <your-repo-url>
cd submission
```

### 2. Frontend Setup

```sh
cd frontend
pnpm install  # or npm install
```

- Configure environment variables if needed (e.g., `.env.local`).
- To start the development server:

```sh
pnpm dev  # or npm run dev
```

### 3. Backend Setup

```sh
cd backend
ballerina build
```

- Copy `Config.sample.toml` to `Config.toml` and update with your database credentials and other settings.
- To run the backend service:

```sh
ballerina run main.bal
```

### 4. Database Setup

- Use the SQL files in `backend/seed/` to seed your database with initial data.
- Run migrations in `backend/migrations/` if needed.

## Usage

- Access the frontend at `http://localhost:3000` (default Next.js port).
- The backend will run on the port specified in your `Config.toml`.
- The frontend communicates with the backend for chat, hotel, and explore features.

## Technologies Used

- **Frontend:** Next.js, React, TypeScript, Tailwind CSS
- **Backend:** Ballerina, MySQL

## License

MIT
