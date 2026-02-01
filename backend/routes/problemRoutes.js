
const express = require('express');
const router = express.Router();
const { 
  addProblem, 
  getLatestProblem, 
  updateProblem, 
  deleteProblem  
} = require('../controllers/problemController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

// @route   GET /api/problems/latest
router.get('/latest', getLatestProblem);

// @route   POST /api/problems/add
router.post('/add', protect, admin, addProblem);

// @route   PUT /api/problems/:id
router.put('/:id', protect, admin, updateProblem);

// @route   DELETE /api/problems/:id
router.delete('/:id', protect, admin, deleteProblem);

module.exports = router;