// const User = require('../models/User');
// const Winner = require('../models/Winner');
// const { fetchLeetCodeStats } = require('../utils/syncStats.js');

// /**
//  * @desc Get Leaderboard
//  */
// exports.getLeaderboard = async (req, res) => {
//   try {
//     const users = await User.find({ role: { $nin: ['Admin', 'admin'] } })
//       .sort({ points: -1, 'stats.totalSolved': -1 })
//       .select('-password').lean();
//     const rankedUsers = users.map((u, index) => ({ ...u, rank: index + 1 }));
//     res.status(200).json(rankedUsers);
//   } catch (err) {
//     res.status(500).json({ message: "SYSTEM_ERROR_LEADERBOARD" });
//   }
// };

// /**
//  * @desc Get User Profile
//  */
// exports.getUserProfile = async (req, res) => {
//   try {
//     const user = await User.findById(req.user._id).select('-password');
//     res.json(user);
//   } catch (err) {
//     res.status(500).json({ message: "PROFILE_FETCH_ERROR" });
//   }
// };

// /**
//  * @desc Update Avatar
//  */
// exports.updateAvatar = async (req, res) => {
//   try {
//     const { profilePic } = req.body;
//     await User.findByIdAndUpdate(req.user._id, { profilePic });
//     res.json({ message: "AVATAR_UPDATED" });
//   } catch (err) {
//     res.status(500).json({ message: "AVATAR_UPDATE_ERROR" });
//   }
// };

// /**
//  * @desc Sync Stats for single user
//  */
// exports.syncStats = async (req, res) => {
//   try {
//     const user = await User.findById(req.user._id);
//     if (!user) return res.status(404).json({ message: "NODE_NOT_FOUND" });
    
//     const leetData = await fetchLeetCodeStats(user.leetcodeHandle);
//     if (!leetData) return res.status(400).json({ message: "LEETCODE_API_FAILURE" });

//     const diffTotal = leetData.totalSolved - (user.stats.totalSolved || 0);
//     if (diffTotal > 0) {
//       user.points += (diffTotal * 15);
//       const today = new Date().toISOString().split('T')[0];
//       const yesterday = new Date(Date.now() - 864e5).toISOString().split('T')[0];
//       user.streak = (user.lastSolveDate === yesterday) ? user.streak + 1 : 1;
//       user.lastSolveDate = today;
//     }
//     user.stats = { ...leetData };
//     await user.save();
//     res.json({ status: "SYNC_SUCCESS", user });
//   } catch (err) {
//     res.status(500).json({ message: "SYNC_INTERNAL_ERROR" });
//   }
// };

// /**
//  * @desc Background Sync for all users (Required by server.js line 174)
//  */
// exports.syncAllUsersData = async () => {
//   try {
//     const users = await User.find({ leetcodeHandle: { $exists: true, $ne: "" } });
//     for (const user of users) {
//       const leetData = await fetchLeetCodeStats(user.leetcodeHandle);
//       if (leetData) {
//         user.stats = { ...leetData };
//         await user.save();
//       }
//     }
//     console.log("--- 🔄 Global Sync Completed ---");
//   } catch (err) {
//     console.error("Global Sync Error:", err.message);
//   }
// };

// /**
//  * @desc Declare Weekly Winner - FIX: Creates new record for streaks
//  */
// exports.declareWeeklyWinner = async (req, res) => {
//   try {
//     const topUser = await User.findOne({ role: { $nin: ['Admin', 'admin'] }, points: { $gt: 0 } })
//       .sort({ points: -1, 'stats.totalSolved': -1 }).lean();

//     if (!topUser) return res.status(404).json({ message: "ZERO_ACTIVITY_DETECTED" });

//     const newWinner = new Winner({
//       weekEnding: new Date(),
//       userId: topUser._id,
//       name: topUser.name || topUser.username,
//       points: topUser.points,
//       leetcodeHandle: topUser.leetcodeHandle,
//       profilePic: topUser.profilePic,
//       stats: topUser.stats
//     });

//     await newWinner.save();
//     res.status(200).json({ message: "CHAMPION_CROWNED_SUCCESSFULLY", winner: newWinner });
//   } catch (err) {
//     res.status(500).json({ message: "WINNER_LOG_FAILURE" });
//   }
// };

// /**
//  * @desc Fetch Hall of Fame
//  */
// exports.getHallOfFame = async (req, res) => {
//   try {
//     const winners = await Winner.find().sort({ weekEnding: -1 }).lean();
//     res.status(200).json(winners);
//   } catch (err) {
//     res.status(500).json({ message: "FETCH_HOF_ERROR" });
//   }
// };

// /**
//  * @desc Delete Winner Entry
//  */
// exports.deleteWinner = async (req, res) => {
//   try {
//     await Winner.findByIdAndDelete(req.params.id);
//     res.status(200).json({ message: "RECORD_PURGED" });
//   } catch (err) {
//     res.status(500).json({ message: "PURGE_ERROR" });
//   }
// };

// /**
//  * @desc Seasonal Reset
//  */
// exports.resetAllPoints = async (req, res) => {
//   try {
//     await User.updateMany({}, { $set: { points: 0 } });
//     res.status(200).json({ message: "SEASONAL_RESET_COMPLETE" });
//   } catch (err) {
//     res.status(500).json({ message: "RESET_FAILURE" });
//   }
// };

// const User = require('../models/User');
// const Winner = require('../models/Winner');
// const { fetchLeetCodeStats } = require('../utils/syncStats.js');

// /**
//  * @desc Get Leaderboard
//  */
// exports.getLeaderboard = async (req, res) => {
//   try {
//     const users = await User.find({ role: { $nin: ['Admin', 'admin'] } })
//       .sort({ points: -1, 'stats.totalSolved': -1 })
//       .select('-password').lean();
//     const rankedUsers = users.map((u, index) => ({ ...u, rank: index + 1 }));
//     res.status(200).json(rankedUsers);
//   } catch (err) {
//     res.status(500).json({ message: "SYSTEM_ERROR_LEADERBOARD" });
//   }
// };

// /**
//  * @desc Get User Profile
//  */
// exports.getUserProfile = async (req, res) => {
//   try {
//     const user = await User.findById(req.user._id).select('-password');
//     res.json(user);
//   } catch (err) {
//     res.status(500).json({ message: "PROFILE_FETCH_ERROR" });
//   }
// };

// /**
//  * @desc Update Avatar
//  */
// exports.updateAvatar = async (req, res) => {
//   try {
//     const { profilePic } = req.body;
//     await User.findByIdAndUpdate(req.user._id, { profilePic });
//     res.json({ message: "AVATAR_UPDATED" });
//   } catch (err) {
//     res.status(500).json({ message: "AVATAR_UPDATE_ERROR" });
//   }
// };

// // /**
// //  * @desc Sync Stats for single user - FIXED: Added Heatmap Update Logic
// //  */
// // exports.syncStats = async (req, res) => {
// //   try {
// //     const user = await User.findById(req.user._id);
// //     if (!user) return res.status(404).json({ message: "NODE_NOT_FOUND" });
    
// //     const leetData = await fetchLeetCodeStats(user.leetcodeHandle);
// //     if (!leetData) return res.status(400).json({ message: "LEETCODE_API_FAILURE" });

// //     // 1. Points and Streak Logic (Same as before)
// //     const diffTotal = leetData.totalSolved - (user.stats.totalSolved || 0);
// //     if (diffTotal > 0) {
// //       user.points += (diffTotal * 15);
// //       const today = new Date().toISOString().split('T')[0];
// //       const yesterday = new Date(Date.now() - 864e5).toISOString().split('T')[0];
// //       user.streak = (user.lastSolveDate === yesterday) ? user.streak + 1 : 1;
// //       user.lastSolveDate = today;
// //     }

// //     // 2. HEATMAP FIX: Convert LeetCode Calendar to dailyHistory
// //     if (leetData.calendar) {
// //       const calendarObj = JSON.parse(leetData.calendar);
// //       user.dailyHistory = Object.keys(calendarObj).map(timestamp => ({
// //         date: new Date(timestamp * 1000).toISOString().split('T')[0],
// //         count: calendarObj[timestamp]
// //       }));
// //     }

// //     // 3. Stats and Topics Update
// //     user.stats = {
// //       totalSolved: leetData.totalSolved,
// //       easySolved: leetData.easySolved,
// //       mediumSolved: leetData.mediumSolved,
// //       hardSolved: leetData.hardSolved
// //     };
// //     if (leetData.topics) user.topics = leetData.topics;

// //     user.markModified('dailyHistory'); 
// //     user.markModified('stats');
// //     await user.save();
    
// //     res.json({ status: "SYNC_SUCCESS", user });
// //   } catch (err) {
// //     console.error(err);
// //     res.status(500).json({ message: "SYNC_INTERNAL_ERROR" });
// //   }
// // };

// exports.syncStats = async (req, res) => {
//   try {
//     const user = await User.findById(req.user._id);
//     if (!user) return res.status(404).json({ message: "NODE_NOT_FOUND" });
    
//     const leetData = await fetchLeetCodeStats(user.leetcodeHandle);
//     if (!leetData) return res.status(400).json({ message: "LEETCODE_API_FAILURE" });

//     const today = new Date().toISOString().split('T')[0];
//     const yesterday = new Date(Date.now() - 864e5).toISOString().split('T')[0];
    
//     const oldSolved = user.stats.totalSolved || 0;
//     const newSolved = leetData.totalSolved || 0;
//     const diffTotal = newSolved - oldSolved;

//     // --- POINTS & STREAK LOGIC ---
//     if (diffTotal > 0) {
//       // Case 1: Naya solve kiya hai
//       user.points += (diffTotal * 15);
      
//       if (user.lastSolveDate === yesterday) {
//         user.streak += 1;
//       } else if (user.lastSolveDate !== today) {
//         user.streak = 1; 
//       }
//       user.lastSolveDate = today;

//     } else {
//       // Case 2: Aaj kuch naya solve nahi kiya
      
//       // Streak Reset Check
//       if (user.lastSolveDate !== today && user.lastSolveDate !== yesterday) {
//         user.streak = 0;
//       }

//       // PENALTY -5 (Din mein sirf ek baar)
//       if (user.lastSyncDate !== today) {
//         user.points = Math.max(0, user.points - 5);
//       }
//     }

//     // Aaj ki sync record karo taaki penalty repeat na ho
//     user.lastSyncDate = today;

//     // --- HEATMAP & STATS UPDATE ---
//     if (leetData.calendar) {
//       const calendarObj = JSON.parse(leetData.calendar);
//       user.dailyHistory = Object.keys(calendarObj).map(timestamp => ({
//         date: new Date(timestamp * 1000).toISOString().split('T')[0],
//         count: calendarObj[timestamp]
//       }));
//     }

//     user.stats = {
//       totalSolved: leetData.totalSolved,
//       easySolved: leetData.easySolved,
//       mediumSolved: leetData.mediumSolved,
//       hardSolved: leetData.hardSolved
//     };
//     if (leetData.topics) user.topics = leetData.topics;

//     // Force Mongoose to recognize updates
//     user.markModified('dailyHistory'); 
//     user.markModified('stats');
//     user.markModified('points');
    
//     await user.save();
//     res.json({ status: "SYNC_SUCCESS", user });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "SYNC_INTERNAL_ERROR" });
//   }
// };

// /**
//  * @desc Background Sync for all users
//  */
// exports.syncAllUsersData = async () => {
//   try {
//     const users = await User.find({ leetcodeHandle: { $exists: true, $ne: "" } });
//     for (const user of users) {
//       const leetData = await fetchLeetCodeStats(user.leetcodeHandle);
//       if (leetData) {
//         // Update stats and heatmap for background sync too
//         if (leetData.calendar) {
//           const calendarObj = JSON.parse(leetData.calendar);
//           user.dailyHistory = Object.keys(calendarObj).map(timestamp => ({
//             date: new Date(timestamp * 1000).toISOString().split('T')[0],
//             count: calendarObj[timestamp]
//           }));
//         }
//         user.stats = { ...leetData };
//         user.markModified('dailyHistory');
//         await user.save();
//       }
//     }
//     console.log("--- 🔄 Global Sync Completed ---");
//   } catch (err) {
//     console.error("Global Sync Error:", err.message);
//   }
// };

// /**
//  * @desc Declare Weekly Winner
//  */
// exports.declareWeeklyWinner = async (req, res) => {
//   try {
//     const topUser = await User.findOne({ role: { $nin: ['Admin', 'admin'] }, points: { $gt: 0 } })
//       .sort({ points: -1, 'stats.totalSolved': -1 }).lean();

//     if (!topUser) return res.status(404).json({ message: "ZERO_ACTIVITY_DETECTED" });

//     const newWinner = new Winner({
//       weekEnding: new Date(),
//       userId: topUser._id,
//       name: topUser.name || topUser.username,
//       points: topUser.points,
//       leetcodeHandle: topUser.leetcodeHandle,
//       profilePic: topUser.profilePic,
//       stats: topUser.stats
//     });

//     await newWinner.save();
//     res.status(200).json({ message: "CHAMPION_CROWNED_SUCCESSFULLY", winner: newWinner });
//   } catch (err) {
//     res.status(500).json({ message: "WINNER_LOG_FAILURE" });
//   }
// };

// /**
//  * @desc Fetch Hall of Fame
//  */
// exports.getHallOfFame = async (req, res) => {
//   try {
//     const winners = await Winner.find().sort({ weekEnding: -1 }).lean();
//     res.status(200).json(winners);
//   } catch (err) {
//     res.status(500).json({ message: "FETCH_HOF_ERROR" });
//   }
// };

// /**
//  * @desc Delete Winner Entry
//  */
// exports.deleteWinner = async (req, res) => {
//   try {
//     await Winner.findByIdAndDelete(req.params.id);
//     res.status(200).json({ message: "RECORD_PURGED" });
//   } catch (err) {
//     res.status(500).json({ message: "PURGE_ERROR" });
//   }
// };

// /**
//  * @desc Seasonal Reset
//  */
// exports.resetAllPoints = async (req, res) => {
//   try {
//     await User.updateMany({}, { $set: { points: 0 } });
//     res.status(200).json({ message: "SEASONAL_RESET_COMPLETE" });
//   } catch (err) {
//     res.status(500).json({ message: "RESET_FAILURE" });
//   }
// };

const User = require('../models/User');
const Winner = require('../models/Winner');
const { fetchLeetCodeStats, fetchGFGStats } = require('../utils/syncStats.js');

// --- Helper Function: Badges Logic ---
const checkAndAwardBadges = (user) => {
    const earnedBadges = user.badges || [];
    const stats = user.stats || {};
    const totalSolved = stats.totalSolved || 0;
    const streak = user.streak || 0;

    // Badges Criteria
    if (streak >= 7 && !earnedBadges.includes("7-Day Streak")) earnedBadges.push("7-Day Streak");
    if (streak >= 30 && !earnedBadges.includes("Monthly Warrior")) earnedBadges.push("Monthly Warrior");
    if (streak >= 100 && !earnedBadges.includes("Consistent King")) earnedBadges.push("Consistent King");
    
    if (totalSolved >= 50 && !earnedBadges.includes("50 Solver")) earnedBadges.push("50 Solver");
    if (totalSolved >= 100 && !earnedBadges.includes("Centurion")) earnedBadges.push("Centurion");
    if (totalSolved >= 500 && !earnedBadges.includes("LeetCode Legend")) earnedBadges.push("LeetCode Legend");

    user.badges = earnedBadges;
};
// -------------------------------------

/**
 * @desc Get Leaderboard
 */
exports.getLeaderboard = async (req, res) => {
  try {
   const users = await User.find({ role: { $nin: ['Admin', 'admin'] } })
     .sort({ points: -1, 'stats.totalSolved': -1 })
     .select('-password').lean();
   const rankedUsers = users.map((u, index) => ({ ...u, rank: index + 1 }));
   res.status(200).json(rankedUsers);
  } catch (err) {
   res.status(500).json({ message: "SYSTEM_ERROR_LEADERBOARD" });
  }
};

/**
 * @desc Get User Profile
 */
exports.getUserProfile = async (req, res) => {
  try {
   const user = await User.findById(req.user._id).select('-password');
   res.json(user);
  } catch (err) {
   res.status(500).json({ message: "PROFILE_FETCH_ERROR" });
  }
};

/**
 * @desc Update Avatar
 */
exports.updateAvatar = async (req, res) => {
  try {
   const { profilePic } = req.body;
   await User.findByIdAndUpdate(req.user._id, { profilePic });
   res.json({ message: "AVATAR_UPDATED" });
  } catch (err) {
   res.status(500).json({ message: "AVATAR_UPDATE_ERROR" });
  }
};

/**
 * @desc Sync Stats - FIXED: Points (10/20/40), GFG Support, Night Penalty & Custom Heatmap + Badges Logic
 */
exports.syncStats = async (req, res) => {
  try {
   const user = await User.findById(req.user._id);
   if (!user) return res.status(404).json({ message: "NODE_NOT_FOUND" });

   // 1. Fetch data from LeetCode & GFG
   const [leetData, gfgData] = await Promise.all([
     fetchLeetCodeStats(user.leetcodeHandle),
     user.gfgHandle ? fetchGFGStats(user.gfgHandle) : Promise.resolve(null)
   ]);

   if (!leetData) return res.status(400).json({ message: "LEETCODE_API_FAILURE" });

   // 2. Dates
   const today = new Date().toISOString().split('T')[0];
   const yesterday = new Date(Date.now() - 864e5).toISOString().split('T')[0];

   // 3. Difference Logic
   const newLC = leetData.totalSolved || 0;
   const newGFG = gfgData?.totalSolved || 0;
   const newTotalSolved = newLC + newGFG;

   const oldLC = user.stats?.totalSolved || 0;
   const oldGFG = user.stats?.gfgSolved || 0;
   
   const diffLC = newLC - oldLC;
   const diffGFG = newGFG - oldGFG;
   const diffTotal = diffLC + diffGFG;

   // --- CASE 1: NAYA SOLVE MILA ---
   if (diffTotal > 0) {
     const easyDiff = Math.max(0, leetData.easySolved - (user.stats?.easySolved || 0));
     const medDiff = Math.max(0, leetData.mediumSolved - (user.stats?.mediumSolved || 0));
     const hardDiff = Math.max(0, leetData.hardSolved - (user.stats?.hardSolved || 0));

     let earnedPoints = (easyDiff * 10) + (medDiff * 20) + (hardDiff * 40);
     if (diffGFG > 0) earnedPoints += (diffGFG * 15);

     user.points += earnedPoints;

     // Streak Logic
     if (user.lastSolveDate === yesterday) {
      user.streak += 1;
     } else if (user.lastSolveDate !== today) {
      user.streak = 1; 
     }
     user.lastSolveDate = today;

     // Custom Heatmap
     const historyIdx = user.dailyHistory.findIndex(h => h.date === today);
     if (historyIdx !== -1) {
      user.dailyHistory[historyIdx].count += diffTotal;
     } else {
      user.dailyHistory.push({ date: today, count: diffTotal });
     }
      
      // --- ADDED: Check badges when solved ---
      checkAndAwardBadges(user);
   } 
   // --- CASE 2: KUCH SOLVE NAHI KIYA ---
   else {
     if (user.lastSyncDate !== today) {
       if (user.lastSolveDate !== today && user.lastSolveDate !== yesterday) {
         user.streak = 0;
         user.points = Math.max(0, user.points - 5);
       }
     }
      
      // --- ADDED: Check badges even if penalty happens (for streak/totalSolved changes) ---
      checkAndAwardBadges(user);
   }

     // 4. Update Database Fields
   user.lastSyncDate = today;
   user.stats = {
     totalSolved: newTotalSolved,
     gfgSolved: newGFG, 
     easySolved: leetData.easySolved,
     mediumSolved: leetData.mediumSolved,
     hardSolved: leetData.hardSolved
   };

    if (leetData.topics) user.topics = leetData.topics;

    user.markModified('stats');
    user.markModified('dailyHistory');
    user.markModified('points');
    user.markModified('badges'); // Mark badges modified

   await user.save();
   res.json({ status: "SYNC_SUCCESS", user });

  } catch (err) {
   console.error("Sync Error:", err);
   res.status(500).json({ message: "SYNC_INTERNAL_ERROR" });
  }
};

/**
 * @desc Background Global Sync
 */
exports.syncAllUsersData = async () => {
  try {
   const users = await User.find({ leetcodeHandle: { $exists: true, $ne: "" } });
   for (const user of users) {
     const leetData = await fetchLeetCodeStats(user.leetcodeHandle);
     if (leetData) {
        // --- ADDED: Global sync mein bhi badges check karo ---
      user.stats = { 
         ...user.stats, 
         totalSolved: leetData.totalSolved,
         easySolved: leetData.easySolved,
         mediumSolved: leetData.mediumSolved,
         hardSolved: leetData.hardSolved
      };
        checkAndAwardBadges(user);
        user.markModified('badges');
      await user.save();
     }
   }
   console.log("--- 🔄 Global Sync Completed ---");
  } catch (err) {
   console.error("Global Sync Error:", err.message);
  }
};

// ... Rest of the functions (declareWeeklyWinner, etc.) are already correct ...
exports.declareWeeklyWinner = async (req, res) => {
    try {
        const topUser = await User.findOne({ role: { $nin: ['Admin', 'admin'] }, points: { $gt: 0 } })
            .sort({ points: -1, 'stats.totalSolved': -1 }).lean();
        if (!topUser) return res.status(404).json({ message: "ZERO_ACTIVITY_DETECTED" });
        const newWinner = new Winner({
            weekEnding: new Date(),
            userId: topUser._id,
            name: topUser.name,
            points: topUser.points,
            leetcodeHandle: topUser.leetcodeHandle,
            profilePic: topUser.profilePic,
            stats: topUser.stats
        });
        await newWinner.save();
        res.status(200).json({ message: "CHAMPION_CROWNED", winner: newWinner });
    } catch (err) {
        res.status(500).json({ message: "WINNER_LOG_FAILURE" });
    }
};

exports.getHallOfFame = async (req, res) => {
    try {
        const winners = await Winner.find().sort({ weekEnding: -1 }).lean();
        res.status(200).json(winners);
    } catch (err) {
        res.status(500).json({ message: "FETCH_HOF_ERROR" });
    }
};

exports.deleteWinner = async (req, res) => {
    try {
        await Winner.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "RECORD_PURGED" });
    } catch (err) {
        res.status(500).json({ message: "PURGE_ERROR" });
    }
};

exports.resetAllPoints = async (req, res) => {
    try {
        await User.updateMany({}, { $set: { points: 0, streak: 0, badges: [] } });
        res.status(200).json({ message: "SEASONAL_RESET_COMPLETE" });
    } catch (err) {
        res.status(500).json({ message: "RESET_FAILURE" });
    }
};