const express = require('express');
const serverless = require('serverless-http');
const mongoose = require('mongoose');
const Offer = require('../src/models/Offer');

const app = express();
app.use(express.json());

// Replace with your actual MongoDB Atlas connection string
const { MongoClient, ServerApiVersion } = require('mongodb');
const user = process.env.LCSgts;
const password = process.env.LCSgtsdb1512;
const uri = `mongodb+srv://${user}:${password}@cluster0.3izuovo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);

// List all offers
app.get('/api/offers', async (req, res) => {
  const offers = await Offer.find().sort({ createdAt: -1 });
  res.json(offers);
});

// Create a new offer
app.post('/api/offers', async (req, res) => {
  const { user, item, want } = req.body;
  const offer = new Offer({ user, item, want });
  await offer.save();
  res.status(201).json(offer);
});

// Accept (delete) an offer
app.post('/api/offers/:id/accept', async (req, res) => {
  const offer = await Offer.findByIdAndDelete(req.params.id);
  if (offer) {
    res.json({ accepted: offer });
  } else {
    res.status(404).json({ error: 'Offer not found' });
  }
});

module.exports = serverless(app);