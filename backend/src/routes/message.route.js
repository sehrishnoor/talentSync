const express = require('express');
const router = express.Router();
const messageController = require('../controllers/message.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.use(authMiddleware);

router.post('/', messageController.sendMessage);
router.get('/unread/count', messageController.getUnreadCount);
router.get('/unread/stats', messageController.getConnectionUnreadStats);
router.patch('/:connectionId/read', messageController.markAsRead);
router.get('/:connectionId', messageController.getChatHistory);

module.exports = router;
