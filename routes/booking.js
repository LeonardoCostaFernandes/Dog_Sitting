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
const { protect } = require('../middleware/auth');

router.route('/')
	.post(protect, addBooking)
	.get(protect, getBookings)
  
router.route('/:id')
	.delete(protect, deleteBooking)
	.put(protect, updateBooking);
  
router.route('/all')
	.get(protect, getAllBookings);
  
router.route('/:startDate/:endDate')
.get(protect, getAllBookingsByDate)
.get(protect, getAllBookingsBetweenDates);

router.route('/available/:startDate/:endDate')
.get(protect, allDatesOpenForBooking);

	module.exports = router;