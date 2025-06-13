const express = require('express');
const cors = require('cors');
const path = require('path');
const { appendToSheet } = require('./google-sheets');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? ['https://your-app-name.onrender.com'] // Replace with your actual domain
        : ['http://localhost:8080', 'http://127.0.0.1:8080']
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Google Sheets submission endpoint
app.post('/submit-to-sheets', async (req, res) => {
    try {
        const result = await appendToSheet(req.body);
        res.json({ success: true, data: result });
    } catch (error) {
        console.error('Error submitting to Google Sheets:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message,
            details: error.details || error.errors || error
        });
    }
});

// Serve the main page for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 