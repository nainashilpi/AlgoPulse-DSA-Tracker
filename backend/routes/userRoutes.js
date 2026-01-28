const express = require('express');
const router = express.Router();
const User = require('../models/User'); 
const { getUserProfile, syncUserStats, getLeaderboard } = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware'); // 'protect' hi 'auth' ka kaam karega

// Public routes
router.get('/leaderboard', getLeaderboard);

// Protected routes
router.get('/profile', protect, getUserProfile);
router.get('/sync', protect, syncUserStats);

// Delete User (Admin Only)
// Dhyan dein: 'auth' ki jagah 'protect' use kiya hai kyunki wahi imported hai
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: "User deleted forever! 🗑️" });
    } catch (error) {
        res.status(500).json({ message: "Delete karne mein error aaya" });
    }
});

module.exports = router;