const User = require('../models/User');
const Activity = require('../models/Activity');
const { fetchLeetCodeStats } = require('../utils/syncStats');

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      res.json(user); // Poora user object bhej rahe hain stats ke saath
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.syncUserStats = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user || !user.leetcodeHandle) {
      return res.status(400).json({ message: "LeetCode handle not found" });
    }

    const data = await fetchLeetCodeStats(user.leetcodeHandle);

    if (data) {
      // Database Update
      user.stats.solvedCount = data.totalSolved;
      user.stats.easySolved = data.easySolved;
      user.stats.mediumSolved = data.mediumSolved;
      user.stats.hardSolved = data.hardSolved;
      user.stats.submissionCalendar = data.calendar;
      user.stats.topics = data.topics;
      user.stats.lastSync = Date.now();
      
      await user.save();

      // Activity history
      await Activity.create({
        user: user._id,
        solvedCount: data.totalSolved
      });

      res.json({ message: "Stats synced successfully!", stats: user.stats });
    } else {
      res.status(500).json({ message: "Failed to fetch from LeetCode" });
    }
  } catch (error) {
    res.status(500).json({ message: "Sync Error" });
  }
};

exports.getLeaderboard = async (req, res) => {
  try {
    const topUsers = await User.find()
      .select('name profilePic stats leetcodeHandle')
      .sort({ 'stats.solvedCount': -1 }) 
      .limit(100);
    res.json(topUsers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching leaderboard" });
  }
};