const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
  user: { type: String, required: true },
  item: { type: String, required: true },
  want: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Offer', offerSchema);