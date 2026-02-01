const express = require('express');
const router = express.Router();
const User = require('../models/User'); 
const userController = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

/**
 * @desc    Debugging: Logs available controller methods on server start
 */
console.log("Loaded Controller Methods:", Object.keys(userController));

/**
 * @route   GET /api/users/leaderboard
 * @desc    Get all users sorted by points
 * @access  Public
 */
router.get('/leaderboard', userController.getLeaderboard);

/**
 * @route   GET /api/users/profile
 * @desc    Get logged-in user's profile data
 * @access  Private
 */
router.get('/profile', protect, userController.getUserProfile);

/**
 * @route   GET /api/users/sync
 * @desc    Sync LeetCode stats with the database
 * @access  Private
 */
router.get('/sync', protect, userController.syncStats);

/**
 * @route   POST /api/users/update-avatar
 * @desc    Update user profile picture
 * @access  Private
 */
router.post('/update-avatar', protect, userController.updateAvatar);

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete a user node from the system
 * @access  Private/Admin
 */
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: "User deleted! 🗑️" });
    } catch (error) {
        res.status(500).json({ message: "Delete error" });
    }
});

module.exports = router;