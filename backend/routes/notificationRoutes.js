const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/create', protect, admin, async (req, res) => {
  try {
    const { message, type } = req.body;
    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }
    const notification = await Notification.create({ 
      message, 
      // Matching with updated enum
      type: type || 'Update' 
    });
    res.status(201).json(notification);
  } catch (error) {
    console.error("Notification Error:", error);
    res.status(500).json({ message: "Failed to send notification", error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 }).limit(5);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Error fetching notifications" });
  }
});

// Route to delete a notification
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    await notification.deleteOne();
    res.json({ message: "Signal Terminated Successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

module.exports = router;