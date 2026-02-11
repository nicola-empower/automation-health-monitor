import { NextRequest, NextResponse } from 'next/server';
import { getSheetData } from '@/lib/google-sheets';
import { calculateStatus, formatTimeAgo } from '@/lib/status-logic';
import { getToken } from 'next-auth/jwt';

export async function GET(req: NextRequest) {
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;
    if (!spreadsheetId) {
        return NextResponse.json({ error: 'Not configured' }, { status: 500 });
    }

    const { searchParams } = new URL(req.url);
    const clientNameFilter = searchParams.get('client');

    // Security Check: If no client filter is provided, user MUST be authenticated
    if (!clientNameFilter) {
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
    }

    try {
        const data = await getSheetData(spreadsheetId, 'A2:G');
        if (!data) return NextResponse.json([]);

        let services = data.map((row: any) => ({
            id: row[0],
            name: row[1],
            clientName: row[2],
            status: calculateStatus(row[4], parseFloat(row[6]) || 24),
            lastPing: formatTimeAgo(row[4]),
            notes: row[5] || ""
        }));

        // Apply filtering if clientNameFilter is provided
        if (clientNameFilter) {
            services = services.filter((s: any) =>
                s.clientName.toLowerCase() === clientNameFilter.toLowerCase()
            );
        }

        return NextResponse.json(services);
    } catch (error: any) {
        console.error('Services API Error Details:', {
            message: error.message,
            stack: error.stack,
            code: error.code,
        });
        return NextResponse.json({
            error: 'Failed to fetch services',
            details: error.message
        }, { status: 500 });
    }
}
