const { appendToSheet } = require('./google-sheets');

// Test data that matches your form structure
const testData = {
    firstName: "Test",
    lastName: "User",
    email: "test@example.com",
    phone: "123-456-7890",
    dateOfBirth: "1990-01-01",
    insurance: "Blue Cross",
    preferredClinic: "Denver, CO",
    referralSource: "Search",
    additionalInfo: "This is a test submission",
    consent: "I consent"
};

// Test the integration
async function testGoogleSheetsIntegration() {
    try {
        console.log('Testing Google Sheets integration...');
        const result = await appendToSheet(testData);
        console.log('Success! Data was appended to the sheet.');
        console.log('Response:', result);
    } catch (error) {
        console.error('Error testing Google Sheets integration:', error.message);
        if (error.response) {
            console.error('Error details:', error.response.data);
        }
    }
}

// Run the test
testGoogleSheetsIntegration(); 