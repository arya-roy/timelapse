# Timelapse Backend

This is the backend API for Timelapse, a time-tracking app.  
Built with Node.js, Express, and SQLite.

## Setup

```bash
cd backend
npm install
node index.js
```

The API will run (by default) on port 8080.

## Endpoints

- `GET /logs` — Get all logs. Optionally filter by `?date=YYYY-MM-DD`.
- `POST /logs` — Add a new log.
    - body: `{ "activity": "...", "reason": "...", "timestamp": "YYYY-MM-DDTHH:mm:ss" }`

- `GET /` — Health check.

## Database

Uses a local SQLite database file: `timelapse.db` in the backend directory.