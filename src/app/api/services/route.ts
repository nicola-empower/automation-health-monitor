import { NextResponse } from 'next/server';
import { getSheetData } from '@/lib/google-sheets';
import { calculateStatus, formatTimeAgo } from '@/lib/status-logic';

export async function GET() {
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;
    if (!spreadsheetId) {
        return NextResponse.json({ error: 'Not configured' }, { status: 500 });
    }

    try {
        const data = await getSheetData(spreadsheetId, 'A2:G');
        if (!data) return NextResponse.json([]);

        const services = data.map((row: any) => ({
            id: row[0],
            name: row[1],
            clientName: row[2],
            status: calculateStatus(row[4], parseFloat(row[6]) || 24),
            lastPing: formatTimeAgo(row[4]),
            notes: row[5] || ""
        }));

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
