# 📟 Automation Health Monitor

A Tech-Noir inspired monitoring dashboard for tracking heartbeats from distributed Google Apps Scripts, Python hooks, and other automated services.

![Dashboard Preview](https://img.shields.io/badge/Aesthetic-Tech--Noir-00ff00?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)

## 🌌 Overview
This dashboard acts as a centralized "Command Center" for all your automation logic. Instead of checking 100 different scripts, you can see the health of every node at a glance.

- **Auto-Registration**: New scripts appear on the dashboard automatically when they first ping. No manual sheet entry required.
- **Security**: Password-protected (NextAuth) and API-keyed heartbeat reception.
- **Business OS Expansion**: 
    - **👥 Leads Intelligence**: Real-time prospect tracking from external Astro/Web sites.
    - **📊 Marketing ROI**: Dynamic dashboard for tracking social performance and template conversion.
    - **⚙️ Site Management**: Remote control of production site assets (marquee text, contact details, rates).
- **Incident Management**:
    - **🚨 Trello Integration**: Automated card creation for immediate failure response.
- **Bespoke Branding**:
    - **🎨 Client Portals**: Dedicated, white-labeled status pages with custom logos and professional Light/Dark themes.

## 💼 Case Study: Automation Agency Business OS
### The Challenge
As an automation specialist managing a massive distributed network, I needed more than just a "monitor." I needed a way to bridge the gap between technical reliability, lead generation, and client-facing transparency without building a custom backend for every project.

### The Solution
The **Automation Health Monitor** evolved into a **Unified Business OS**. It leverages Google Sheets as a low-code database, providing a centralized API for heartbeats, lead capture, and site configuration. 

### Key Results
- **Operations**: Zero-error silence thanks to **Trello-integrated failure alerts**.
- **Sales**: Direct conversion of website traffic into the dashboard's **Leads Monitor**.
- **Transparency**: Massive client trust via **Bespoke Uptime Portals**, proving value 24/7.
- **Agility**: Remote site updates via the **Site Manager**, bypassing the need for manual code deployments.

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

notes: Your "White Label" Client Status Pages are now live! 🚀

How to use them:
Unique Client URLs: You can now give each client their own specific link, for example:
https://automation-health-monitor.vercel.app/status/Oak%20&%20Chisel
https://automation-health-monitor.vercel.app/status/Empower%20Admin
Public Access: These pages are public (no password required). This builds massive trust as clients can see their own heartbeats in real-time.
Security: Your main dashboard (/) remains secure and password-protected. Clients cannot see other clients' data—they only see cards where the ClientName matches the URL.
Premium Branding: The footer now says "Managed by Empower Automation" to reinforce your brand.