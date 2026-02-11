import { NextRequest, NextResponse } from 'next/server';
import { getSheetData, updateSheetData } from '@/lib/google-sheets';
import { getToken } from 'next-auth/jwt';

export async function POST(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { service_id, action } = body;

        if (!service_id || !action) {
            return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
        }

        const spreadsheetId = process.env.GOOGLE_SHEET_ID!;
        const range = 'A:I';

        const data = await getSheetData(spreadsheetId, range);
        if (!data) return NextResponse.json({ error: 'Data not found' }, { status: 404 });

        const rowIndex = data.findIndex(row => row[0] === service_id);
        if (rowIndex === -1) {
            return NextResponse.json({ error: 'Service not found' }, { status: 404 });
        }

        let newState = "TRUE";
        if (action === 'toggle') {
            const currentState = String(data[rowIndex][8]).toUpperCase();
            newState = currentState === "FALSE" ? "TRUE" : "FALSE";
        } else if (action === 'disable') {
            newState = "FALSE";
        } else if (action === 'enable') {
            newState = "TRUE";
        }

        // Update Column I (index 8)
        const updateRange = `I${rowIndex + 1}`;
        await updateSheetData(spreadsheetId, updateRange, [[newState]]);

        return NextResponse.json({ success: true, isActive: newState === "TRUE" });
    } catch (error: any) {
        console.error('Control API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
