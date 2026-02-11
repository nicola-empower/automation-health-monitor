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

## 💼 Case Study: Solving Distributed Monitoring
### The Challenge
As an automation specialist managing **10+ independent projects** across various Google accounts, I faced a "visibility gap." I had scripts running everywhere, but no central place to know if they were actually working or silently failing.

### The Solution
I built this **Automation Health Monitor** to bridge that gap. By creating a lightweight "Heartbeat API," I enabled my scripts to report their status to a single, secure URL. 

### Key Results
- **Seamless Scaling**: With **Auto-Registration**, I can deploy a new script and it instantly appears on my dashboard without any manual configuration.
- **Client Anonymity**: I can monitor client scripts without needing access to their private spreadsheets.
- **Operational Excellence**: Real-time status toggles (Nominal/Silence/Failure) ensure I catch errors before my clients do.

## 🚀 Built With
- **Frontend**: Next.js 15 (App Router) + Tailwind CSS
- **Design**: "Tech-Noir" Glassmorphism Aesthetic
- **Data**: Google Sheets API (Serverless Database)
- **Auth**: NextAuth.js (Secure Terminal Access)
- **Icons**: Lucide React

## 🛠️ Setup & Usage
Detailed setup instructions for the **Heartbeat API** and **Service Account** can be found in the `apps-script-connector.gs` comments and the internal documentation.

---
Built by **Nicola Berry** | **Empower Automation**
🔗 [empowerautomation.co.uk](https://empowerautomation.co.uk)