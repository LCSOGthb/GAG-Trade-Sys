const express = require('express');
const path = require('path');
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// In-memory trade offers
let offers = [];

// List all offers
app.get('/offers', (req, res) => {
  res.json(offers);
});

// Create a new offer
app.post('/offers', (req, res) => {
  const offer = req.body;
  offers.push(offer);
  res.status(201).json(offer);
});

// Accept an offer (by index for simplicity)
app.post('/offers/:id/accept', (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (offers[id]) {
    const accepted = offers.splice(id, 1)[0];
    res.json({ accepted });
  } else {
    res.status(404).json({ error: 'Offer not found' });
  }
});

app.listen(3000, () => console.log('GAG Trade Hub running on port 3000'));