# PulseGym OS — Gym Management Software & Owner Platform

PulseGym OS is a modern, high-converting gym operating system and marketing platform built specifically for gym, boutique studio, CrossFit box, and 24/7 fitness facility owners.

## Value Proposition for Gym Owners

1. **Automated Member Retention & Churn Radar:** Detects 40%+ drop in member attendance patterns at Day 14, automatically alerting coaches to trigger personalized retention check-ins before athletes cancel.
2. **Intelligent Recurring Billing & Smart Dunning:** Recovers 74% of declined credit card transactions automatically via optimal banking retry sequences and frictionless 1-click mobile SMS payment links.
3. **Turnkey 24/7 Turnstile & Access Control:** Hardware-agnostic relay gateway supporting Kisi, Paxton, HID, Apple Wallet NFC passes, barcodes, and biometric turnstiles with sub-0.2s door unlocks.
4. **Frictionless Class Scheduling & Capacity Grid:** Athlete spot reservation, automated waitlist promotion, and trainer commission/payroll automation.
5. **Interactive ROI & Revenue Engine:** Real-time financial modeling demonstrating annual savings and net revenue recovery for gyms scaling from 50 to 1,500+ members.

## Architecture & Tech Stack

- **Backend:** Node.js, Express.js REST API
- **Frontend:** Responsive HTML5, CSS3 Custom Properties (Athletic dark mode with glassmorphic cards), Vanilla JavaScript (No heavy framework overhead, 0 runtime bundle lag)
- **Testing:** Jest, Supertest
- **Integrations Supported:** Stripe Elements / Direct Interchange Terminal, Kisi, Paxton, Gusto, Quickbooks

## API Endpoints

- `GET /api/health` — System status and health monitor.
- `POST /api/roi-calculator` — Financial ROI computation based on member count, monthly fee, churn rate, and failed billing percentage.
- `GET /api/migration-estimate` — Timeline, savings, and pain points comparison when migrating from Mindbody, Glofox, Zen Planner, or PushPress.
- `POST /api/leads` — Validated lead capture and 1-on-1 VIP demo booking submission.
- `GET /api/leads` — Query registered demo requests and trial accounts.
- `GET /api/simulation/members` — Interactive roster of mock members (active, past-due, missing waiver, frozen).
- `POST /api/simulation/checkin` — Simulated turnstile gateway check-in processing.
- `GET /api/simulation/classes` — Daily class schedule and capacity rosters.
- `POST /api/simulation/book-class` — Class spot booking and waitlist management.
- `GET /api/simulation/telemetry` — Live gym floor occupancy and operational telemetry.

## Quick Start

### Install Dependencies
```bash
npm install
```

### Run Tests
```bash
npm test
```

### Start Development Server
```bash
npm start
# Visit http://localhost:3000
```
