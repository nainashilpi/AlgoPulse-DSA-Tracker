const User = require('../models/User');
const Winner = require('../models/Winner');
const { fetchLeetCodeStats, fetchGFGStats } = require('../utils/syncStats.js');

const checkAndAwardBadges = (user) => {
    const earnedBadges = user.badges || [];
    const stats = user.stats || {};
    const totalSolved = stats.totalSolved || 0;
    const streak = user.streak || 0;

    if (streak >= 7 && !earnedBadges.includes("7-Day Streak")) earnedBadges.push("7-Day Streak");
    if (streak >= 30 && !earnedBadges.includes("Monthly Warrior")) earnedBadges.push("Monthly Warrior");
    if (streak >= 100 && !earnedBadges.includes("Consistent King")) earnedBadges.push("Consistent King");
    
    if (totalSolved >= 50 && !earnedBadges.includes("50 Solver")) earnedBadges.push("50 Solver");
    if (totalSolved >= 100 && !earnedBadges.includes("Centurion")) earnedBadges.push("Centurion");
    if (totalSolved >= 500 && !earnedBadges.includes("LeetCode Legend")) earnedBadges.push("LeetCode Legend");

    user.badges = earnedBadges;
};

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
 * @desc Sync Stats - Points Fixed (10/20/40), GFG (15), Multi-solve support
 */
exports.syncStats = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "USER_NOT_FOUND" });

    const [leetData, gfgData] = await Promise.all([
      fetchLeetCodeStats(user.leetcodeHandle),
      user.gfgHandle ? fetchGFGStats(user.gfgHandle) : Promise.resolve({ totalSolved: 0 })
    ]);

    if (!leetData) return res.status(400).json({ message: "LEETCODE_API_FAILURE" });

    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 864e5).toISOString().split('T')[0];

    const newEasy = leetData.easySolved || 0;
    const newMed = leetData.mediumSolved || 0;
    const newHard = leetData.hardSolved || 0;
    const newGFG = gfgData?.totalSolved || 0;

    const oldEasy = user.stats?.easySolved || 0;
    const oldMed = user.stats?.mediumSolved || 0;
    const oldHard = user.stats?.hardSolved || 0;
    const oldGFG = user.stats?.gfgSolved || 0;

    const diffEasy = Math.max(0, newEasy - oldEasy);
    const diffMed = Math.max(0, newMed - oldMed);
    const diffHard = Math.max(0, newHard - oldHard);
    const diffGFG = Math.max(0, newGFG - oldGFG);
    const diffTotal = diffEasy + diffMed + diffHard + diffGFG;

    if (diffTotal > 0) {
      const earnedPoints = (diffEasy * 10) + (diffMed * 20) + (diffHard * 40) + (diffGFG * 15);
      user.points += earnedPoints;

      // Streak Management
      if (user.lastSolveDate === yesterday) {
        user.streak += 1;
      } else if (user.lastSolveDate !== today) {
        user.streak = 1; 
      }
      user.lastSolveDate = today;

      // Heatmap update
      const historyIdx = user.dailyHistory.findIndex(h => h.date === today);
      if (historyIdx !== -1) {
        user.dailyHistory[historyIdx].count += diffTotal;
      } else {
        user.dailyHistory.push({ date: today, count: diffTotal });
      }
    } else {
      if (user.lastSyncDate !== today) {
        if (user.lastSolveDate !== today && user.lastSolveDate !== yesterday) {
          user.streak = 0;
          user.points = Math.max(0, user.points - 5); // Penalty
        }
      }
    }

    // Database update
    user.lastSyncDate = today;
    user.stats = {
      totalSolved: newEasy + newMed + newHard + newGFG,
      gfgSolved: newGFG,
      easySolved: newEasy,
      mediumSolved: newMed,
      hardSolved: newHard
    };

    if (leetData.topics) user.topics = leetData.topics;
    checkAndAwardBadges(user);

    user.markModified('stats');
    user.markModified('dailyHistory');
    user.markModified('points');
    user.markModified('badges');

    await user.save();
    res.json({ status: "SYNC_SUCCESS", earnedPoints: diffTotal > 0 ? (diffEasy * 10 + diffMed * 20 + diffHard * 40 + diffGFG * 15) : 0, user });

  } catch (err) {
    console.error("Sync Error:", err);
    res.status(500).json({ message: "SYNC_INTERNAL_ERROR" });
  }
};

/**
 * @desc 
 */
exports.syncAllUsersData = async () => {
  try {
    const users = await User.find({ leetcodeHandle: { $exists: true, $ne: "" } });
    for (const user of users) {
        
        const leetData = await fetchLeetCodeStats(user.leetcodeHandle);
        if (leetData) {
            
            console.log(`Global Sync background update for: ${user.name}`);
        }
    }
    console.log("--- 🔄 Global Sync Completed ---");
  } catch (err) {
    console.error("Global Sync Error:", err.message);
  }
};

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
