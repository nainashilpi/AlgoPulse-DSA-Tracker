const express = require('express');
const router = express.Router();
const Discussion = require('../models/Discussion');
const { protect } = require('../middleware/authMiddleware');

/**
 * @route   GET /api/discussions
 * @desc    Get all posts (Optimized with lean and limit)
 * @access  Public
 */
router.get('/', async (req, res) => {
    try {
        // .lean() processing speed badhata hai aur memory kam use karta hai
        const posts = await Discussion.find()
            .sort({ createdAt: -1 })
            .limit(100) 
            .lean();
        res.json(posts);
    } catch (err) {
        console.error("FETCH_ERROR:", err);
        res.status(500).json({ message: "System failure during data retrieval" });
    }
});

/**
 * @route   POST /api/discussions
 * @desc    Create a new broadcast entry
 * @access  Private
 */
router.post('/', protect, async (req, res) => {
    try {
        const { content, image } = req.body;
        
        if (!content && !image) {
            return res.status(400).json({ message: "Payload empty: Content or Image required" });
        }

        const newPost = new Discussion({
            user: req.user._id,
            username: req.user.username || req.user.leetcodeHandle || "Anonymous_User",
            profilePic: req.user.profilePic,
            content: content || " ", 
            image: image || null,
            likes: [],
            replies: []
        });

        const savedPost = await newPost.save();
        res.status(201).json(savedPost);
    } catch (err) {
        console.error("POST_ERROR:", err);
        res.status(500).json({ message: "Broadcast execution failed" });
    }
});

/**
 * @route   POST /api/discussions/:id/like
 * @desc    Toggle like state for a post
 * @access  Private
 */
router.post('/:id/like', protect, async (req, res) => {
    try {
        const post = await Discussion.findById(req.params.id);
        if (!post) return res.status(404).json({ message: "Target post not found" });

        const userId = req.user._id.toString();
        const index = post.likes.findIndex(id => id.toString() === userId);

        if (index !== -1) {
            // Unlike logic
            post.likes.splice(index, 1);
        } else {
            // Like logic
            post.likes.push(req.user._id);
        }

        await post.save();
        res.json(post);
    } catch (err) {
        res.status(500).json({ message: "Like state toggle failed" });
    }
});

/**
 * @route   POST /api/discussions/:id/reply
 * @desc    Append a reply log to a post
 * @access  Private
 */
router.post('/:id/reply', protect, async (req, res) => {
    try {
        const { content } = req.body;
        const post = await Discussion.findById(req.params.id);

        if (!post) return res.status(404).json({ message: "Target post not found" });

        const newReply = {
            user: req.user._id,
            username: req.user.username || req.user.leetcodeHandle || "Anonymous_User",
            profilePic: req.user.profilePic,
            content,
            createdAt: new Date()
        };

        post.replies.push(newReply);
        await post.save();
        res.json(post);
    } catch (err) {
        res.status(500).json({ message: "Reply log failed" });
    }
});

/**
 * @route   DELETE /api/discussions/:id
 * @desc    Purge a post (Owner or Admin only)
 * @access  Private
 */
router.delete('/:id', protect, async (req, res) => {
    try {
        const post = await Discussion.findById(req.params.id);
        if (!post) return res.status(404).json({ message: "Resource not found" });

        const isOwner = post.user.toString() === req.user._id.toString();
        const isAdmin = req.user.role?.toLowerCase() === 'admin';

        if (!isOwner && !isAdmin) {
            return res.status(401).json({ message: "Access Denied: Unauthorized purge request" });
        }

        await post.deleteOne();
        res.json({ message: "Resource purged successfully" });
    } catch (err) {
        console.error("DELETE_ERROR:", err);
        res.status(500).json({ message: "System error during purge" });
    }
});

/**
 * @route   DELETE /api/discussions/:postId/reply/:replyId
 * @desc    Remove a specific reply log
 * @access  Private
 */
router.delete('/:postId/reply/:replyId', protect, async (req, res) => {
    try {
        const post = await Discussion.findById(req.params.postId);
        if (!post) return res.status(404).json({ message: "Parent resource not found" });

        const reply = post.replies.id(req.params.replyId);
        if (!reply) return res.status(404).json({ message: "Reply log not found" });

        const isReplyOwner = reply.user.toString() === req.user._id.toString();
        const isAdmin = req.user.role?.toLowerCase() === 'admin';

        if (!isReplyOwner && !isAdmin) {
            return res.status(401).json({ message: "Access Denied: Unauthorized log removal" });
        }

        post.replies.pull(req.params.replyId);
        await post.save();

        res.json({ message: "Log removed successfully" });
    } catch (err) {
        console.error("REPLY_DELETE_ERROR:", err);
        res.status(500).json({ message: "System error during log removal" });
    }
});

module.exports = router;