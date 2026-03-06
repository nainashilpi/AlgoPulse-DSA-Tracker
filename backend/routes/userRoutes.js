
const express = require('express');
const router = express.Router();
const User = require('../models/User'); 
const userController = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

/**
 * @desc    Controller Method Verification
 */
console.log("System_Logs: Loaded Controller Methods ->", Object.keys(userController));

/**
 * @route   GET /api/users/leaderboard
 * @desc    Fetch leaderboard (Optimized)
 */
router.get('/leaderboard', userController.getLeaderboard);

/**
 * @route   GET /api/users/profile
 */
router.get('/profile', protect, userController.getUserProfile);

/**
 * @route   GET /api/users/sync
 */
router.get('/sync', protect, userController.syncStats);

/**
 * @route   POST /api/users/update-avatar
 */
router.post('/update-avatar', protect, userController.updateAvatar);

/**
 * @route   PUT /api/users/reset-points
 * @desc    Seasonal system reset
 */
router.put('/reset-points', protect, admin, userController.resetAllPoints);

// ==========================================
//          HALL OF FAME ROUTES
// ==========================================

/**
 * @route   GET /api/users/hall-of-fame
 * @desc    Public access to legacy winners
 */
router.get('/hall-of-fame', userController.getHallOfFame);

/**
 * @route   POST /api/users/declare-winner
 * @desc    Admin manual override for winner declaration
 */
router.post('/declare-winner', protect, admin, userController.declareWeeklyWinner);

/**
 * @route   DELETE /api/users/winner/:id
 */
router.delete('/winner/:id', protect, admin, userController.deleteWinner);

/**
 * @route   DELETE /api/users/:id
 * @desc    System purge for specific user node
 */
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        
        const user = await User.findByIdAndDelete(req.params.id);
        if (user) {
            res.json({ message: "DATA_PURGED_SUCCESSFULLY" });
        } else {
            res.status(404).json({ message: "User node not found" });
        }
    } catch (error) {
        console.error("USER_PURGE_ERROR:", error);
        res.status(500).json({ message: "CRITICAL_SYSTEM_ERROR" });
    }
});

module.exports = router;