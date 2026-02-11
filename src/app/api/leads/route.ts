import { NextRequest, NextResponse } from 'next/server';
import { getSheetData, appendSheetData } from '@/lib/google-sheets';
import { getToken } from 'next-auth/jwt';

export async function GET(req: NextRequest) {
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;
    if (!spreadsheetId) return NextResponse.json({ error: 'Not configured' }, { status: 500 });

    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const data = await getSheetData(spreadsheetId, 'Leads!A2:E');
        if (!data) return NextResponse.json([]);

        const leads = data.map((row: any) => ({
            timestamp: row[0],
            name: row[1],
            email: row[2],
            company: row[3],
            notes: row[4] || "",
        }));

        return NextResponse.json(leads);
    } catch (error: any) {
        return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    // This endpoint will be used by the Astro site to submit leads
    // It should be public but protected by an API Key
    const apiKey = req.headers.get('x-api-key');
    const dashboardApiKey = process.env.DASHBOARD_API_KEY;

    if (!dashboardApiKey || apiKey !== dashboardApiKey) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const payload = await req.json();
    const { data = {}, meta = {}, type = "CONTACT" } = payload;
    const fp = meta.fingerprint || {};
    const behavior = meta.behavior || {};

    const spreadsheetId = process.env.GOOGLE_SHEET_ID;
    if (!spreadsheetId) {
        console.error("MISSINGGOOGLE_SHEET_ID");
        return NextResponse.json({ error: 'Not configured' }, { status: 500 });
    }

    try {
        // 1. Save to Evidence Log (Matching the 14 columns in the user's script)
        const timestamp = new Date().toISOString();
        const signature = `Res:${fp.screen || 'N/A'} | Px:${fp.devicePixelRatio || 'N/A'} | Cores:${fp.hardwareConcurrency || 'N/A'} | RAM:${fp.deviceMemory || 'N/A'}GB`;

        const rowData = [[
            timestamp,
            type,
            data.name || "N/A",
            data.email || "N/A",
            data.message || "N/A",
            meta.ip || "UNKNOWN",
            // Risk Calculation Logic (Same as Apps Script)
            fp.webdriver ? "HIGH (BOT)" : (behavior.pasteDetected ? "MEDIUM" : "LOW"),
            signature,
            `${fp.platform || 'N/A'} - ${fp.userAgent || 'N/A'}`,
            behavior.typingFormatted || "N/A",
            behavior.pasteDetected ? "YES" : "NO",
            fp.screen || "N/A",
            `${fp.hardwareConcurrency || 'N/A'} Cores / ${fp.deviceMemory || 'N/A'}GB`,
            JSON.stringify(meta)
        ]];

        let sourceTab = 'Leads';
        try {
            await appendSheetData(spreadsheetId, 'Leads!A2', rowData);
        } catch (e) {
            console.warn("Target 'Leads' tab missing, falling back to 'automation heath'");
            sourceTab = 'automation heath';
            // Fallback to the misspelled tab name I saw in your screenshot
            await appendSheetData(spreadsheetId, 'automation heath!A2', rowData);
        }

        // 2. Email Notification Bridge (Forward the FULL payload)
        const notificationUrl = type === "ROI_CALC"
            ? process.env.ROI_NOTIFICATION_URL
            : process.env.CONTACT_NOTIFICATION_URL;

        if (notificationUrl) {
            console.log("Forwarding to GAS Bridge:", notificationUrl);

            // MANUAL REDIRECT FOLLOW: Google Apps Script redirects dropped bodies in library fetch.
            // We follow manually to ensure the POST body is preserved.
            let res = await fetch(notificationUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
                redirect: 'manual'
            });

            if (res.status === 302 || res.status === 301) {
                const redirectUrl = res.headers.get('location');
                if (redirectUrl) {
                    console.log("Following Redirect to:", redirectUrl);
                    res = await fetch(redirectUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    });
                }
            }

            console.log("Bridge Final Status:", res.status);
        }

        return NextResponse.json({ success: true, saved_to: sourceTab });
    } catch (error: any) {
        console.error('Lead Submission Error:', {
            message: error.message,
            stack: error.stack,
            cause: error.cause
        });
        return NextResponse.json({
            error: 'Failed to submit lead',
            details: error.message
        }, { status: 500 });
    }
}
