const express = require('express');
const serverless = require('serverless-http');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());

const DATA_FILE = path.join(__dirname, 'offers.json');

// Helper to read offers from file
function readOffers() {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
}

// Helper to write offers to file
function writeOffers(offers) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(offers, null, 2));
}

// API routes
app.get('/api/offers', (req, res) => {
  const offers = readOffers();
  res.json(offers);
});

app.post('/api/offers', (req, res) => {
  const offers = readOffers();
  const offer = req.body;
  offers.push(offer);
  writeOffers(offers);
  res.status(201).json(offer);
});

app.post('/api/offers/:id/accept', (req, res) => {
  const offers = readOffers();
  const id = parseInt(req.params.id, 10);
  if (offers[id]) {
    const accepted = offers.splice(id, 1)[0];
    writeOffers(offers);
    res.json({ accepted });
  } else {
    res.status(404).json({ error: 'Offer not found' });
  }
});

module.exports = serverless(app);