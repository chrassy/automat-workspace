# Habit Tracker REST API

A high-performance, production-ready Habit Tracker REST API built with Node.js, TypeScript, Express, and SQLite (`better-sqlite3`). Featuring advanced streak calculation engines, comprehensive daily digest analytics, flexible scheduling (daily, weekly, custom days), and full JSON backup/restore capabilities.

---

## Features

- **Full Habit Lifecycle**: Create, read, update, delete, archive, and unarchive habits with custom target counts, units, colors, categories, and tags.
- **Flexible Scheduling**:
  - `daily`: Track daily recurring goals.
  - `custom_days`: Schedule habits for specific days of the week (e.g. Mon, Wed, Fri).
  - `weekly`: Track multi-day weekly target thresholds.
- **Smart Streak Engine**:
  - Automatically calculates current active streaks, all-time longest streaks, and completion rates (7-day, 30-day, all-time).
  - Handles timezone date boundaries, grace periods (yesterday's streak held until today is logged), and custom scheduled days.
- **Daily Check-ins & Logs**:
  - Log completions with quantitative value metrics, target status, mood indicators (`great`, `good`, `neutral`, `hard`, `terrible`), 1-5 star ratings, and journal notes.
  - Automatic idempotent upsert behavior for same-day check-ins.
- **Analytics & Health Insights**:
  - System-wide overview metrics (`/api/analytics/overview`): active/archived counts, global today completion rate, top performing habits, habits at risk of breaking streaks, category distribution.
  - Daily summary digest (`/api/analytics/daily-summary?date=YYYY-MM-DD`): full schedule breakdown and completion percentage for any target date.
- **Data Portability**: Full JSON export (`/api/export`) and restore/import (`/api/import`).
- **Robust Validation & Error Handling**: Zod-based request schemas with actionable error responses and RFC-compliant HTTP status codes.

---

## Tech Stack

- **Runtime**: Node.js (v20+)
- **Language**: TypeScript (ES2022 / NodeNext)
- **Framework**: Express.js
- **Database**: SQLite with `better-sqlite3` (WAL mode enabled, in-memory or persistent disk file)
- **Validation**: Zod
- **Testing**: Vitest + Supertest

---

## Getting Started

### 1. Installation

```bash
cd habit-tracker-api
npm install
```

### 2. Run Tests

```bash
npm test
```

### 3. Build & Run

```bash
# Build TypeScript to dist/
npm run build

# Start production server
npm start

# Or run with live reload for development
npm run dev
```

The API will start at `http://localhost:3000`.

---

## API Reference

### Health Check

- `GET /health` or `GET /api/health`
  - Response: `{"status": "ok", "timestamp": "..."}`

---

### Habits (`/api/habits`)

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/habits` | Create a new habit |
| `GET` | `/api/habits` | List habits (filter by category, tag, archived, search, sort) |
| `GET` | `/api/habits/:id` | Get habit details with embedded stats and streak data |
| `PUT` | `/api/habits/:id` | Update habit metadata |
| `DELETE` | `/api/habits/:id` | Delete habit and cascade remove check-in logs |
| `POST` | `/api/habits/:id/archive` | Archive a habit |
| `POST` | `/api/habits/:id/unarchive` | Restore an archived habit |
| `GET` | `/api/habits/:id/stats` | Compute streaks and completion analytics |

#### Sample Habit Creation Request:

```http
POST /api/habits
Content-Type: application/json

{
  "name": "Morning 5k Run",
  "description": "Outdoor cardiovascular run before breakfast",
  "category": "fitness",
  "frequency_type": "custom_days",
  "target_days": [1, 3, 5],
  "target_count": 5,
  "unit": "km",
  "color": "#10B981",
  "tags": ["running", "cardio", "morning"]
}
```

---

### Habit Logs & Check-ins (`/api/habits/:id/logs`)

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/habits/:id/logs` | Log habit completion (or alias `POST /api/habits/:id/check-in`) |
| `GET` | `/api/habits/:id/logs` | Query logs history with optional `from_date`, `to_date`, `limit`, `offset` |
| `GET` | `/api/habits/:id/logs/:logId` | Get specific log entry |
| `PUT` | `/api/habits/:id/logs/:logId` | Update log values, mood, notes, or rating |
| `DELETE` | `/api/habits/:id/logs/:logId` | Delete log entry |
| `DELETE` | `/api/habits/:id/logs/date/:date` | Delete log entry for a specific date (YYYY-MM-DD) |

#### Sample Habit Check-in Request:

```http
POST /api/habits/HABIT_UUID/logs
Content-Type: application/json

{
  "date": "2025-01-15",
  "value": 5.2,
  "notes": "Paced 4:45/km, felt great energy!",
  "mood": "great",
  "rating": 5
}
```

---

### Analytics (`/api/analytics`)

- `GET /api/analytics/overview` - System-wide overview containing:
  - Active vs archived habit counters
  - Today's overall completion percentage
  - Longest active streak habit
  - Top 5 performing habits
  - **Habits at risk**: habits with active streaks that have not yet been checked in today
  - Category distribution breakdown
- `GET /api/analytics/daily-summary?date=YYYY-MM-DD` - Daily digest of all scheduled habits for the given date, completion status, values, and notes.

---

### Metadata & Data Management

- `GET /api/categories` - Returns all distinct categories in use.
- `GET /api/tags` - Returns all distinct tags across all habits.
- `GET /api/export` - Full export of all habits and logs in JSON format.
- `POST /api/import` - Bulk restore/import habits and logs.

---

## Launch Tweet

> 🚀 Ship your routines and master your consistency! Introducing the new **Habit Tracker REST API** by @Automat:
> 
> 🔥 Dynamic streak & gap calculation  
> 📊 Real-time daily digests & at-risk habit alerts  
> 🎯 Custom schedules, mood tracking & JSON backup  
> 
> Build your next productivity stack today! #BuildInPublic #TypeScript #APIs
