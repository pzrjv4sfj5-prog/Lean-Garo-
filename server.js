import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

// API endpoint for translation (if needed in future)
app.post('/translate', async (req, res) => {
  const { text } = req.body;
  try {
    // All translation logic is handled client-side with translationEngine.js
    res.json({ 
      translatedText: text,
      message: 'Translation handled by client-side semantic engine'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Serve SPA routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
  console.log(`📚 Garo Language Platform ready!`);
});