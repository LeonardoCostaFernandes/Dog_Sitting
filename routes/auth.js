const express = require('express');
const { register, login, logout, getMe, authPhotoUpload} = require('../controllers/auth');
const router = express.Router();
const { protect } = require('../middleware/auth');
router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.get('/logout', protect, logout);
router.route('/:id/photo').put(authPhotoUpload);

module.exports = router;