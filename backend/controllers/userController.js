const User = require('../models/User');
const { fetchLeetCodeStats } = require('../utils/syncStats.js');

// 1. Get Leaderboard (Ranking fix)
exports.getLeaderboard = async (req, res) => {
  try {
    const users = await User.find({})
      .sort({ points: -1 })
      .select('-password')
      .lean(); // .lean() performance ke liye aur objects ko modify karne ke liye best hai
    
    // Index ke base par rank add karna
    const rankedUsers = users.map((u, index) => ({
      ...u,
      rank: index + 1
    }));

    res.status(200).json(rankedUsers);
  } catch (err) {
    console.error("Leaderboard Error:", err.message);
    res.status(500).json({ message: "Error fetching leaderboard" });
  }
};

// 2. Get User Profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// 3. Sync LeetCode Stats (Using your GraphQL Helper)
exports.syncStats = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User node not found" });
    
    // GraphQL Helper se data fetch karna
    const leetData = await fetchLeetCodeStats(user.leetcodeHandle);
    
    if (!leetData) {
      return res.status(400).json({ message: "LeetCode user not found or API error" });
    }

    // Points calculation (Only if solves increased)
    const diffEasy = leetData.easySolved - (user.stats.easySolved || 0);
    const diffMedium = leetData.mediumSolved - (user.stats.mediumSolved || 0);
    const diffHard = leetData.hardSolved - (user.stats.hardSolved || 0);
    const totalNew = diffEasy + diffMedium + diffHard;

    if (totalNew > 0) {
      const earnedPoints = (diffEasy * 10) + (diffMedium * 20) + (diffHard * 40);
      user.points += earnedPoints;

      // Streak Logic
      const today = new Date().toISOString().split('T')[0];
      const yesterdayDate = new Date();
      yesterdayDate.setDate(yesterdayDate.getDate() - 1);
      const yesterdayStr = yesterdayDate.toISOString().split('T')[0];

      if (user.lastSolveDate === yesterdayStr) {
        user.streak += 1;
      } else if (user.lastSolveDate !== today) {
        user.streak = 1;
      }

      user.lastSolveDate = today;
    }

    // --- UPDATE USER FIELDS ---
    user.stats = {
      easySolved: leetData.easySolved,
      mediumSolved: leetData.mediumSolved,
      hardSolved: leetData.hardSolved,
      totalSolved: leetData.totalSolved
    };

    user.topics = leetData.topics;

    // --- BADGES ENGINE ---
    let earnedBadges = [...user.badges];
    const total = leetData.totalSolved;
    const currentStreak = user.streak || 0;

    const badgesConfig = [
      { t: 50, n: "50 Solver" }, { t: 100, n: "Centurion" }, { t: 500, n: "LeetCode Legend" },
      { d: 7, n: "7-Day Streak" }, { d: 30, n: "Monthly Warrior" }, { d: 100, n: "Consistent King" }
    ];

    badgesConfig.forEach(b => {
      if (b.t && total >= b.t && !earnedBadges.includes(b.n)) earnedBadges.push(b.n);
      if (b.d && currentStreak >= b.d && !earnedBadges.includes(b.n)) earnedBadges.push(b.n);
    });

    user.badges = earnedBadges;

    // --- HEATMAP UPDATE ---
    const todayStr = new Date().toISOString().split('T')[0];
    const hIndex = user.dailyHistory.findIndex(h => h.date === todayStr);
    
    // Count ko safely update karna
    if (hIndex > -1) {
      user.dailyHistory[hIndex].count = total;
    } else {
      user.dailyHistory.push({ date: todayStr, count: total });
    }

    await user.save();
    res.json({ message: "Sync Successful!", user });

  } catch (err) {
    console.error("Sync Controller Error:", err.message);
    res.status(500).json({ message: "Internal Server Error during sync" });
  }
};

// 4. Update Avatar
exports.updateAvatar = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
          req.user._id, 
          { profilePic: req.body.profilePic }, 
          { new: true, runValidators: true }
        ).select('-password');
        res.json(user);
    } catch (err) { 
        console.error("Avatar Update Error:", err.message);
        res.status(500).json({ message: "Update Failed" }); 
    }
};