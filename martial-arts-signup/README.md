# Martial Arts School Sign-Up Platform (Apex Martial Arts Academy)

A full-stack web application designed for martial arts academies and dojos. It provides interactive student registration, dynamic QR code sign-up poster generation, personal digital check-in passes, automated welcome and orientation emails, and a staff front-desk dashboard.

---

## 🌟 Key Features

### 1. Interactive Student Sign-Up Portal
- **Multi-Discipline Support:** Brazilian Jiu-Jitsu (BJJ), Muay Thai Kickboxing, Shotokan Karate, Taekwondo, Mixed Martial Arts (MMA), Judo, Krav Maga, and Kids Bullyproof programs.
- **Program & Pricing Selection:** Free Trial Class, 2-Week Beginner Quick-Start, Monthly Unlimited Membership, and Private Coaching packages.
- **Guided Multi-Step Registration:**
  - Step 1: Martial arts discipline and membership tier selection.
  - Step 2: Student information, age, experience level, uniform/Gi sizing, and emergency contact details.
  - Step 3: Preferred class schedule slots and goals checklist (Self-defense, Cardio, Competition, Focus).
  - Step 4: Electronic Liability Waiver and safety terms confirmation.
  - Step 5: Instant digital Dojo Pass generation with personal pass code and downloadable/printable QR code.

### 2. QR Code Sign-Up & Poster Hub
- **Dynamic Poster Generator:** Create ready-to-print 8.5x11 / A4 posters for dojo front windows, community flyers, and kiosk stands.
- **Deep-Linked Campaign Codes:** Embed preset disciplines, program offers, or promotional discount codes directly into the QR code.
- **Instant Kiosk Registration:** Scanning the QR code opens the pre-configured sign-up form on prospective students' mobile devices.

### 3. Automated Email Integration
- **Discipline-Tailored Orientation Guides:** Dispatches automated welcome emails upon registration containing:
  - Attached / embedded personal Dojo Check-In Pass QR code and Pass Code.
  - What-to-bring instructions specific to the selected martial art (e.g. Gi vs No-Gi gear, hand wraps, mouthguard).
  - Dojo etiquette rules (bowing, hygiene, safety directives).
  - Academy location and contact details.
- **Mock & SMTP Support:** Includes a built-in mock mode with an in-app email log and HTML previewer, as well as full SMTP configuration support for production delivery.

### 4. Front Desk & Attendance Tracking
- **Instant QR & Pass Code Scanner:** Scan passes with camera/barcode scanners or enter pass codes manually.
- **Attendance Verification:** Displays student registration details, increments visit counts, and logs timestamps.
- **Live Attendance Feed:** View real-time mat arrivals.

### 5. Staff Admin Dashboard
- **Analytics Overview:** Key metrics for total sign-ups, check-ins, emails sent, and top disciplines.
- **Registration Management:** Filter, search, toggle attendance status, and resend welcome emails.
- **CSV Data Export:** One-click download of all registration data.
- **Email Log Viewer:** View sent email history and inspect rendered HTML templates directly in a modal previewer.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm

### Installation
```bash
cd martial-arts-signup
npm install
```

### Running the Server
```bash
npm start
```

Visit `http://localhost:3000` in your web browser.

### Running Tests
```bash
npm test
```

---

## ⚙️ Configuration & Environment Variables

Create an optional `.env` file or export environment variables:

| Variable | Description | Default |
| :--- | :--- | :--- |
| `PORT` | Web server listening port | `3000` |
| `BASE_URL` | Base URL used for generated QR links | `http://localhost:3000` |
| `SCHOOL_NAME` | Academy name | `Apex Martial Arts Academy` |
| `EMAIL_MOCK` | Enable built-in email log mode (`true`/`false`) | `true` |
| `EMAIL_FROM` | Sender email address header | `"Apex Martial Arts Academy" <welcome@apexmartialarts.com>` |
| `SMTP_HOST` | SMTP server hostname (if `EMAIL_MOCK=false`) | `""` |
| `SMTP_PORT` | SMTP server port | `587` |
| `SMTP_USER` | SMTP username | `""` |
| `SMTP_PASS` | SMTP password | `""` |
| `SMTP_SECURE`| Use SSL/TLS (`true`/`false`) | `false` |

---

## 📡 REST API Reference

### Sign-ups & Students
- `POST /api/signups` - Register new student (generates pass & triggers welcome email).
- `GET /api/signups` - List registrations (supports `?search=`, `?discipline=`, `?status=`).
- `GET /api/signups/:id` - Get student details and QR code data URL.
- `PATCH /api/signups/:id/status` - Update status (`confirmed`, `checked_in`, `pending`, `cancelled`).
- `DELETE /api/signups/:id` - Delete a registration.
- `POST /api/signups/:id/resend-email` - Resend welcome email with pass.

### Check-in & QR Verification
- `POST /api/check-in` - Check in student by passCode or scanned QR payload.
- `GET /api/qr/verify/:code` - Verify student pass code validity.
- `GET /api/qr/poster` - Generate customizable QR poster with query params.

### Emails & Admin
- `GET /api/emails` - Retrieve sent email queue.
- `GET /api/emails/:id` - Retrieve email record and rendered HTML preview.
- `GET /api/stats` - Academy metrics and discipline breakdown.
- `GET /api/export` - Export all registrations as CSV file.
- `GET /api/config` - Get academy settings and list of disciplines.

---

## 🥋 Tech Stack
- **Backend:** Node.js, Express, QRCode, Nodemailer, UUID
- **Frontend:** Vanilla JS (SPA), HTML5, CSS3 with Responsive Dojo Dark/Light Themes
- **Testing:** Jest, Supertest
