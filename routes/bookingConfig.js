const express = require('express');
const { addBookingConfig,updateBookingConfig} = require('../controllers/BookingConfig');

const router = express.Router({ mergeParams: true });
const { protect, authorize } = require('../middleware/auth');

router.route('/')
.post(protect, authorize('admin'), addBookingConfig);

router.route('/:id')
.post(protect, authorize('admin'), updateBookingConfig);


module.exports = router;