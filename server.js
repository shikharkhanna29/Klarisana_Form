const express = require('express');
const cors = require('cors');
const { appendToSheet } = require('./google-sheets');

const app = express();

// Configure CORS
app.use(cors({
    origin: ['http://localhost:8080', 'https://shikharkhanna29.github.io'],
    methods: ['POST', 'GET', 'OPTIONS'],
    allowedHeaders: ['Content-Type']
}));

app.use(express.json());

app.post('/submit-to-sheets', async (req, res) => {
    try {
        const formData = req.body;
        await appendToSheet(formData);
        res.status(200).json({ message: 'Data added to Google Sheet!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 