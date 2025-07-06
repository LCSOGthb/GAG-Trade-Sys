const express = require('express');
const serverless = require('serverless-http');
const path = require('path');

const app = express();
app.use(express.json());

// In-memory trade offers
let offers = [];

// Serve static files (handled by Vercel's static serving, see below)

// API routes
app.get('/api/offers', (req, res) => {
  res.json(offers);
});

app.post('/api/offers', (req, res) => {
  const offer = req.body;
  offers.push(offer);
  res.status(201).json(offer);
});

app.post('/api/offers/:id/accept', (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (offers[id]) {
    const accepted = offers.splice(id, 1)[0];
    res.json({ accepted });
  } else {
    res.status(404).json({ error: 'Offer not found' });
  }
});

module.exports = serverless(app);