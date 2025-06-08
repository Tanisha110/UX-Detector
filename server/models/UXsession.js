const mongoose = require('mongoose');

const UXSessionSchema = new mongoose.Schema({
  url: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  rawText: { type: String, required: true },
  deviceInfo: { type: Object },
  patterns: { type: [Object], default: [] }
});

module.exports = mongoose.model('UXSession', UXSessionSchema);
