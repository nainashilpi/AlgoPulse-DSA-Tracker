// const mongoose = require('mongoose');

// /**
//  * @desc    User Schema for storing profile, LeetCode stats, and gamification data
//  */
// const userSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: [true, 'Please add a name'],
//   },
//   email: {
//     type: String,
//     required: [true, 'Please add an email'],
//     unique: true,
//     trim: true,
//     lowercase: true,
//   },
//   password: {
//     type: String,
//     required: [true, 'Please add a password'],
//   },
//   leetcodeHandle: {
//     type: String,
//     required: [true, 'Please add your LeetCode handle'],
//     unique: true,
//     trim: true,
//   },
//   profilePic: {
//     type: String,
//     default: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
//   },
//   role: {
//     type: String,
//     enum: ['User', 'Admin'],
//     default: 'User',
//   },
  
//   /**
//    * CORE STATS: Aggregated data fetched from LeetCode
//    */
//   stats: {
//     easySolved: { type: Number, default: 0 },
//     mediumSolved: { type: Number, default: 0 },
//     hardSolved: { type: Number, default: 0 },
//     totalSolved: { type: Number, default: 0 },
//   },

//   /**
//    * GAMIFICATION LOGIC: Points, Streaks, and Ranking Metrics
//    */
//   points: { 
//     type: Number, 
//     default: 0 
//   }, // Primary metric for Leaderboard ranking
  
//   streak: { 
//     type: Number, 
//     default: 0 
//   }, // Continuous daily activity counter

//   lastSolveDate: { 
//     type: String, 
//     default: "" 
//   }, // Format: "YYYY-MM-DD" for daily streak validation

//   badges: [{ 
//     type: String 
//   }], // Achievements like ["Bronze Warrior", "Streak King"]

//   /**
//    * HEATMAP & ACTIVITY HISTORY
//    * Stores daily problem counts. Format: [{ date: "2024-05-20", count: 3 }]
//    */
//   dailyHistory: [{ 
//     date: { type: String }, 
//     count: { type: Number, default: 0 } 
//   }],

//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// /**
//  * @desc    Middleware to optimize storage by keeping only the last 365 days of activity
//  */
// userSchema.pre('save', function (next) {
//   if (this.dailyHistory.length > 365) {
//     this.dailyHistory.shift(); // Remove the oldest entry if history exceeds 1 year
//   }
//   next();
// });

// module.exports = mongoose.model('User', userSchema);


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
  
  /**
   * CORE STATS: Aggregated data fetched from LeetCode
   */
  stats: {
    easySolved: { type: Number, default: 0 },
    mediumSolved: { type: Number, default: 0 },
    hardSolved: { type: Number, default: 0 },
    totalSolved: { type: Number, default: 0 },
  },

  /**
   * GAMIFICATION LOGIC: Points, Streaks, and Ranking Metrics
   */
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

  /**
   * REAL-TIME TOPICS: Data fetched from LeetCode tags
   * This is used to display the "Algorithm Decomposition" section
   */
  topics: [{ 
    name: { type: String }, 
    solved: { type: Number } 
  }],

  /**
   * HEATMAP & ACTIVITY HISTORY
   * Stores daily problem counts. Format: [{ date: "2024-05-20", count: 3 }]
   */
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
  if (this.dailyHistory.length > 365) {
    this.dailyHistory.shift(); 
  }
  next();
});

module.exports = mongoose.model('User', userSchema);