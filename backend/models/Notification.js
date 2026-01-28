const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  message: { type: String, required: true },
  type: { type: String, enum: ['Alert', 'Update', 'Promotion'], default: 'Update' },
  createdBy: { type: String, default: "Naina Shilpi (Head of DSA)" },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);