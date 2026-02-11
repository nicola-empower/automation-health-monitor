# Handover: Connecting Your Business OS Command Center

I have upgraded your **Automation Health Monitor** into a full-scale **Business OS**. It now functions as the centralized hub for your health monitoring, lead generation, marketing ROI, and website configuration.

To make the system fully operational, please follow these steps:

## 1. Google Sheet Setup
In your master Google Sheet (the ID in your `.env.local`), add the following three tabs:

### Tab: "Leads"
- **Column A**: Timestamp
- **Column B**: Name
- **Column C**: Email
- **Column D**: Company
- **Column E**: Notes

### Tab: "SiteConfig"
- **Column A**: Key (e.g., `contact_email`, `marquee_text`, `hourly_rate`)
- **Column B**: Value

### Tab: "Marketing" (Optional for manual entry)
- Add columns for `Template_Name`, `Impressions`, `Leads`.

---

## 2. Astro Site Integration (Leads)
To send leads from your website to the dashboard, update your lead form submission logic to `POST` to your dashboard URL:

```javascript
// Example: src/components/ContactForm.astro
const response = await fetch('https://your-dashboard-url.com/api/leads', {
  method: 'POST',
  headers: { 
    'Content-Type': 'application/json',
    'x-api-key': 'YOUR_SECRET_DASHBOARD_API_KEY' // Set this in your Astro .env
  },
  body: JSON.stringify({
    name: "Prospect Name",
    email: "email@example.com",
    company: "Business Inc",
    notes: "I need invoice automation."
  })
});
```

---

## 3. Remote Content Control (SiteConfig)
Instead of hardcoding your contact email or marquee text, you can now fetch them from your dashboard:

```javascript
// Example: Fetching config in Astro
const configRes = await fetch('https://your-dashboard-url.com/api/config');
const siteConfig = await configRes.json();

// Use in Astro: {siteConfig.marquee_text}
```

---

## 4. Next.js Environment Variables
Ensure the following are set in your Dashboard's `.env.local` or Vercel settings:
- `GOOGLE_SHEET_ID`: Your master sheet ID.
- `GOOGLE_SERVICE_ACCOUNT_KEY`: Your JSON key string.
- `DASHBOARD_API_KEY`: A secret key you choose to secure the Astro -> Dashboard link.
- `NEXTAUTH_SECRET`: A random string for dashboard security.

**You are now in total control of your business data!** 🛰️
