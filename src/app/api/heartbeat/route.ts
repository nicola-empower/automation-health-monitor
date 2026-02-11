import { NextRequest, NextResponse } from 'next/server';
import { getGoogleSheetsClient, updateSheetData, getSheetData } from '@/lib/google-sheets';

export async function POST(req: NextRequest) {
    try {
        const apiKey = req.headers.get('x-api-key');
        const secretKey = process.env.HEARTBEAT_SECRET_KEY;

        if (!apiKey || apiKey !== secretKey) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { service_id, status, message } = body;

        if (!service_id) {
            return NextResponse.json({ error: 'service_id is required' }, { status: 400 });
        }

        const spreadsheetId = process.env.GOOGLE_SHEET_ID!;
        const range = 'A:G'; // Assumes A:ServiceID, B:Name, C:Client, D:Status, E:LastPing, F:Notes, G:Schedule

        // Fetch existing data to find the row
        const values = await getSheetData(spreadsheetId, range);
        if (!values) {
            return NextResponse.json({ error: 'Could not fetch sheet data' }, { status: 500 });
        }

        const rowIndex = values.findIndex(row => row[0] === service_id);
        const currentTime = new Date().toISOString();

        if (rowIndex === -1) {
            // Logic for new service could be added here (optional)
            return NextResponse.json({ error: 'Service not found in master sheet' }, { status: 404 });
        }

        // Update the specific row
        // Column indices: D=3, E=4, F=5
        const updateRange = `D${rowIndex + 1}:F${rowIndex + 1}`;
        await updateSheetData(spreadsheetId, updateRange, [[status || 'nominal', currentTime, message || '']]);

        return NextResponse.json({ success: true, timestamp: currentTime });
    } catch (error: any) {
        console.error('Heartbeat Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
