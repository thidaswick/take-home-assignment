# Deploy guide — Vercel (frontend) + Railway (backend + SQL)

This app has two parts. Deploy **backend first**, then **frontend**.

```
Frontend (Vercel)  →  https://your-app.vercel.app
Backend  (Railway) →  https://your-api.up.railway.app
Database (Railway) →  PostgreSQL (Railway) or SQL Server (local dev)
```

---

## 1) Prepare GitHub

1. Commit and push the latest code to `main`.
2. Confirm these files exist:
   - `backend/Dockerfile`
   - `backend/railway.toml`
   - `frontend/vercel.json`

---

## 2) Railway — database + API

### A. Create project

1. Go to [railway.com](https://railway.com) → **New Project**
2. Choose **Deploy from GitHub repo** → select `take-home-assignment`

### B. Add PostgreSQL database

Railway’s database menu includes **PostgreSQL** (not Microsoft SQL Server). The API auto-detects PostgreSQL and uses it on Railway.

1. In the Railway project → **+ New** → **Database** → **PostgreSQL**
2. Open the DB service → **Variables** and copy **`DATABASE_URL`**

Example shape:

```text
postgresql://postgres:PASSWORD@HOST:5432/railway
```

Local development still uses SQL Server via `appsettings.json`.

### C. Deploy the API service

1. **+ New** → **GitHub Repo** (same repo) **or** add a service from the monorepo
2. Set **Root Directory** to `backend`
3. Railway should detect `Dockerfile` + `railway.toml`
4. Generate a public domain: service → **Settings** → **Networking** → **Generate Domain**

### D. Set API environment variables

In the **API** service → **Variables**:

| Variable | Value |
|----------|--------|
| `ASPNETCORE_ENVIRONMENT` | `Production` |
| `ASPNETCORE_URLS` | `http://+:8080` |
| `ConnectionStrings__DefaultConnection` | *(paste PostgreSQL `DATABASE_URL`, or `${{Postgres.DATABASE_URL}}`)* |
| `Jwt__Key` | long random string, **at least 32 characters** |
| `Jwt__Issuer` | `TaskTracker` |
| `Jwt__Audience` | `TaskTracker` |
| `Jwt__ExpirationMinutes` | `60` |
| `Cors__AllowedOrigins__0` | `https://YOUR-FRONTEND.vercel.app` |
| `Gemini__ApiKey` | *(optional)* your Gemini key |
| `Gemini__Model` | `gemini-2.5-flash` |

Notes:
- Double underscore `__` maps to nested JSON config in .NET.
- After Vercel gives you the frontend URL, set `Cors__AllowedOrigins__0` and redeploy API.
- `*.vercel.app` is already allowed in code; custom domain still needs the env var.

### E. Verify API

Open:

- `https://YOUR-API.up.railway.app/health` → should return `Healthy`
- `https://YOUR-API.up.railway.app/swagger` → Swagger UI

Seeded admin (created on first startup if no admin exists):

| Email | Password |
|-------|----------|
| `admin@taskflow.ai` | `Admin123!` |

---

## 3) Vercel — frontend

1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import the same GitHub repo
3. Configure:

| Setting | Value |
|---------|--------|
| **Root Directory** | `frontend` |
| **Framework Preset** | Other / Vite |
| **Install Command** | `npm ci` |
| **Build Command** | `npm run build` |

4. **Environment Variables** (Production):

| Name | Value |
|------|--------|
| `VITE_API_URL` | `https://YOUR-API.up.railway.app/api` |

Important: must end with `/api` (no trailing slash after `api`).

5. Deploy.

6. Copy your frontend URL, e.g. `https://taskflow-xxx.vercel.app`

7. Back on Railway API variables, set:

```text
Cors__AllowedOrigins__0=https://taskflow-xxx.vercel.app
```

Redeploy API once.

---

## 4) Send to your QA friend

Share:

1. **App:** `https://your-app.vercel.app`
2. **Admin login:** `admin@taskflow.ai` / `Admin123!`
3. **API / Swagger (optional):** `https://your-api.up.railway.app/swagger`

Ask them to test:

- Register / login
- Create / edit / delete tasks
- Admin dashboard + owner filter
- Dark mode toggle
- Attachments UI
- AI assistant (only if Gemini key is set)

---

## 5) Common problems

| Problem | Fix |
|---------|-----|
| Frontend: “Cannot reach the API” | Wrong `VITE_API_URL`, or API not public / crashed |
| Browser CORS error | Add Vercel URL to `Cors__AllowedOrigins__0`, redeploy API |
| API crash on boot | Bad SQL connection string / missing `Jwt__Key` |
| Login works locally, fails online | Rebuild frontend after setting `VITE_API_URL` (it is baked in at build time) |
| SignalR not updating | Confirm hub URL uses same API host; check browser Network → WS |

---

## 6) Cost / free-tier tips

- Railway may require a small credit card / trial — check current free limits
- Vercel hobby plan is usually enough for QA demo
- Stop Railway services when unused to save quota

---

## Order checklist

- [ ] Push code to GitHub
- [ ] Railway: SQL Server + connection string
- [ ] Railway: API Dockerfile deploy + public domain
- [ ] Railway: env vars set, `/health` OK
- [ ] Vercel: root `frontend`, env `VITE_API_URL`
- [ ] Vercel deploy succeeds
- [ ] Railway CORS updated with Vercel URL
- [ ] Login as admin from Vercel site
- [ ] Send link to QA
