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

const User = require('../models/User');
const Winner = require('../models/Winner');
const { fetchLeetCodeStats } = require('../utils/syncStats.js');

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
 * @desc Sync Stats for single user - FIXED: Added Heatmap Update Logic
 */
exports.syncStats = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "NODE_NOT_FOUND" });
    
    const leetData = await fetchLeetCodeStats(user.leetcodeHandle);
    if (!leetData) return res.status(400).json({ message: "LEETCODE_API_FAILURE" });

    // 1. Points and Streak Logic (Same as before)
    const diffTotal = leetData.totalSolved - (user.stats.totalSolved || 0);
    if (diffTotal > 0) {
      user.points += (diffTotal * 15);
      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date(Date.now() - 864e5).toISOString().split('T')[0];
      user.streak = (user.lastSolveDate === yesterday) ? user.streak + 1 : 1;
      user.lastSolveDate = today;
    }

    // 2. HEATMAP FIX: Convert LeetCode Calendar to dailyHistory
    if (leetData.calendar) {
      const calendarObj = JSON.parse(leetData.calendar);
      user.dailyHistory = Object.keys(calendarObj).map(timestamp => ({
        date: new Date(timestamp * 1000).toISOString().split('T')[0],
        count: calendarObj[timestamp]
      }));
    }

    // 3. Stats and Topics Update
    user.stats = {
      totalSolved: leetData.totalSolved,
      easySolved: leetData.easySolved,
      mediumSolved: leetData.mediumSolved,
      hardSolved: leetData.hardSolved
    };
    if (leetData.topics) user.topics = leetData.topics;

    user.markModified('dailyHistory'); 
    user.markModified('stats');
    await user.save();
    
    res.json({ status: "SYNC_SUCCESS", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "SYNC_INTERNAL_ERROR" });
  }
};

/**
 * @desc Background Sync for all users
 */
exports.syncAllUsersData = async () => {
  try {
    const users = await User.find({ leetcodeHandle: { $exists: true, $ne: "" } });
    for (const user of users) {
      const leetData = await fetchLeetCodeStats(user.leetcodeHandle);
      if (leetData) {
        // Update stats and heatmap for background sync too
        if (leetData.calendar) {
          const calendarObj = JSON.parse(leetData.calendar);
          user.dailyHistory = Object.keys(calendarObj).map(timestamp => ({
            date: new Date(timestamp * 1000).toISOString().split('T')[0],
            count: calendarObj[timestamp]
          }));
        }
        user.stats = { ...leetData };
        user.markModified('dailyHistory');
        await user.save();
      }
    }
    console.log("--- 🔄 Global Sync Completed ---");
  } catch (err) {
    console.error("Global Sync Error:", err.message);
  }
};

/**
 * @desc Declare Weekly Winner
 */
exports.declareWeeklyWinner = async (req, res) => {
  try {
    const topUser = await User.findOne({ role: { $nin: ['Admin', 'admin'] }, points: { $gt: 0 } })
      .sort({ points: -1, 'stats.totalSolved': -1 }).lean();

    if (!topUser) return res.status(404).json({ message: "ZERO_ACTIVITY_DETECTED" });

    const newWinner = new Winner({
      weekEnding: new Date(),
      userId: topUser._id,
      name: topUser.name || topUser.username,
      points: topUser.points,
      leetcodeHandle: topUser.leetcodeHandle,
      profilePic: topUser.profilePic,
      stats: topUser.stats
    });

    await newWinner.save();
    res.status(200).json({ message: "CHAMPION_CROWNED_SUCCESSFULLY", winner: newWinner });
  } catch (err) {
    res.status(500).json({ message: "WINNER_LOG_FAILURE" });
  }
};

/**
 * @desc Fetch Hall of Fame
 */
exports.getHallOfFame = async (req, res) => {
  try {
    const winners = await Winner.find().sort({ weekEnding: -1 }).lean();
    res.status(200).json(winners);
  } catch (err) {
    res.status(500).json({ message: "FETCH_HOF_ERROR" });
  }
};

/**
 * @desc Delete Winner Entry
 */
exports.deleteWinner = async (req, res) => {
  try {
    await Winner.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "RECORD_PURGED" });
  } catch (err) {
    res.status(500).json({ message: "PURGE_ERROR" });
  }
};

/**
 * @desc Seasonal Reset
 */
exports.resetAllPoints = async (req, res) => {
  try {
    await User.updateMany({}, { $set: { points: 0 } });
    res.status(200).json({ message: "SEASONAL_RESET_COMPLETE" });
  } catch (err) {
    res.status(500).json({ message: "RESET_FAILURE" });
  }
};