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
        const { service_id, status, message, service_name, client_name } = body;

        if (!service_id) {
            return NextResponse.json({ error: 'service_id is required' }, { status: 400 });
        }

        const spreadsheetId = process.env.GOOGLE_SHEET_ID!;
        const range = 'A:G';

        // Fetch existing data to find the row
        const values = await getSheetData(spreadsheetId, range);
        const rowIndex = values ? values.findIndex(row => row[0] === service_id) : -1;
        const currentTime = new Date().toISOString();

        if (rowIndex === -1) {
            // AUTO-REGISTRATION: Create a new row if it doesn't exist
            const newRow = [
                service_id,
                service_name || "New Automation",
                client_name || "External Account",
                status || "nominal",
                currentTime,
                message || "Initial heartbeat received (Auto-Registered)",
                24 // Default 24h schedule
            ];
            const { appendSheetData } = await import('@/lib/google-sheets');
            await appendSheetData(spreadsheetId, 'A:A', [newRow]);

            return NextResponse.json({
                success: true,
                message: "Service auto-registered",
                timestamp: currentTime
            });
        }

        // Update the specific row
        const updateRange = `D${rowIndex + 1}:F${rowIndex + 1}`;
        await updateSheetData(spreadsheetId, updateRange, [[status || 'nominal', currentTime, message || '']]);

        return NextResponse.json({ success: true, timestamp: currentTime });
    } catch (error: any) {
        console.error('Heartbeat Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
