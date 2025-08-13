const { handleCheckAuth, handleLogin, handleLogout } = require('../controllers/auth');

const router = require('express').Router();

router.get('/check', handleCheckAuth);
router.post('/login', handleLogin);
router.post('/logout', handleLogout);

module.exports = router;