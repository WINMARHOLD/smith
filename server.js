
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import fetch from 'node-fetch';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.post('/query', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) return res.status(400).json({ error: 'Prompt required' });

  try {
    const completion = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          { role: "system", content: "You are SMITH, a hyper-intelligent AI assistant." },
          { role: "user", content: prompt }
        ]
      })
    });

    const data = await completion.json();
    const reply = data.choices?.[0]?.message?.content || "No response from model.";

    res.json({ reply });
  } catch (err) {
    console.error('Query error:', err);
    res.status(500).json({ error: 'Failed to fetch from OpenAI' });
  }
});

app.get('/', (req, res) => {
  res.send('SMITH AI backend running.');
});

app.listen(PORT, () => {
  console.log(`SMITH backend running on port ${PORT}`);
});
