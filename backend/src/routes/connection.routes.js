const express = require('express');
const router = express.Router();
const connectionController = require('../controllers/connection.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.use(authMiddleware);

router.post('/', connectionController.requestConnection);
router.get('/', connectionController.getConnections);
router.get('/pending', connectionController.getPendingRequests);
router.patch('/:id/status', connectionController.updateStatus);

module.exports = router;
