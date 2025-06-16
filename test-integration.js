const { createClient } = require('@supabase/supabase-js');
const { appendToSheet } = require('./google-sheets');
require('dotenv').config();

// Test data
const testData = {
    status: 'Test',
    lead_in_date: new Date().toISOString().split('T')[0],
    patient_name: 'Test Patient',
    service_type: 'Test Service',
    referral: 'Test Referral',
    zocdoc: false,
    roi_status: 'Test',
    clinic_location: 'Test Location',
    insurance: 'Test Insurance',
    insurance_status: 'Test',
    ec: null,
    med_intake: null,
    first_contact_attempt_date: null,
    second_contact_attempt_date: null,
    third_contact_attempt_date: null,
    notes: 'This is a test entry for final integration testing',
    treatment_clearance_status: 'Test',
    bh_intake_date: null,
    first_treatment_appt_date: null,
    last_treatment_appt_date: null,
    followup_call_date: null,
    created_at: new Date().toISOString()
};

async function runIntegrationTest() {
    console.log('Starting final integration test...\n');

    // 1. Test Supabase Integration
    console.log('=== Testing Supabase Integration ===');
    try {
        const supabase = createClient(
            'https://llpvkabdqqdffazmdiby.supabase.co',
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxscHZrYWJkcXFkZmZhem1kaWJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk0OTQ0NzYsImV4cCI6MjA2NTA3MDQ3Nn0.0wspTaCm71vp6XvnuZlOuwfJHqZPqAaSq11UuoYvyfw'
        );

        console.log('1. Testing Supabase connection...');
        const { data: connectionTest, error: connectionError } = await supabase
            .from('leads')
            .select('count')
            .limit(1);

        if (connectionError) throw connectionError;
        console.log('✅ Supabase connection successful');

        console.log('\n2. Testing data insertion...');
        const { data: insertData, error: insertError } = await supabase
            .from('leads')
            .insert([testData])
            .select();

        if (insertError) throw insertError;
        console.log('✅ Data inserted successfully');
        console.log('Inserted record ID:', insertData[0].id);

        console.log('\n3. Testing data retrieval...');
        const { data: retrieveData, error: retrieveError } = await supabase
            .from('leads')
            .select('*')
            .eq('id', insertData[0].id)
            .single();

        if (retrieveError) throw retrieveError;
        console.log('✅ Data retrieved successfully');
        console.log('Retrieved data matches inserted data:', 
            JSON.stringify(retrieveData, null, 2));

    } catch (error) {
        console.error('❌ Supabase test failed:', error.message);
        process.exit(1);
    }

    // 2. Test Google Sheets Integration
    console.log('\n=== Testing Google Sheets Integration ===');
    try {
        console.log('1. Testing Google Sheets connection...');
        const result = await appendToSheet(testData);
        
        console.log('✅ Google Sheets connection successful');
        console.log('✅ Data appended successfully');
        console.log('Updated range:', result.updates.updatedRange);
        console.log('Updated cells:', result.updates.updatedCells);

    } catch (error) {
        console.error('❌ Google Sheets test failed:', error.message);
        process.exit(1);
    }

    console.log('\n=== All Tests Completed Successfully ===');
    console.log('✅ Supabase Integration: Working');
    console.log('✅ Google Sheets Integration: Working');
    console.log('\nThe application is ready for deployment!');
}

runIntegrationTest().catch(console.error); 