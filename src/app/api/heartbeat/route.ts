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
        const range = 'A:I';

        // Fetch existing data to find the row
        const values = await getSheetData(spreadsheetId, range);
        const currentTime = new Date().toISOString();

        if (!values) {
            return NextResponse.json({ error: 'Data not found' }, { status: 404 });
        }

        const rowIndex = values.findIndex(row => row[0] === service_id);

        if (rowIndex === -1) {
            // AUTO-REGISTRATION: Create a new row if it doesn't exist
            const { appendSheetData } = await import('@/lib/google-sheets');
            const newRow = [
                service_id,
                service_name || "New Automation",
                client_name || "External Account",
                status || "nominal",
                currentTime,
                message || "Initial heartbeat received (Auto-Registered)",
                '24', // Default 24h schedule
                '',   // TriggerURL (empty for now)
                'TRUE' // IsActive
            ];
            await appendSheetData(spreadsheetId, 'A:I', [newRow]);

            return NextResponse.json({
                success: true,
                message: "Service auto-registered",
                timestamp: currentTime,
                isActive: true
            });
        }

        // Update the specific row
        // Column indices: D=3, E=4, F=5
        const updateRange = `D${rowIndex + 1}:F${rowIndex + 1}`;
        await updateSheetData(spreadsheetId, updateRange, [[status || 'nominal', currentTime, message || '']]);

        // TRIGGER TRELLO ALERT ON FAILURE
        if (status?.toLowerCase() === 'error' || status?.toLowerCase() === 'failure') {
            const { createTrelloCard } = await import('@/lib/trello');
            await createTrelloCard(
                `📟 FAILURE: ${service_name || service_id}`,
                `**Service:** ${service_name || service_id}\n**Client:** ${client_name || 'General'}\n**Error:** ${message || 'No details provided'}\n**Time:** ${currentTime}`
            );
        }

        // Fetch isActive status from the existing row (column I, index 8)
        const isActive = String(values[rowIndex][8]).toUpperCase() !== "FALSE";

        return NextResponse.json({ success: true, timestamp: currentTime, isActive });
    } catch (error: any) {
        console.error('Heartbeat Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
