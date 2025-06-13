// Import required modules
const { createClient } = require('@supabase/supabase-js');
const config = require('./config.json');

// Test data that matches our form structure
const testFormData = {
    firstName: "Test",
    lastName: "User",
    email: "test@example.com",
    phone: "123-456-7890",
    dateOfBirth: "1990-01-01",
    insurance: "Blue Cross",
    preferredClinic: "Denver, CO",
    referralSource: "Search",
    additionalInfo: "This is a test submission",
    consent: true
};

// Function to simulate form submission
async function testFormSubmission() {
    console.log('Starting form submission test...\n');

    try {
        // Initialize Supabase client
        const supabaseClient = createClient(
            config.supabaseUrl,
            config.supabaseAnonKey
        );

        // Map form data to leads table structure
        const leadsData = {
            status: 'New',
            lead_in_date: new Date().toISOString().split('T')[0],
            patient_name: `${testFormData.firstName} ${testFormData.lastName}`,
            service_type: 'Contact Form',
            referral: testFormData.referralSource,
            zocdoc: false,
            roi_status: 'Pending',
            clinic_location: testFormData.preferredClinic,
            insurance: testFormData.insurance,
            insurance_status: 'Pending',
            ec: null,
            med_intake: null,
            first_contact_attempt_date: null,
            second_contact_attempt_date: null,
            third_contact_attempt_date: null,
            notes: testFormData.additionalInfo,
            treatment_clearance_status: 'Pending',
            bh_intake_date: null,
            first_treatment_appt_date: null,
            last_treatment_appt_date: null,
            followup_call_date: null,
            created_at: new Date().toISOString()
        };

        console.log('Test data prepared:', leadsData);

        // Test Supabase connection
        console.log('\nTesting Supabase connection...');
        const { data: healthCheck, error: healthError } = await supabaseClient
            .from('leads')
            .select('count')
            .limit(1);

        if (healthError) {
            throw new Error(`Supabase connection failed: ${healthError.message}`);
        }
        console.log('✅ Supabase connection successful');

        // Test data insertion
        console.log('\nTesting data insertion...');
        const { data, error } = await supabaseClient
            .from('leads')
            .insert([leadsData])
            .select();

        if (error) {
            throw new Error(`Data insertion failed: ${error.message}`);
        }

        console.log('✅ Data insertion successful');
        console.log('Response:', data);

    } catch (error) {
        console.error('❌ Test failed:', error.message);
        if (error.details) console.error('Details:', error.details);
    }
}

// Run the test
testFormSubmission(); 