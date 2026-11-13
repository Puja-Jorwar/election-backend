const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

// Initialize the app
const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/electionDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define a schema for votes
const voteSchema = new mongoose.Schema({
  voterId: { type: String, required: true },
  fullName: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  candidate: { type: String, required: true },
});

// Create a model for votes
const Vote = mongoose.model('Vote', voteSchema);

// Route to handle form submission
app.post('/vote', async (req, res) => {
  const { voterId, fullName, city, state, candidate } = req.body;

  const newVote = new Vote({
    voterId,
    fullName,
    city,
    state,
    candidate,
  });

  try {
    // Save the vote to MongoDB
    await newVote.save();
    console.log('Vote recorded:', req.body);
    res.status(200).send({ message: 'Your vote has been recorded successfully!' });
  } catch (error) {
    console.error('Error saving vote:', error);
    res.status(500).send({ message: 'An error occurred while saving your vote.' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
