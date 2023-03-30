const express = require('express');
const { addBooking, 
	getBookings,
	deleteBooking,
	getAllBookingsByDate, 
	getAllBookingsBetweenDates,
	getAllBookings,
	updateBooking,
	allDatesOpenForBooking
} = require('../controllers/booking');

const router = express.Router({ mergeParams: true });
const { protect, authorize  } = require('../middleware/auth');

router.route('/')
	.post(protect, addBooking)
	.get(protect, getBookings)
  
router.route('/:id')
	.delete(protect, deleteBooking)
	.put(protect, updateBooking);
  
router.route('/all')
	.get(protect, authorize('admin'), getAllBookings);
  
router.route('/byOneDate/:startDate')
	.get(protect, getAllBookingsByDate);

router.route('/byDates/:startDate/:endDate')
	.get(protect, getAllBookingsBetweenDates);

router.route('/available/:startDate/:endDate')
	.get(protect, allDatesOpenForBooking);

	module.exports = router;