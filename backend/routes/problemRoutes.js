const express = require('express');
const router = express.Router();
const { 
  addProblem, 
  getLatestProblem, 
  updateProblem, 
  deleteProblem  
} = require('../controllers/problemController');

const { protect, admin } = require('../middleware/authMiddleware');

/**
 * @route   GET /api/problems/latest
 * @desc    Get the daily problem for the arena
 * @access  Public
 */
router.get('/latest', getLatestProblem);

/**
 * @route   POST /api/problems/add
 * @desc    Core Access: Add new algorithmic challenge
 * @access  Private/Admin
 */
router.post('/add', protect, admin, addProblem);

/**
 * @route   PUT /api/problems/:id
 * @desc    Core Access: Modify existing challenge
 * @access  Private/Admin
 */
router.put('/:id', protect, admin, updateProblem);

/**
 * @route   DELETE /api/problems/:id
 * @desc    Core Access: Terminate challenge node
 * @access  Private/Admin
 */
router.delete('/:id', protect, admin, deleteProblem);

module.exports = router;