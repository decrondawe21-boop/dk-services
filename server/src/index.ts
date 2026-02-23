import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

app.post('/api/gemini', async (req, res) => {
    try {
        const { prompt, systemInstruction } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }

        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash-latest",
            systemInstruction: systemInstruction || 'You are a professional web designer. Respond only with valid JSON in Czech.'
        });

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        // Assuming the model returns a JSON string, we parse it.
        // The original code had a specific model that returned JSON directly.
        // We might need to adjust this based on the actual model output.
        res.json(JSON.parse(text));

    } catch (error) {
        console.error('Error calling Gemini API:', error);
        res.status(500).json({ error: 'Failed to call Gemini API' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
