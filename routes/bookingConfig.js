const express = require('express');
const { addBookingConfig} = require('../controllers/BookingConfig');

const router = express.Router({ mergeParams: true });
const { protect, authorize } = require('../middleware/auth');

router.route('/')
.post(protect, authorize('admin'), addBookingConfig);

module.exports = router;