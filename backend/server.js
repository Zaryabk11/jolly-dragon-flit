const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;
connection.once('open', () => {
  console.log('MongoDB database connection established successfully');
});

const moodSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  selectedMood: { type: String, required: true },
  emojiEntries: [{ type: String }],
});

const Mood = mongoose.model('Mood', moodSchema);

app.get('/', (req, res) => {
  res.send('Server Running');
});

app.get('/moods', async (req, res) => {
  try {
    const moods = await Mood.find().sort({ date: -1 });
    res.json(moods);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/moods', async (req, res) => {
  const { mood, emojis } = req.body;
  const newMood = new Mood({
    date: new Date(),
    selectedMood: mood,
    emojiEntries: emojis,
  });
  try {
    const savedMood = await newMood.save();
    res.status(201).json(savedMood);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);

});
