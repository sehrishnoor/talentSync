const router = require('express').Router();
const c = require('../controllers/rating.controller');
const auth = require('../middleware/auth.middleware');

router.post('/', auth, c.submitRating);
router.get('/user/:userId', c.getUserRatings);
router.get('/project/:projectId', c.getProjectRatings);

module.exports = router;
