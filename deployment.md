# Deploying Motia Intent Backend

Since we have added a `Dockerfile`, you can deploy this to any cloud provider that supports Docker (Railway, Render, Fly.io, etc.).

## Option 1: Railway (Recommended)

1.  **Sign up/Login** to [Railway.app](https://railway.app/).
2.  **New Project** -> **Deploy from GitHub repo**.
3.  Select `04suriya07-spec/motia-intent-backend`.
4.  **CRITICAL STEP**: Railway will detect a "Monorepo" and try to deploy *everything* (20+ services).
    - **Do NOT deploy all of them.**
    - Only select the **Root** (or just the one with the `Dockerfile`).
    - If it creates 20 services by mistake: **Delete the project and try again**, carefully selecting only the root.
5.  **Variables**: Add `MONGO_URI` if you want a real DB (Railway can provision one for you: Right click -> Add Database -> MongoDB).

## Option 2: Render (Easy Blueprint)

1.  **Sign up/Login** to [Render.com](https://render.com/).
2.  Click **New +** -> **Blueprint**.
3.  Connect your GitHub repo `motia-intent-backend`.
4.  Render will auto-detect `render.yaml`.
5.  Click **Apply**.
    - This deploys the Docker container automatically.
    - **Note:** Render Free Tier spins down after inactivity (slow start).

## Option 3: Local Docker

```bash
docker build -t motia-backend .
docker run -p 3000:3000 motia-backend
```

## Note on Database
The generated code expects a MongoDB connection.
- Locally: It tries `mongodb://localhost:27017/motia_local`
- Production: Set `MONGO_URI` environment variable.
