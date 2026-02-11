import { NextRequest, NextResponse } from 'next/server';
import { getSheetData, updateSheetData } from '@/lib/google-sheets';
import { getToken } from 'next-auth/jwt';

export async function GET(req: NextRequest) {
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;
    if (!spreadsheetId) return NextResponse.json({ error: 'Not configured' }, { status: 500 });

    try {
        const data = await getSheetData(spreadsheetId, 'SiteConfig!A2:B');
        if (!data) return NextResponse.json({});

        const config = data.reduce((acc: any, row: any) => {
            acc[row[0]] = row[1];
            return acc;
        }, {});

        return NextResponse.json(config);
    } catch (error: any) {
        return NextResponse.json({ error: 'Failed to fetch config' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    try {
        // We'll update rows based on keys. For simplicity in a prototype,
        // we append/update based on a map.
        const values = Object.entries(body).map(([key, value]) => [key, value]);
        await updateSheetData(spreadsheetId, 'SiteConfig!A2:B', values);
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: 'Failed to update config' }, { status: 500 });
    }
}
