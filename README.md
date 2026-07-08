# Task Tracker — Take-Home Assignment

Full-stack task management app built with **ASP.NET Core 8** (backend) and **React + TypeScript** (frontend).

## Features

- User registration, login, JWT authentication, logout
- Role-based access control (**User** / **Admin**)
- Task CRUD with pagination and filtering (status, owner)
- SignalR real-time task updates
- FluentValidation + global exception handling
- Gemini AI task suggestions (optional bonus)
- GitHub Actions CI (build, lint, tests)

## Project structure

```
take-home-assignment/
├── backend/                 # ASP.NET Core API (Clean Architecture)
├── frontend/                # React + Vite + TanStack Router
├── docs/postman/            # Postman collection + environment
└── .github/workflows/ci.yml # CI pipeline
```

## Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download)
- [Node.js 20+](https://nodejs.org/)
- SQL Server (LocalDB or full instance)
- (Optional) Google Gemini API key for AI suggestions

## Backend setup

```powershell
cd backend
dotnet restore
dotnet ef database update --project src/TaskTracker.Infrastructure --startup-project src/TaskTracker.API
dotnet run --project src/TaskTracker.API
```

API runs at **http://localhost:5108**  
Swagger UI: **http://localhost:5108/swagger**

### Configuration

Connection string and JWT settings live in `backend/src/TaskTracker.API/appsettings.json`.

On first startup, a default admin account is seeded if none exists:

| Email | Password |
|-------|----------|
| `admin@taskflow.ai` | `Admin123!` |

### Gemini AI (optional)

```powershell
cd backend/src/TaskTracker.API
dotnet user-secrets set "Gemini:ApiKey" "YOUR_KEY_HERE"
```

## Frontend setup

```powershell
cd frontend
cp .env.example .env
npm install
npm run dev
```

Frontend runs at **http://localhost:5173** (Vite default).

### Environment variables

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API base URL (default `http://localhost:5108/api`) |

## Running tests

```powershell
cd backend
dotnet test TaskTracker.sln
```

Integration tests use an in-memory database and cover auth, task CRUD, and RBAC.

## Postman

Import these files into Postman:

- `docs/postman/TaskTracker.postman_collection.json`
- `docs/postman/TaskTracker.postman_environment.json`

1. Run **Auth → Login** (uses seeded admin credentials) — saves `accessToken` automatically
2. Call task and user endpoints with the saved token

## Architecture

Clean Architecture with four layers:

| Layer | Project | Responsibility |
|-------|---------|----------------|
| API | `TaskTracker.API` | Controllers, SignalR hub, JWT middleware, Swagger |
| Application | `TaskTracker.Application` | Use cases, DTOs, validators, authorization rules |
| Domain | `TaskTracker.Domain` | Entities, enums, business rules |
| Infrastructure | `TaskTracker.Infrastructure` | EF Core, repositories, Gemini AI, auth services |

## Design decisions

- **CQRS-style handlers** for task commands/queries keep controllers thin
- **JWT + role claims** for stateless auth; `TaskAuthorization` enforces ownership rules in handlers
- **Admin-only** `GET /api/users` for the admin dashboard and owner assignment UI
- **SignalR** broadcasts `TaskCreated`, `TaskUpdated`, `TaskDeleted` to subscribed clients
- **Database seeder** creates a default admin when none exists (dev/demo convenience)

## Assumptions

- SQL Server is available locally with Windows authentication (adjust connection string if needed)
- Real-time updates use a single `tasks` SignalR group (no per-user channels)
- Frontend pagination on the tasks page is client-side; the API supports server-side pagination
- AI suggestions require a valid Gemini API key; the app works without it for non-AI flows

## Future improvements

- Docker Compose for backend + SQL Server + frontend
- More granular SignalR groups (per user / per team)
- End-to-end tests with Playwright
- Admin endpoint to promote users without direct DB access
- Email notifications for task assignments

## CI/CD

GitHub Actions workflow (`.github/workflows/ci.yml`) runs on push/PR to `main`:

- **Backend:** restore, build, test
- **Frontend:** `npm ci`, lint, build

## License

MIT
