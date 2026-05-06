const router = require('express').Router();
const c = require('../controllers/project.controller');
const auth = require('../middleware/auth.middleware');

router.get('/', c.getAllProjects);
router.get('/me', auth, c.getMyProjects);
router.get('/:id', c.getProjectById);
router.post('/', auth, c.createProject);
router.put('/:id', auth, c.updateProject);
router.delete('/:id', auth, c.deleteProject);
router.post('/:id/apply', auth, c.applyToProject);
router.patch('/members/:memberId/status', auth, c.updateMemberStatus);

module.exports = router;
