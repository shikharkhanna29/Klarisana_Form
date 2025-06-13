const express = require('express');
const cors = require('cors');
const { appendToSheet } = require('./google-sheets');
const { createClient } = require('@supabase/supabase-js');
const config = require('./config.json');

const app = express();
const port = process.env.PORT || 3001;

// Configure CORS for production
const allowedOrigins = [
    'http://localhost:8080',
    'https://klarisana-form-frontend.onrender.com'
];

app.use(cors({
    origin: function(origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// Initialize Supabase client with environment variables
const supabase = createClient(
    process.env.SUPABASE_URL || config.supabaseUrl,
    process.env.SUPABASE_ANON_KEY || config.supabaseAnonKey
);

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'ok',
        environment: process.env.NODE_ENV || 'development'
    });
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

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port} in ${process.env.NODE_ENV || 'development'} mode`);
}); 