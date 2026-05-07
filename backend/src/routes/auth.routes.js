const router = require('express').Router();
const { register, login, me } = require('../controllers/auth.controller');

const userController = require('../controllers/user.controller');
const auth = require('../middleware/auth.middleware');

router.post('/register', register);
router.post('/login', login);
router.get('/me', auth, me);

router.get('/:id', auth, userController.getUserById);
// router.get('/:id', authMiddleware, userController.getUserById);
module.exports = router;
