const mongoose = require('mongoose');

/**
 * @desc    User Schema for storing profile, LeetCode stats, and gamification data
 */
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
  },
  leetcodeHandle: {
    type: String,
    required: [true, 'Please add your LeetCode handle'],
    unique: true,
    trim: true,
  },
  profilePic: {
    type: String,
    default: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
  },
  role: {
    type: String,
    enum: ['User', 'Admin'],
    default: 'User',
  },
  
  stats: {
    easySolved: { type: Number, default: 0 },
    mediumSolved: { type: Number, default: 0 },
    hardSolved: { type: Number, default: 0 },
    totalSolved: { type: Number, default: 0 },
  },

  points: { 
    type: Number, 
    default: 0 
  }, 
  
  streak: { 
    type: Number, 
    default: 0 
  }, 

  lastSolveDate: { 
    type: String, 
    default: "" 
  }, 

  badges: [{ 
    type: String 
  }], 

  topics: [{ 
    name: { type: String }, 
    solved: { type: Number } 
  }],

  dailyHistory: [{ 
    date: { type: String }, 
    count: { type: Number, default: 0 } 
  }],

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

/**
 * @desc    Middleware to optimize storage by keeping only the last 365 days of activity
 */
userSchema.pre('save', function (next) {
  // Fix: Check if dailyHistory exists and has length
  if (this.dailyHistory && this.dailyHistory.length > 365) {
    this.dailyHistory.shift(); 
  }
  next();
});

module.exports = mongoose.model('User', userSchema);