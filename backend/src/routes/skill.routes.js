const router = require('express').Router();
const c = require('../controllers/skill.controller');
const auth = require('../middleware/auth.middleware');
const role = require('../middleware/role.middleware');

router.get('/', c.getAllSkills);
router.post('/', auth, role('admin'), c.createSkill);
router.delete('/:id', auth, role('admin'), c.deleteSkill);

module.exports = router;
