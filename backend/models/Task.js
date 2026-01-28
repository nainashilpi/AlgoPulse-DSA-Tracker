const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  link: { type: String, required: true },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
  type: { type: String, enum: ['Daily', 'Weekly'], default: 'Daily' },
  points: { type: Number, default: 10 },
  activeUntil: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);