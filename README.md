# AI Compass

AI Compass is a Bun + React frontend with a Bun + Mongo backend that lets PE firms create AI readiness assessments for portfolio companies. Executives receive an invite link, enter their details, and complete the assessment with autosave progress tracking.

## Features

- PE firm login with email + password
- Portfolio assessment creation with expiring invite links
- Executive assessment flow with autosave + resume
- Progress tracking and results summary

## Local Development

```bash
cd frontend
bun install
bun run dev
```

```bash
cd backend/app
bun install
bun run dev
```

Frontend runs on `0.0.0.0:8001` and backend on `0.0.0.0:4001`.

## Project Structure

- `frontend/src` — React app and assessment flow
- `backend/app/src` — Bun API (auth + assessment endpoints)
