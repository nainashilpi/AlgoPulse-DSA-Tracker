// // const express = require('express');
// // const router = express.Router();
// // const User = require('../models/User'); 
// // const userController = require('../controllers/userController');
// // const { protect, admin } = require('../middleware/authMiddleware');

// // /**
// //  * @desc    Debugging: Logs available controller methods on server start
// //  */
// // console.log("Loaded Controller Methods:", Object.keys(userController));

// // /**
// //  * @route   GET /api/users/leaderboard
// //  * @desc    Get all users sorted by points
// //  * @access  Public
// //  */
// // router.get('/leaderboard', userController.getLeaderboard);

// // /**
// //  * @route   GET /api/users/profile
// //  * @desc    Get logged-in user's profile data
// //  * @access  Private
// //  */
// // router.get('/profile', protect, userController.getUserProfile);

// // /**
// //  * @route   GET /api/users/sync
// //  * @desc    Sync LeetCode stats with the database
// //  * @access  Private
// //  */
// // router.get('/sync', protect, userController.syncStats);

// // /**
// //  * @route   POST /api/users/update-avatar
// //  * @desc    Update user profile picture
// //  * @access  Private
// //  */
// // router.post('/update-avatar', protect, userController.updateAvatar);

// // /**
// //  * @route   DELETE /api/users/:id
// //  * @desc    Delete a user node from the system
// //  * @access  Private/Admin
// //  */
// // // Protect pehle hona chahiye, admin baad mein
// // router.delete('/:id', protect, admin, async (req, res) => {
// //     try {
// //         const user = await User.findById(req.params.id);
// //         if (user) {
// //             await User.findByIdAndDelete(req.params.id);
// //             res.json({ message: "User deleted! 🗑️" });
// //         } else {
// //             res.status(404).json({ message: "User not found" });
// //         }
// //     } catch (error) {
// //         res.status(500).json({ message: "Delete error" });
// //     }
// // });

// // module.exports = router;


// const express = require('express');
// const router = express.Router();
// const User = require('../models/User'); 
// const userController = require('../controllers/userController');
// const { protect, admin } = require('../middleware/authMiddleware');

// /**
//  * @desc    Debugging: Logs available controller methods on server start
//  */
// console.log("Loaded Controller Methods:", Object.keys(userController));

// /**
//  * @route   GET /api/users/leaderboard
//  */
// router.get('/leaderboard', userController.getLeaderboard);

// /**
//  * @route   GET /api/users/profile
//  */
// router.get('/profile', protect, userController.getUserProfile);

// /**
//  * @route   GET /api/users/sync
//  */
// router.get('/sync', protect, userController.syncStats);

// /**
//  * @route   POST /api/users/update-avatar
//  */
// router.post('/update-avatar', protect, userController.updateAvatar);

// /**
//  * @route   DELETE /api/users/:id
//  * @desc    Delete a user node from the system
//  */
// router.delete('/:id', protect, admin, async (req, res) => {
//     try {
//         const user = await User.findById(req.params.id);
//         if (user) {
//             await User.findByIdAndDelete(req.params.id);
//             res.json({ message: "User deleted! 🗑️" });
//         } else {
//             res.status(404).json({ message: "User not found" });
//         }
//     } catch (error) {
//         res.status(500).json({ message: "Delete error" });
//     }
// });

// /**
//  * @route   PUT /api/users/reset-points
//  * @desc    Reset all user points to zero (Seasonal Reset)
//  */
// router.put('/reset-points', protect, admin, userController.resetAllPoints);

// // ==========================================
// //          HALL OF FAME ROUTES
// // ==========================================

// /**
//  * @route   GET /api/users/hall-of-fame
//  * @desc    Get all winners for the frontend page
//  * @access  Public
//  */
// router.get('/hall-of-fame', userController.getHallOfFame);

// /**
//  * @route   POST /api/users/declare-winner
//  * @desc    Manually trigger top user as winner (Admin Only)
//  * @access  Private/Admin
//  */
// router.post('/declare-winner', protect, admin, userController.declareWeeklyWinner);

// /**
//  * @route   DELETE /api/users/winner/:id
//  * @desc    Remove a specific winner entry (Admin Only)
//  * @access  Private/Admin
//  */
// router.delete('/winner/:id', protect, admin, userController.deleteWinner);

// module.exports = router;

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
        // findByIdAndDelete is more efficient than find + delete
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