/**
 * Automation Health Dashboard - Apps Script Connector
 * 
 * 1. RUN 'setupSheet' once to create headers.
 * 2. EDIT the 'CONFIG' object with your dashboard details.
 * 3. USE 'sendHeartbeat' in your other scripts.
 */

const CONFIG = {
  // Your Next.js Dashboard URL + /api/heartbeat
  DASHBOARD_API: "https://automation-health-monitor.vercel.app/api/heartbeat", 
  
  // Must match HEARTBEAT_SECRET_KEY in your .env.local
  SECRET_KEY: "secret_123", 
  
  // Unique ID for this specific script (must exist in the sheet)
  SERVICE_ID: "my-script-001",
  
  // These are used for AUTO-REGISTRATION if the ID is new
  SERVICE_NAME: "Shopify Sync Engine",
  CLIENT_NAME: "Oak & Chisel"
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
 * UPDATED: Integrated with Remote Controls (Manual Trigger & Kill Switch)
 */
function doGet(e) {
  // Use this function as a Web App to enable MANUAL TRIGGERS from the dashboard
  try {
    // IMPORTANT: Replace 'sendWorkBriefing()' with your actual main function call
    // For example: const result = myMainAutomationFunction();
    const result = sendWorkBriefing(); // Or your main function
    return ContentService.createTextOutput("Trigger Success: " + result).setMimeType(ContentService.MimeType.TEXT);
  } catch (err) {
    return ContentService.createTextOutput("Trigger Error: " + err.toString()).setMimeType(ContentService.MimeType.TEXT);
  }
}

/**
 * Call this function at the end of your automation scripts
 * It now also checks for remote kill switch status.
 * @param {string} status - The status of the service (e.g., "nominal", "warning", "error").
 * @param {string} message - A descriptive message about the service's state.
 * @returns {boolean} - True if the service is allowed to continue, false if remotely disabled.
 */
function sendHeartbeat(status, message) {
  const url = CONFIG.DASHBOARD_API;
  const payload = {
    service_id: CONFIG.SERVICE_ID,
    service_name: CONFIG.SERVICE_NAME,
    client_name: CONFIG.CLIENT_NAME,
    status: status || "nominal",
    message: message || ""
  };
  
  const options = {
    method: "post",
    contentType: "application/json",
    headers: {
      "x-api-key": CONFIG.API_KEY
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };
  
  try {
    const response = UrlFetchApp.fetch(url, options);
    const data = JSON.parse(response.getContentText());
    
    // Check if the script has been disabled remotely
    if (data && data.isActive === false) {
      Logger.log("DASHBOARD ALERT: This service has been disabled remotely (Kill Switch). Operation halted.");
      return false; // Signal to calling function to STOP
    }
    
    Logger.log("Heartbeat Sent: " + response.getContentText());
    return true;
  } catch (e) {
    Logger.log("Heartbeat failed: " + e.toString());
    return true; // Continue anyway if dashboard is down
  }
}

/**
 * Example usage in your main function
 * Demonstrates how to integrate the kill switch logic.
 */
function exampleMain() {
  // Check heartbeat at start
  const isAllowed = sendHeartbeat("nominal", "Script starting execution...");
  if (!isAllowed) {
    Logger.log("Script terminated by remote kill switch.");
    return; // Exit if disabled remotely
  }
  
  // Your logic here...
  Logger.log("Processing work...");
  
  // Update at end
  sendHeartbeat("nominal", "Work complete.");
  Logger.log("Script finished successfully.");
}

// Placeholder for the user's actual main function if using doGet
function sendWorkBriefing() {
  Logger.log("sendWorkBriefing function called via doGet.");
  // Add your actual automation logic here
  return "Work briefing initiated.";
}
