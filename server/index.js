require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const UXSession = require('./models/UXsession');

const app = express();

const PORT = process.env.PORT || 3000;
const MONGO_URL = process.env.MONGO_URL;

mongoose.connect(MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch(err => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Middleware
app.use(cors()); // Allow CORS for extension/frontend
app.use(express.json()); // Parse JSON bodies

// POST /capture to save UX session
app.post('/capture', async (req, res) => {
  try {
    const { url, rawText, deviceInfo } = req.body;

    if (!url || !rawText) {
      return res.status(400).json({ error: 'url and rawText are required' });
    }

    const newSession = new UXSession({ url, rawText, deviceInfo });
    const savedSession = await newSession.save();

    res.status(201).json(savedSession);
  } catch (err) {
    console.error('Error saving UX session:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Basic GET for testing
app.get('/', (req, res) => {
  res.send("UX Detective backend running");
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

