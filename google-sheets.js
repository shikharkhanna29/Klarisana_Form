const { google } = require('googleapis');
const GOOGLE_SHEETS_CONFIG = require('./google-sheets-config');

// Initialize the Google Sheets API
const auth = new google.auth.GoogleAuth({
    credentials: GOOGLE_SHEETS_CONFIG.credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

/**
 * Append form submission data to Google Sheet
 * @param {Object} formData - The form submission data
 * @returns {Promise} - Promise resolving to the API response
 */
async function appendToSheet(formData) {
    try {
        // Convert form data to array format for Google Sheets
        const values = [
            [
                formData.firstName,
                formData.lastName,
                formData.email,
                formData.phone,
                formData.dateOfBirth,
                formData.insurance,
                formData.preferredClinic,
                formData.referralSource,
                formData.additionalInfo,
                formData.consent,
                new Date().toISOString() // Timestamp
            ]
        ];

        const response = await sheets.spreadsheets.values.append({
            spreadsheetId: GOOGLE_SHEETS_CONFIG.spreadsheetId,
            range: `${GOOGLE_SHEETS_CONFIG.sheetName}!A:K`,
            valueInputOption: 'USER_ENTERED',
            resource: {
                values: values,
            },
        });

        return response.data;
    } catch (error) {
        console.error('Error appending to Google Sheet:', error);
        throw error;
    }
}

module.exports = {
    appendToSheet
}; 