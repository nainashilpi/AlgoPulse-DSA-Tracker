const Problem = require('../models/Problem');

/**
 * @desc    Post a new Problem of the Day
 * @access  Private/Admin
 */
exports.addProblem = async (req, res) => {
  try {
    const { title, link, difficulty } = req.body;
    
    // Safety: Check if fields are missing
    if (!title || !link) {
      return res.status(400).json({ message: "Title and Link are required" });
    }

    const problem = new Problem({ title, link, difficulty });
    await problem.save();
    res.status(201).json({ message: "POTD added successfully!", problem });
  } catch (error) {
    console.error("Add Problem Error:", error.message);
    res.status(500).json({ message: "Error adding problem" });
  }
};

/**
 * @desc    Update an existing Problem
 * @access  Private/Admin
 */
exports.updateProblem = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, link, difficulty } = req.body;
    
    const updatedProblem = await Problem.findByIdAndUpdate(
      id,
      { title, link, difficulty },
      { new: true, runValidators: true } // runValidators ensures schema rules are followed
    );

    if (!updatedProblem) return res.status(404).json({ message: "Problem not found" });

    res.json({ message: "POTD updated successfully!", updatedProblem });
  } catch (error) {
    console.error("Update Problem Error:", error.message);
    res.status(500).json({ message: "Error updating problem" });
  }
};

/**
 * @desc    Delete a Problem
 * @access  Private/Admin
 */
exports.deleteProblem = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProblem = await Problem.findByIdAndDelete(id);

    if (!deletedProblem) return res.status(404).json({ message: "Problem not found" });

    res.json({ message: "POTD deleted successfully!" });
  } catch (error) {
    console.error("Delete Problem Error:", error.message);
    res.status(500).json({ message: "Error deleting problem" });
  }
};

/**
 * @desc    Get latest Problem of the Day
 * @access  Public
 */
exports.getLatestProblem = async (req, res) => {
  try {
    // Optimization: findOne with sort is great for POTD
    const latestProblem = await Problem.findOne().sort({ createdAt: -1 });
    
    if (!latestProblem) {
      return res.status(200).json({ message: "No problems found in the arena." });
    }

    res.json(latestProblem);
  } catch (error) {
    console.error("Fetch POTD Error:", error.message);
    res.status(500).json({ message: "Error fetching problem" });
  }
};