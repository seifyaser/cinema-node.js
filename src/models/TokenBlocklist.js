const mongoose = require('mongoose');

const tokenBlocklistSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
}, { timestamps: true });

// TTL index to automatically remove the document when the token expires
tokenBlocklistSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('TokenBlocklist', tokenBlocklistSchema);
