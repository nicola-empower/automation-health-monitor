import { google } from 'googleapis';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

export async function getGoogleSheetsClient() {
    let credentialsText = process.env.GOOGLE_SERVICE_ACCOUNT_KEY || '{}';

    // Remapping potential quote wrapping from .env loaders
    if (credentialsText.startsWith("'") && credentialsText.endsWith("'")) {
        credentialsText = credentialsText.slice(1, -1);
    }
    if (credentialsText.startsWith('"') && credentialsText.endsWith('"')) {
        credentialsText = credentialsText.slice(1, -1);
    }

    const auth = new google.auth.GoogleAuth({
        credentials: JSON.parse(credentialsText),
        scopes: SCOPES,
    });

    return google.sheets({ version: 'v4', auth });
}

export async function getSheetData(spreadsheetId: string, range: string) {
    const sheets = await getGoogleSheetsClient();
    const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range,
    });

    return response.data.values;
}

export async function appendSheetData(spreadsheetId: string, range: string, values: any[][]) {
    const sheets = await getGoogleSheetsClient();
    await sheets.spreadsheets.values.append({
        spreadsheetId,
        range,
        valueInputOption: 'RAW',
        requestBody: {
            values,
        },
    });
}

export async function updateSheetData(spreadsheetId: string, range: string, values: any[][]) {
    const sheets = await getGoogleSheetsClient();
    await sheets.spreadsheets.values.update({
        spreadsheetId,
        range,
        valueInputOption: 'RAW',
        requestBody: {
            values,
        },
    });
}
