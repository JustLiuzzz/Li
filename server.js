const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json());

const API_KEY = process.env.GOOGLE_API_KEY;
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';

// Handle special cases
function handleSpecialCases(message) {
    const lowerMessage = message.toLowerCase().trim();
    if (lowerMessage.includes('siapa nama') || lowerMessage.includes('siapa kamu')) {
        return "Saya CyberBot, AI ramah yang dirancang untuk membantu dan mengobrol dengan gaya manusia! 😄 Dibuat oleh tim di komunitas xAI dengan syawaliuz octavian sebagai pendiri komunitas untuk menjelajahi luasnya pengetahuan dan percakapan.";
    } else if (lowerMessage.includes('siapa pembuat') || lowerMessage.includes('siapa yang membuat')) {
        return "Saya diciptakan oleh xAI (syawaliuz octavian) , tim yang berdedikasi untuk mempercepat penemuan ilmiah manusia melalui AI. Mereka adalah orang-orang hebat, lho! 🚀";
    }
    return null;
}

// Chat endpoint
app.post('/chat', async (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ reply: 'Pesan tidak boleh kosong! Silakan ketik sesuatu. 😊' });
    }

    // Check special cases
    const specialResponse = handleSpecialCases(message);
    if (specialResponse) {
        return res.json({ reply: specialResponse });
    }

    // Call Google Gemini API
    try {
        const response = await axios.post(
            `${API_URL}?key=${API_KEY}`,
            {
                contents: [{ parts: [{ text: message }] }],
            },
            {
                headers: { 'Content-Type': 'application/json' },
            }
        );
        const reply = response.data.candidates[0].content.parts[0].text;
        res.json({ reply });
    } catch (error) {
        console.error('API Error:', error.response ? error.response.data : error.message);
        res.status(500).json({ reply: 'Maaf, ada masalah dengan koneksi ke AI. Cek API key atau coba lagi nanti ya! 😅' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});