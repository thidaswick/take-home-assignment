# Task Tracker — Take-Home Assignment

Full-stack task management app built with **ASP.NET Core 8** (backend) and **React + TypeScript** (frontend).

## Features

- User registration, login, JWT authentication, logout
- Role-based access control (**User** / **Admin**)
- Task CRUD with pagination and filtering (status, owner)
- SignalR real-time task updates
- FluentValidation + global exception handling
- Swagger API documentation
- Gemini AI task suggestions (optional bonus)
- GitHub Actions CI (build, lint, tests)

## Project structure

```
take-home-assignment/
├── backend/                 # ASP.NET Core API (Clean Architecture)
├── frontend/                # React + Vite + TanStack Router
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

| Service | URL |
|---------|-----|
| API | http://localhost:5108 |
| **Swagger UI** | **http://localhost:5108/swagger** |

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
copy .env.example .env
npm install
npm run dev
```

Frontend runs at **http://localhost:5173** (Vite default).

### Environment variables

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API base URL (default `http://localhost:5108/api`) |

## API testing (Swagger)

Use **Swagger UI** at http://localhost:5108/swagger to explore and test all endpoints:

1. Call `POST /api/auth/login` with admin credentials
2. Click **Authorize** and paste the JWT as `Bearer <token>`
3. Test tasks, users, and AI endpoints

You can also use `backend/src/TaskTracker.API/TaskTracker.API.http` from VS Code / Rider.

## Running tests

```powershell
cd backend
dotnet test TaskTracker.sln
```

Integration tests use an in-memory database and cover auth, task CRUD, and RBAC.

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
- **Swagger** used for API documentation and manual testing (instead of Postman)
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

## CI/CD

GitHub Actions workflow (`.github/workflows/ci.yml`) runs on push/PR to `main`:

- **Backend:** restore, build, test
- **Frontend:** `npm ci`, lint, build

## Hosting (QA demo)

See **[DEPLOY.md](./DEPLOY.md)** for deploying:

- Frontend → **Vercel**
- Backend + SQL Server → **Railway**

## License

MIT
