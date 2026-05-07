const router = require('express').Router();
const c = require('../controllers/analytics.controller');
const auth = require('../middleware/auth.middleware');

router.get('/dashboard', auth, c.getDashboardStats);

module.exports = router;
