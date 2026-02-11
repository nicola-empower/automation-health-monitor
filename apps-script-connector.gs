/**
 * Automation Health Dashboard - Apps Script Connector
 * 
 * 1. RUN 'setupSheet' once to create headers.
 * 2. EDIT the 'CONFIG' object with your dashboard details.
 * 3. USE 'sendHeartbeat' in your other scripts.
 */

const CONFIG = {
  // Your Next.js Dashboard URL + /api/heartbeat
  DASHBOARD_API: "https://your-dashboard-url.vercel.app/api/heartbeat", 
  
  // Must match HEARTBEAT_SECRET_KEY in your .env.local
  SECRET_KEY: "secret_123", 
  
  // Unique ID for this specific script (must exist in the sheet)
  SERVICE_ID: "my-script-001" 
};

/**
 * Run this once to initialize your Google Sheet
 */
function setupSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheets()[0];
  
  const headers = [
    ["ServiceID", "ServiceName", "ClientName", "Status", "LastPing", "Notes", "ScheduleHours"]
  ];
  
  sheet.getRange(1, 1, 1, 7).setValues(headers)
    .setBackground("#000000")
    .setFontColor("#00ff00")
    .setFontWeight("bold")
    .setFontFamily("Courier New");
    
  // Add a sample row so the dashboard sees something
  const sampleRow = [
    ["my-script-001", "Daily Audit Script", "Internal", "nominal", new Date().toISOString(), "System initialized.", 24]
  ];
  sheet.getRange(2, 1, 1, 7).setValues(sampleRow);
  
  Logger.log("Sheet Setup Complete!");
}

/**
 * Call this function at the end of your automation scripts
 */
function sendHeartbeat(status = "nominal", message = "System running optimally.") {
  const payload = {
    service_id: CONFIG.SERVICE_ID,
    status: status,
    message: message
  };

  const options = {
    method: 'post',
    contentType: 'application/json',
    headers: {
      'x-api-key': CONFIG.SECRET_KEY
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  try {
    const response = UrlFetchApp.fetch(CONFIG.DASHBOARD_API, options);
    Logger.log("Heartbeat Sent: " + response.getContentText());
  } catch (e) {
    Logger.log("Failed to send heartbeat: " + e.toString());
  }
}
