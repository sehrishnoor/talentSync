const router = require('express').Router();
const c = require('../controllers/dropout.controller');
const auth = require('../middleware/auth.middleware');

router.post('/', auth, c.logDropout);
router.get('/project/:projectId', auth, c.getProjectDropouts);
router.get('/stats', auth, c.getDropoutStats);

module.exports = router;
