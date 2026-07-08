# TaskFlow AI – Full Stack Task Tracker

A modern full-stack task management application built for the **Software Engineer (Full Stack, Backend Focused)** take-home assignment.

[![CI](https://github.com/thidaswick/take-home-assignment/actions/workflows/ci.yml/badge.svg)](https://github.com/thidaswick/take-home-assignment/actions/workflows/ci.yml)

---

## Overview

**TaskFlow AI** helps teams create, assign, and track work in real time. The backend exposes a secure REST API with JWT auth and SignalR updates; the React frontend delivers dashboards, task management, admin tooling, and an optional AI assistant powered by Google Gemini.

---

## Features

- User registration and login
- JWT authentication
- Role-based access control (**User** / **Admin**)
- Task CRUD (create, read, update, delete)
- Pagination and filtering (status, owner)
- **Cancelled** task status for duplicate / out-of-scope work
- Real-time task updates with **SignalR**
- React frontend with dark mode
- SQL Server database (EF Core migrations)
- Swagger API documentation
- Optional AI task assistant (Gemini)
- GitHub Actions CI (build, lint, tests)

---

## Tech Stack

| Area | Technologies |
|------|----------------|
| **Backend** | ASP.NET Core 8, C#, EF Core, SQL Server, SignalR, JWT, FluentValidation |
| **Frontend** | React, TypeScript, Vite, TanStack Router, Tailwind CSS, shadcn/ui |
| **Testing** | xUnit integration tests |
| **Tools** | Swagger, GitHub Actions, VS Code `.http` files |

---

## Project Structure

```
take-home-assignment/
├── backend/
│   ├── src/
│   │   ├── TaskTracker.API/           # Controllers, SignalR hub, Swagger, JWT
│   │   ├── TaskTracker.Application/   # Use cases, DTOs, validators, handlers
│   │   ├── TaskTracker.Domain/        # Entities, enums, domain rules
│   │   └── TaskTracker.Infrastructure/# EF Core, repositories, AI, auth
│   ├── tests/
│   │   └── TaskTracker.Tests/         # Integration tests (in-memory DB)
│   ├── scripts/                       # Database helper scripts
│   └── TaskTracker.sln
├── frontend/
│   ├── src/
│   │   ├── routes/                    # App pages (dashboard, tasks, admin, AI)
│   │   ├── components/                # UI + app components
│   │   └── lib/                       # API client, auth, realtime, theme
│   └── package.json
└── .github/workflows/ci.yml           # Backend + frontend CI pipeline
```

**Architecture:** Clean Architecture on the backend — API → Application → Domain ← Infrastructure.

---

## Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download)
- [Node.js 20+](https://nodejs.org/)
- SQL Server (LocalDB or full instance)
- *(Optional)* Google Gemini API key for AI suggestions

---

## Quick Start

### 1. Backend

```bash
cd backend
dotnet restore
dotnet build
dotnet ef database update --project src/TaskTracker.Infrastructure --startup-project src/TaskTracker.API
dotnet run --project src/TaskTracker.API --launch-profile http
```

| Service | URL |
|---------|-----|
| API | http://localhost:5108 |
| **Swagger** | http://localhost:5108/swagger |
| Health | http://localhost:5108/health |

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:8081** (or the port Vite prints).

Set `VITE_API_URL=http://localhost:5108/api` in `.env` if needed (see `.env.example`).

---

## Admin Login

A default admin account is seeded on first startup if no admin exists:

| Field | Value |
|-------|-------|
| **Email** | `admin@taskflow.ai` |
| **Password** | `Admin123!` |

Use this account to access the admin dashboard, user list, and owner assignment features.

---

## API Testing (Swagger)

1. Start the backend and open http://localhost:5108/swagger
2. Call `POST /api/auth/login` with the admin credentials above
3. Click **Authorize** and enter: `Bearer <your-jwt-token>`
4. Test tasks, users, and AI endpoints

You can also use `backend/src/TaskTracker.API/TaskTracker.API.http` from VS Code or Rider.

---

## Running Tests

```bash
cd backend
dotnet test TaskTracker.sln
```

Integration tests cover authentication, task CRUD, and role-based access control using an in-memory database.

```bash
cd frontend
npm run lint
npm run build
```

---

## Configuration

Backend settings live in `backend/src/TaskTracker.API/appsettings.json`:

- `ConnectionStrings:DefaultConnection` — SQL Server
- `Jwt:*` — token signing and expiry
- `Gemini:*` — optional AI integration

For Gemini locally:

```bash
cd backend/src/TaskTracker.API
dotnet user-secrets set "Gemini:ApiKey" "YOUR_KEY_HERE"
```

---

## CI/CD

GitHub Actions (`.github/workflows/ci.yml`) runs on every push to `main`:

- **Backend** — restore, build, test
- **Frontend** — `npm ci`, lint, build

---

## License

MIT
