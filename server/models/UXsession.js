const mongoose = require('mongoose');

const UXSessionSchema = new mongoose.Schema({
  url: String,
  rawText: String,
  headings: [String],
  buttons: [String],
  alerts: [String],
  deviceInfo: Object,
  timestamp: String  // 👈 store it as string (ISO format in IST)
}, { timestamps: true }); // still keeps createdAt and updatedAt in UTC

module.exports = mongoose.model('UXSession', UXSessionSchema);
