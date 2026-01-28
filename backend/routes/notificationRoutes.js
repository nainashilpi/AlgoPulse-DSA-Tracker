const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const { protect, admin } = require('../middleware/authMiddleware');

// 1. Admin sends notification
router.post('/send', protect, admin, async (req, res) => {
  try {
    const { message, type } = req.body;
    const notification = await Notification.create({ message, type });
    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ message: "Failed to send notification" });
  }
});

// 2. Users get notifications
router.get('/', async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 }).limit(5);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Error fetching notifications" });
  }
});

module.exports = router;