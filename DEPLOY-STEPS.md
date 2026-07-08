# Clear steps: Railway (API + DB) then Vercel (frontend)

Fix already applied in this repo:
- `backend/railway.toml` was invalid (now proper TOML)
- `backend/Dockerfile` simplified for Railway Root Directory = `backend`

Commit and push these fixes **before** redeploying.

```powershell
cd C:\Users\Thidas\Documents\GitHub\take-home-assignment
git add backend/Dockerfile backend/railway.toml backend/.dockerignore DEPLOY.md frontend/vercel.json
git commit -m "Fix Railway Docker config for backend deploy"
git push
```

---

## Part A — Railway backend (do this first)

### A1. Open Railway
1. Go to https://railway.com and sign in (GitHub login is easiest)
2. Click **New Project**

### A2. Add PostgreSQL database
Railway does not offer Microsoft SQL Server in the default database menu. The API supports **PostgreSQL** on Railway (local dev still uses SQL Server).

1. In the project click **+ New**
2. Choose **Database** → **PostgreSQL**
3. Wait until the DB is **Online**
4. Open the DB service → **Variables** (or **Connect**)
5. Copy **`DATABASE_URL`** (starts with `postgresql://...`)

Keep this tab open.

### A3. Add the API service from GitHub
1. In the same project click **+ New**
2. Choose **GitHub Repo**
3. Select `take-home-assignment`
4. Open this new service → **Settings**
5. Set these exactly:

| Setting | Value |
|---------|--------|
| **Root Directory** | `backend` |
| **Builder** | Dockerfile |
| **Dockerfile path** | `Dockerfile` |

> Most common failure: Root Directory left empty (repo root). Must be `backend`.

6. **Settings → Networking → Generate Domain**  
   Copy the URL, example: `https://tasktracker-api-production.up.railway.app`

### A4. Add API variables
Service → **Variables** → add:

| Name | Value |
|------|--------|
| `ASPNETCORE_ENVIRONMENT` | `Production` |
| `ASPNETCORE_URLS` | `http://+:8080` |
| `ConnectionStrings__DefaultConnection` | *(paste `DATABASE_URL` from PostgreSQL service, or use Railway variable reference `${{Postgres.DATABASE_URL}}`)* |
| `Jwt__Key` | `TaskTracker-Prod-Secret-Key-Change-Me-32+` |
| `Jwt__Issuer` | `TaskTracker` |
| `Jwt__Audience` | `TaskTracker` |
| `Jwt__ExpirationMinutes` | `60` |

Optional:

| Name | Value |
|------|--------|
| `Gemini__ApiKey` | your Gemini key |
| `Gemini__Model` | `gemini-2.5-flash` |

Save → Railway redeploys automatically.

### A5. Check build logs if it fails
Open the failed deploy → **Build Logs**.

| Log message | Meaning / fix |
|-------------|----------------|
| `failed to read Dockerfile` | Root Directory not `backend`, or file not pushed |
| `COPY failed` / no such file | Root Directory wrong, or old Dockerfile not pushed |
| `dotnet restore` / `publish` error | push latest code, rebuild |
| App starts then crashes | usually bad connection string / missing JWT vars |
| Healthcheck failed | set vars, make sure `/health` works after boot |

### A6. Verify API works
In browser open:

1. `https://YOUR-API.up.railway.app/health` → should say **Healthy**
2. `https://YOUR-API.up.railway.app/swagger` → Swagger UI

Test login in Swagger:

- `POST /api/auth/login`
- Body:

```json
{
  "email": "admin@taskflow.ai",
  "password": "Admin123!"
}
```

If that works, backend is ready.  
**Do not start Vercel until `/health` works.**

---

## Part B — Vercel frontend

### B1. Import project
1. Go to https://vercel.com → **Add New… → Project**
2. Import `take-home-assignment` from GitHub

### B2. Configure build
On the configure screen:

| Setting | Value |
|---------|--------|
| **Framework Preset** | Other |
| **Root Directory** | click Edit → `frontend` |
| **Install Command** | `npm ci` |
| **Build Command** | `npm run build` |
| **Output Directory** | leave default / empty |

### B3. Environment variable (critical)
Before deploy, add:

| Name | Value |
|------|--------|
| `VITE_API_URL` | `https://YOUR-API.up.railway.app/api` |

Rules:
- Use your real Railway domain
- Must end with `/api`
- No slash after `api`
- Example: `https://tasktracker-api-production.up.railway.app/api`

### B4. Deploy
Click **Deploy**. Wait for success. Copy the URL:

`https://something.vercel.app`

### B5. Allow CORS on Railway
Back in Railway → API service → Variables, add:

| Name | Value |
|------|--------|
| `Cors__AllowedOrigins__0` | `https://something.vercel.app` |

Redeploy API (or wait for auto redeploy).

---

## Part C — Test the live site

1. Open the Vercel URL
2. Login: `admin@taskflow.ai` / `Admin123!`
3. Create a task
4. Open a second browser/tab and confirm it works

Send your QA friend:

- Site: `https://something.vercel.app`
- Admin: `admin@taskflow.ai` / `Admin123!`

---

## If Railway still fails — send me this

From Railway **Build Logs**, copy the **last 30–40 lines** (errors at the bottom).  
Also tell me:

1. Root Directory value
2. Whether PostgreSQL service is Online
3. Whether `/health` opens or not

---

## Quick order reminder

1. Push fix to GitHub  
2. Railway PostgreSQL  
3. Railway API (`Root Directory = backend`) + variables  
4. Confirm `/health`  
5. Vercel (`Root Directory = frontend`) + `VITE_API_URL`  
6. Set CORS to Vercel URL  
7. Share link with QA  
