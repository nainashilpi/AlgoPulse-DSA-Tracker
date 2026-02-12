const mongoose = require('mongoose');

const WinnerSchema = new mongoose.Schema({
  weekEnding: { type: Date, required: true }, // Kis Sunday ko jeeta
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String },
  points: { type: Number },
  leetcodeHandle: { type: String },
  profilePic: { type: String },
  stats: {
    totalSolved: Number,
    easySolved: Number,
    mediumSolved: Number,
    hardSolved: Number
  }
}, { timestamps: true });

module.exports = mongoose.model('Winner', WinnerSchema);