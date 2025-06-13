const express = require('express');
const cors = require('cors');
const { appendToSheet } = require('./google-sheets');
const { createClient } = require('@supabase/supabase-js');
const config = require('./config.json');

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Supabase client
const supabase = createClient(config.supabaseUrl, config.supabaseAnonKey);

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

// Form submission endpoint
app.post('/submit-form', async (req, res) => {
    try {
        const formData = req.body;

        // Save to Supabase
        const { data: supabaseData, error: supabaseError } = await supabase
            .from('form_submissions')
            .insert([formData]);

        if (supabaseError) throw supabaseError;

        // Save to Google Sheets
        await appendToSheet(formData);

        res.status(200).json({ 
            success: true, 
            message: 'Form submitted successfully',
            data: supabaseData 
        });
    } catch (error) {
        console.error('Error submitting form:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error submitting form',
            error: error.message 
        });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
}); 