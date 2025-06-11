// Initialize Supabase client
const supabase = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);

// Get form element
const form = document.getElementById('contactForm');

// Handle form submission
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Get form data
    const formData = {
        status: 'New Lead',
        lead_in_date: new Date().toISOString().split('T')[0],
        patient_name: `${form.firstName.value} ${form.lastName.value}`,
        service_type: 'New Patient',
        referral: form.referralSource.value,
        zocdoc: false,
        roi_status: 'Pending',
        clinic_location: form.preferredClinic.value,
        insurance: form.insurance.value,
        insurance_status: 'Pending',
        ec: form.consent.checked ? 'Yes' : 'No',
        med_intake: 'Pending',
        notes: form.additionalInfo.value || null,
        treatment_clearance_status: 'Pending'
    };

    try {
        // Insert data into Supabase
        const { data, error } = await supabase
            .from('leads')
            .insert(formData)
            .select();

        if (error) throw error;

        // Show success message
        alert('Thank you for your submission! We will contact you soon.');
        form.reset();

    } catch (error) {
        console.error('Error submitting form:', error);
        alert('There was an error submitting your form. Please try again.');
    }
}); 