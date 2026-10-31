# Borealis Brewing Co. — Borealis Cold IPA Launch Platform

High-converting product launch landing page and validation platform for **Borealis Cold IPA (Batch #001: Glacier Cryo Edition)** — a breakthrough craft beer engineered for luminous hop aromatics and sub-zero crispness.

## The Product Story: Why Cold IPA?

Modern craft beer drinkers face an ongoing dilemma:
- **Traditional West Coast IPAs** can be overly bitter, pine-heavy, and cloying due to high crystal malt sweetness.
- **Hazy / New England IPAs** are dense, sweet, and quickly induce palate fatigue after a single glass.

**Borealis Cold IPA** solves this via cold brewing innovation:
1. **Lager-Fermented Cleanliness:** Fermented with authentic Bavarian lager yeast (W-34/70) at 58°F under counter-pressure. This strips away yeast esters, providing an ultra-clean canvas for hops.
2. **Cryogenic Sub-Zero Dry Hopping:** Hops (Citra Cryo, New Zealand Nelson Sauvin, and Idaho 7) are added at sub-zero temperatures, capturing explosive aroma terpenes (grapefruit zest, passionfruit, crushed gooseberry) without bitter vegetative bite.
3. **Pilsner & Jasmine Rice Grain Bill:** 90% German Barke Pilsner malt and 10% toasted jasmine rice deliver an ultra-dry finish (1.006 FG) and champagne-fine effervescence (2.6 vols CO₂). Only 155 kcal and 4.5g carbs.

## Core Interactive Features

- **Sensory Blueprint & Flavor Radar:** Visual representation of key beer metrics (ABV 6.5%, IBU 48, SRM 4.2 Luminous Gold) with interactive flavor breakdown.
- **Interactive Food Pairings Matrix:** Dynamic pairings showcase pairing Borealis with smash burgers, cedar-plank salmon, Thai spicy papaya salad, and woodfired pizza.
- **Palate Calibration Quiz:** 3-step interactive beer profile quiz matching drinker preferences to the Cold IPA flavor spectrum.
- **Batch #001 Collector Allocation:** Pre-order reservation engine for 2,500 limited collector 4-packs (16 oz cans) shipping in Fall 2025.
  - Zero-payment, coming-soon model adhering strictly to marketing compliance guidelines.
  - Email capture paired with a single-line explicit disclosure.
  - Generates instant VIP reservation credentials (`BOR-XXXXX`).
- **Legal 21+ Age Gate:** Verification modal with local persistence and compliant bypass options.
- **Measurement & Attribution:** Integrated with Automat tracking script (`/v1/automat.js`) for visit tracking, CTA event recording (`hero_preorder_click`, `pairing_tab_click`, `quiz_completed`), and `automat.signup(email)` submission.

## Tech Stack & Architecture

- **Static Frontend Demo:** Semantic HTML5, CSS3 Custom Properties (glacier obsidian theme, custom SVG/CSS can render, responsive flex/grid layouts), Vanilla ES6 JavaScript.
- **Backend API:** Node.js, Express.js REST API with in-memory reservation tracking and real-time batch allocation status.
- **Testing:** Jest, Supertest (15 automated unit, contract, and deployment tests).
- **Deployment:** Cloudflare Pages static site built via `deploy.sh`.

## API Endpoints

- `GET /health` — Service health monitor and timestamp.
- `GET /api/specs` — Full beer specifications, grain bill, hops, and sensory profile.
- `GET /api/faq` — Frequently asked questions regarding cold IPAs, shipping, and reservation terms.
- `GET /api/batch-status` — Real-time allocation numbers (total: 2,500, claimed, remaining).
- `POST /api/waitlist` — Validate email and reserve Batch #001 spot (returns reservation ID, no payment collected).
- `POST /api/quiz-results` — Palate profile match calculation and custom serving recommendations.

## Local Development & Testing

### Install Dependencies
```bash
cd borealis-craft-beer
npm ci
```

### Run Tests
```bash
npm test
```

### Run CI Script
```bash
bash ci.sh
```

### Build Demo Site
```bash
OUTPUT_DIR=/tmp/site BASE_PATH=/ bash deploy.sh
```
