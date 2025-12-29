const express  = require('express');

const router = express.Router();

const {
    getAllMessages,
    createMessage,
    deleteAllMessages
} = require('../controllers/messageController');

// Get all messages route
router.get('/', getAllMessages);

// Post message router
router.post('/', createMessage);

// Delete all messages route
router.delete('/', deleteAllMessages);

module.exports = router