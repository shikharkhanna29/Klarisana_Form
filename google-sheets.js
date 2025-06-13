const { google } = require('googleapis');
const config = require('./google-sheets-config');
const credentials = require('./google-credentials.json');

// Create a JWT client using the service account credentials
const auth = new google.auth.JWT(
    credentials.client_email,
    null,
    credentials.private_key,
    ['https://www.googleapis.com/auth/spreadsheets']
);

// Create Google Sheets API client
const sheets = google.sheets({ version: 'v4', auth });

/**
 * Append form submission data to Google Sheet
 * @param {Object} formData - The form submission data
 * @returns {Promise} - Promise resolving to the API response
 */
async function appendToSheet(formData) {
    try {
        // Format the data according to the headers
        const values = [
            [
                formData.firstName,
                formData.lastName,
                formData.email,
                formData.phone,
                formData.dateOfBirth,
                formData.insurance,
                formData.preferredClinic,
                formData.howDidYouHear,
                formData.additionalInfo,
                formData.consentStatus,
                new Date().toISOString()
            ]
        ];

        const response = await sheets.spreadsheets.values.append({
            spreadsheetId: config.spreadsheetId,
            range: config.range,
            valueInputOption: 'RAW',
            resource: {
                values: values
            }
        });

        console.log('Data appended successfully:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error appending data to sheet:', error);
        throw error;
    }
}

module.exports = {
    appendToSheet
}; 