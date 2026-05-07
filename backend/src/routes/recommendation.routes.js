const router = require('express').Router();
const c = require('../controllers/recommendation.controller');
const auth = require('../middleware/auth.middleware');

router.get('/users', auth, c.getRecommendedUsers);
router.get('/projects', auth, c.getRecommendedProjects);
router.get('/popular', auth, c.getPopularUsers);
router.get('/project-match/:projectId', auth, c.getProjectMatches);

module.exports = router;
