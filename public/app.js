// Initialize Supabase client
const supabaseClient = supabase.createClient(
    config.supabaseUrl,
    config.supabaseAnonKey
);

// Form submission handler
document.getElementById('contactForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    // Get form data and map it to the leads table structure
    const formData = {
        status: 'New', // Default status for new leads
        lead_in_date: new Date().toISOString().split('T')[0], // Current date
        patient_name: `${document.getElementById('firstName').value} ${document.getElementById('lastName').value}`,
        service_type: 'Contact Form', // Default service type
        referral: document.querySelector('input[name="referralSource"]:checked').value,
        zocdoc: false, // Default value
        roi_status: 'Pending', // Default value
        clinic_location: document.querySelector('input[name="preferredClinic"]:checked').value,
        insurance: document.getElementById('insurance').value,
        insurance_status: 'Pending', // Default value
        ec: null, // Not collected in form
        med_intake: null, // Not collected in form
        first_contact_attempt_date: null, // Will be set by staff
        second_contact_attempt_date: null, // Will be set by staff
        third_contact_attempt_date: null, // Will be set by staff
        notes: document.getElementById('additionalInfo').value,
        treatment_clearance_status: 'Pending', // Default value
        bh_intake_date: null, // Will be set by staff
        first_treatment_appt_date: null, // Will be set by staff
        last_treatment_appt_date: null, // Will be set by staff
        followup_call_date: null, // Will be set by staff
        created_at: new Date().toISOString()
    };

    try {
        // Show loading state
        const submitButton = document.querySelector('.submit-btn');
        submitButton.disabled = true;
        submitButton.textContent = 'Submitting...';

        // Submit to both Supabase and Google Sheets
        const [supabaseResult, sheetsResponse] = await Promise.all([
            // Submit to Supabase
            supabaseClient
                .from('leads')
                .insert([formData])
                .select(),
            
            // Submit to Google Sheets
            fetch(`${API_URL}/submit-to-sheets`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            })
        ]);

        // Parse the Google Sheets response
        const sheetsResult = await sheetsResponse.json();
        
        console.log('Supabase Result:', supabaseResult);
        console.log('Google Sheets Result:', sheetsResult);

        if (supabaseResult.error) throw supabaseResult.error;
        if (!sheetsResult.success) throw new Error(sheetsResult.error || 'Failed to submit to Google Sheets');

        // Show success message
        alert('Thank you for your submission! We will contact you soon.');
        
        // Reset form
        document.getElementById('contactForm').reset();

    } catch (error) {
        console.error('Error submitting form:', error);
        alert('There was an error submitting your form. Please try again.');
    } finally {
        // Reset button state
        const submitButton = document.querySelector('.submit-btn');
        submitButton.disabled = false;
        submitButton.textContent = 'Submit';
    }
}); 