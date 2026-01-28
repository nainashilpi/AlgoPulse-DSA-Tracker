const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  link: { type: String, required: true },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
  date: { type: Date, default: Date.now } // Taaki pata chale kis din ka POTD hai
}, { timestamps: true });

module.exports = mongoose.model('Problem', problemSchema);