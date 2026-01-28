const express = require('express');
const router = express.Router();
const { addProblem, getLatestProblem } = require('../controllers/problemController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware'); // Humne pehle banaya tha!

// Koi bhi dekh sakta hai
router.get('/latest', getLatestProblem);

// Sirf Admin (Tu) post kar sakti hai
router.post('/add', protect, admin, addProblem);

module.exports = router;