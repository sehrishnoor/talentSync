const router = require('express').Router();
const c = require('../controllers/user.controller');
const auth = require('../middleware/auth.middleware');

router.get('/', c.getAllUsers);
router.get('/me/skills', auth, c.getMySkills);
router.get('/:id', c.getUserById);
router.put('/me', auth, c.updateProfile);
router.post('/me/skills', auth, c.addSkill);
router.delete('/me/skills/:skillId', auth, c.removeSkill);

module.exports = router;
