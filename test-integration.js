const { createClient } = require('@supabase/supabase-js');
const { appendToSheet } = require('./google-sheets');
const config = require('./config.json');

// Initialize Supabase client
const supabaseClient = createClient(
    config.supabaseUrl,
    config.supabaseAnonKey
);

// Test data
const testData = {
    status: 'New',
    lead_in_date: new Date().toISOString().split('T')[0],
    patient_name: 'Test User',
    service_type: 'Contact Form',
    referral: 'Search',
    zocdoc: false,
    roi_status: 'Pending',
    clinic_location: 'Denver, CO',
    insurance: 'Blue Cross',
    insurance_status: 'Pending',
    ec: null,
    med_intake: null,
    first_contact_attempt_date: null,
    second_contact_attempt_date: null,
    third_contact_attempt_date: null,
    notes: 'This is a test submission',
    treatment_clearance_status: 'Pending',
    bh_intake_date: null,
    first_treatment_appt_date: null,
    last_treatment_appt_date: null,
    followup_call_date: null,
    created_at: new Date().toISOString()
};

async function testIntegrations() {
    console.log('Starting integration tests...\n');

    // Test Supabase
    console.log('Testing Supabase integration...');
    try {
        // First, test the connection
        const { data: healthCheck, error: healthError } = await supabaseClient
            .from('leads')
            .select('count')
            .limit(1);

        if (healthError) {
            throw new Error(`Supabase connection failed: ${healthError.message}`);
        }
        console.log('✅ Supabase connection successful');

        // Test data insertion
        const { data: supabaseData, error: supabaseError } = await supabaseClient
            .from('leads')
            .insert([testData])
            .select();

        if (supabaseError) throw supabaseError;
        console.log('✅ Supabase data insertion successful');
        console.log('Supabase Response:', supabaseData);
    } catch (error) {
        console.error('❌ Supabase test failed:', error.message);
        if (error.details) console.error('Details:', error.details);
        return; // Stop testing if Supabase fails
    }

    // Test Google Sheets
    console.log('\nTesting Google Sheets integration...');
    try {
        const sheetsResult = await appendToSheet(testData);
        console.log('✅ Google Sheets test successful');
        console.log('Google Sheets Response:', sheetsResult);
    } catch (error) {
        console.error('❌ Google Sheets test failed:', error.message);
        if (error.response) console.error('Details:', error.response.data);
    }
}

// Run the tests
testIntegrations(); 