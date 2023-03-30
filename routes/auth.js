const express = require('express');
const { register, login, logout, getMe, authPhotoUpload, updateUser} = require('../controllers/auth');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

router.route('/register')
.post(register); //qualquer um

router.route('/login')
.post(login); //qualquer um

router.route('/me')
.get(protect, authorize('user','admin'),protect, getMe);

router.route('/logout')
.get(protect, authorize('user','admin'), logout);

router.route('/:id/photo')
.put(protect, authorize('user','admin'),authPhotoUpload);

router.route('/:id')
.put(protect, authorize('user','admin'),updateUser);

module.exports = router;