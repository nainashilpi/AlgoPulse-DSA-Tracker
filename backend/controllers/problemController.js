const Problem = require('../models/Problem');

// @desc    Post a new Problem of the Day
// @access  Private/Admin
exports.addProblem = async (req, res) => {
  try {
    const { title, link, difficulty } = req.body;
    const problem = new Problem({ title, link, difficulty });
    await problem.save();
    res.status(201).json({ message: "POTD added successfully!", problem });
  } catch (error) {
    res.status(500).json({ message: "Error adding problem" });
  }
};

// @desc    Get latest Problem of the Day
// @access  Public
exports.getLatestProblem = async (req, res) => {
  try {
    const latestProblem = await Problem.findOne().sort({ createdAt: -1 });
    res.json(latestProblem);
  } catch (error) {
    res.status(500).json({ message: "Error fetching problem" });
  }
};