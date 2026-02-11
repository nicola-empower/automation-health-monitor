# 📟 Automation Health Monitor

A Tech-Noir inspired monitoring dashboard for tracking heartbeats from distributed Google Apps Scripts, Python hooks, and other automated services.

![Dashboard Preview](https://img.shields.io/badge/Aesthetic-Tech--Noir-00ff00?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)

## 🌌 Overview
This dashboard acts as a centralized "Command Center" for all your automation logic. Instead of checking 100 different scripts, you can see the health of every node at a glance.

- **Auto-Registration**: New scripts appear on the dashboard automatically when they first ping. No manual sheet entry required.
- **Security**: Password-protected (NextAuth) and API-keyed heartbeat reception.
- **Telemetry**: Tracks "Time Ago" since the last heartbeat and alerts you (Green/Amber/Red) based on custom schedules.
- **Backend**: Uses a simple Google Sheet as the source of truth—no database setup required.

## 🛠️ Setup

### 1. Environment Variables
Create a `.env.local` file with the following:
```bash
NEXTAUTH_SECRET=your_random_secret
DASHBOARD_PASSWORD=your_ui_password
GOOGLE_SHEET_ID=your_sheet_id
GOOGLE_SERVICE_ACCOUNT_KEY='{ ... your json key ... }'
HEARTBEAT_SECRET_KEY=your_api_key
```

### 2. Connecting Scripts
Use the included `apps-script-connector.gs` to connect any Google Apps Script to the dashboard. Simply update the `CONFIG` object with your Vercel URL and Secret Key.

## 🛰️ API Endpoints

### `POST /api/heartbeat`
Receives pings from your scripts.
**Headers:** `x-api-key: your_key`
**Payload:**
```json
{
  "service_id": "unique-id",
  "service_name": "Friendly Name",
  "client_name": "Client",
  "status": "nominal",
  "message": "Everything is fine."
}
```

---
Built for **Empower VA** by Antigravity.
