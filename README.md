# Full Stack Example Project

A minimal React + Flask starter for CSHS projects. Click **Use this template**
on GitHub to start a new project from it. Everything you need to run locally,
test, and auto-deploy to the club server is already wired up.

```
frontend/   React 19 + TypeScript, built with Vite, served by nginx in production
backend/    Flask API, served by gunicorn in production
scripts/    deploy.sh, run on the server to update the app
.github/    CI (lint + test on every push/PR) and deploy (on green main)
```

## Prerequisites

- Python 3.12 or newer
- Node.js 22 LTS or newer
- Docker (only needed to run the production build locally)
- `make` (optional shortcut; every command it runs is listed below)

**Windows:** use Git Bash (installed with Git) as your terminal. Wherever this
README says `.venv/bin/`, use `.venv/Scripts/` instead.

When you open the folder in VS Code it will offer to install the recommended
extensions. Click **Install All**. Formatting on save is preconfigured.

## Running locally

Install dependencies once:

```bash
cd backend && python3 -m venv .venv && .venv/bin/pip install -r requirements-dev.txt
cd ../frontend && npm install
```

Then run both dev servers, each in its own terminal:

```bash
cd backend && .venv/bin/python wsgi.py    # Flask on http://localhost:5000
cd frontend && npm run dev                # Vite on http://localhost:5173
```

Open http://localhost:5173. The page should say "Backend says: Hello from
Flask!". Vite forwards any request to `/api/*` to Flask, so the frontend can
call the backend with plain relative URLs and no CORS setup.

If you have `make`, the same thing is `make install` once, then `make dev`.

## Tests, linting, and formatting

| Check               | Command                                 |
| ------------------- | --------------------------------------- |
| backend tests       | `cd backend && .venv/bin/pytest`        |
| backend lint        | `cd backend && .venv/bin/ruff check .`  |
| backend format      | `cd backend && .venv/bin/ruff format .` |
| frontend lint       | `cd frontend && npm run lint`           |
| frontend type check | `cd frontend && npm run typecheck`      |
| frontend format     | `cd frontend && npm run format`         |

Or with make: `make test`, `make lint`, `make format`.

CI runs all of the checks on every push and pull request, including a
formatting check, so run `make format` (or the two format commands) before you
push if you don't have format-on-save working.

## Where to add things

| I want to…              | Edit                                   |
| ----------------------- | -------------------------------------- |
| add an API endpoint     | `backend/app/routes.py`                |
| call it from React      | `frontend/src/api.ts`, then `App.tsx`  |
| add a Python dependency | `backend/requirements.txt`             |
| add an npm dependency   | `cd frontend && npm install <package>` |
| add config / secrets    | `backend/app/config.py` + `.env`       |
| add a backend test      | `backend/tests/`                       |

Adding a database is deliberately left out. When you need one, the usual
choice is [Flask-SQLAlchemy](https://flask-sqlalchemy.readthedocs.io/) with
SQLite for development and Postgres (added as a service in
`docker-compose.yml`) in production.

## Running the production build locally

```bash
cp .env.example .env
docker compose up --build -d     # or: make docker-up
```

Open http://localhost:8080. nginx serves the built React app and proxies
`/api/*` to the Flask container. `docker compose down` (or `make docker-down`)
stops everything.

Note: both docker commands may need root privileges (prefix command with `sudo`)

## Deployment

The app deploys automatically to the club server whenever CI passes on
`main`. One-time setup for a new project:

**On the server**

1. Clone the repo somewhere, e.g. `/srv/my-project`.
2. Create `.env` there and set `APP_PORT` to a port nobody else is using.
3. Run `./scripts/deploy.sh` once by hand to confirm it works.
4. Point the server's reverse proxy (or your DNS/port setup) at that port.

**On GitHub** (Settings → Secrets and variables → Actions)

| Secret        | Value                                              |
| ------------- | -------------------------------------------------- |
| `DEPLOY_HOST` | server hostname or IP                              |
| `DEPLOY_USER` | SSH user on the server                             |
| `DEPLOY_KEY`  | private SSH key whose public half is authorized    |
| `DEPLOY_PATH` | absolute path of the clone, e.g. `/srv/my-project` |

The deploy workflow SSHes in and runs `scripts/deploy.sh`, which pulls the
latest `main`, rebuilds the containers, and waits for the backend health check.
If it fails, the workflow goes red and the last 50 lines of backend logs are in
the job output.

To deploy manually, SSH into the server and run the same script.
