const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const { protect, admin } = require('../middleware/authMiddleware');

/**
 * @route   POST /api/notifications/create
 * @desc    Core Access: Broadcast system-wide notification
 * @access  Private/Admin
 */
router.post('/create', protect, admin, async (req, res) => {
  try {
    const { message, type } = req.body;
    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }
    const notification = await Notification.create({ 
      message, 
      type: type || 'Update' 
    });
    res.status(201).json(notification);
  } catch (error) {
    console.error("Notification Error:", error);
    res.status(500).json({ message: "Failed to send notification", error: error.message });
  }
});

/**
 * @route   GET /api/notifications
 * @desc    Get latest system signals
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 }).limit(5);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Error fetching notifications" });
  }
});

/**
 * @route   DELETE /api/notifications/:id
 * @desc    Terminate a specific notification signal
 * @access  Private
 */
router.delete('/:id', protect, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    
    await Notification.findByIdAndDelete(req.params.id);
    res.json({ message: "Signal Terminated Successfully" });
  } catch (error) {
    console.error("Delete Notif Error:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

module.exports = router;