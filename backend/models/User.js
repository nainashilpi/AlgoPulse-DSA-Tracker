const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['Member', 'Admin'], default: 'Member' },
  profilePic: { type: String, default: "https://api.dicebear.com/7.x/avataaars/svg?seed=default" },
  
  leetcodeHandle: { type: String, default: "" },
  codeforcesHandle: { type: String, default: "" },

  stats: {
    totalPoints: { type: Number, default: 0 },
    solvedCount: { type: Number, default: 0 },
    easySolved: { type: Number, default: 0 },
    mediumSolved: { type: Number, default: 0 },
    hardSolved: { type: Number, default: 0 },
    streak: { type: Number, default: 0 },
    lastSync: { type: Date, default: Date.now },
    // Nayi fields jo humne add ki hain:
    submissionCalendar: { type: String, default: "{}" }, 
    topics: [{
      name: { type: String },
      solved: { type: Number }
    }]
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);