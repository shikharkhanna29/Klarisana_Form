const { google } = require('googleapis');
const credentials = require('./google-credentials.json');

// Create a JWT client using the service account credentials
const auth = new google.auth.JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
});

// Create Google Sheets API client
const sheets = google.sheets({ version: 'v4', auth });

// Google Sheets configuration
const SPREADSHEET_ID = '1H7-JFYUhMqNtpprW88KkrsjzmIJb1qZDfuqdX_N6HLM';
const RANGE = 'Sheet1!A:Z';

/**
 * Append form data to Google Sheet
 * @param {Object} formData - The form submission data
 * @returns {Promise} - Promise resolving to the API response
 */
async function appendToSheet(formData) {
    try {
        console.log('Starting Google Sheets append operation...');
        console.log('Using credentials for:', credentials.client_email);
        
        // Authorize the client
        console.log('Authorizing client...');
        await auth.authorize();
        console.log('Authorization successful');

        // Format the data according to the headers
        const values = [
            [
                formData.status,
                formData.lead_in_date,
                formData.patient_name,
                formData.service_type,
                formData.referral,
                formData.zocdoc,
                formData.roi_status,
                formData.clinic_location,
                formData.insurance,
                formData.insurance_status,
                formData.ec,
                formData.med_intake,
                formData.first_contact_attempt_date,
                formData.second_contact_attempt_date,
                formData.third_contact_attempt_date,
                formData.notes,
                formData.treatment_clearance_status,
                formData.bh_intake_date,
                formData.first_treatment_appt_date,
                formData.last_treatment_appt_date,
                formData.followup_call_date,
                formData.created_at
            ]
        ];

        console.log('Attempting to append data to spreadsheet:', SPREADSHEET_ID);
        const response = await sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: RANGE,
            valueInputOption: 'RAW',
            resource: {
                values: values
            }
        });

        console.log('Data appended to Google Sheet successfully:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error details:', {
            message: error.message,
            code: error.code,
            status: error.status,
            errors: error.errors,
            details: error.details
        });
        throw error;
    }
}

module.exports = {
    appendToSheet
}; 