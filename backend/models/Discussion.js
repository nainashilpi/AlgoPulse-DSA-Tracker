const mongoose = require('mongoose');

const DiscussionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    username: String,
    profilePic: String,
    content: {
        type: String,
        required: false, 
        default: "",
    },
    image: {
        type: String, 
        default: null
    },
    likes: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    ],
    replies: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            username: String,
            profilePic: String, 
            content: String,
            createdAt: { type: Date, default: Date.now }
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Discussion', DiscussionSchema);