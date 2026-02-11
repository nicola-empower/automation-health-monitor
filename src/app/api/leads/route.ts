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

    const { name, email, company, notes } = await req.json();
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    if (!spreadsheetId) return NextResponse.json({ error: 'Not configured' }, { status: 500 });

    try {
        await appendSheetData(spreadsheetId, 'Leads!A2', [[
            new Date().toISOString(),
            name,
            email,
            company,
            notes
        ]]);

        // Email Notification Bridge
        const notificationUrl = company.includes("ROI")
            ? process.env.ROI_NOTIFICATION_URL
            : process.env.CONTACT_NOTIFICATION_URL;

        if (notificationUrl) {
            fetch(notificationUrl, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, company, notes })
            }).catch(e => console.error("Notification failed", e));
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: 'Failed to submit lead' }, { status: 500 });
    }
}
