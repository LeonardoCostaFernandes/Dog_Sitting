const express = require('express');
const { addBooking, 
	getBookings,
	deleteBooking,
	getAllBookingsByDate, 
	getAllBookingsBetweenDates,
	getAllBookings,
	updateBooking,
	allDatesOpenForBooking,
	bookingApprover
} = require('../controllers/booking');

const router = express.Router({ mergeParams: true });
const { protect, authorize  } = require('../middleware/auth');

router.route('/')
	.post(protect, authorize('user','admin'), addBooking)
	.get(protect, authorize('user','admin'), getBookings)
  
router.route('/:id')
	.delete(protect, authorize('user','admin'), deleteBooking)
	.put(protect, authorize('user','admin'), updateBooking);
  
router.route('/all')
	.get(protect, authorize('admin'), getAllBookings); //somente admin
  
router.route('/byOneDate/:startDate')
	.get(protect, authorize('admin'), getAllBookingsByDate); //somente admin

router.route('/byDates/:startDate/:endDate')
	.get(protect, authorize('admin'), getAllBookingsBetweenDates); //somente admin

router.route('/approve/:id')
	.put(protect, authorize('admin'), bookingApprover); //somente admin

router.route('/available/:startDate/:endDate')
	.get(allDatesOpenForBooking); //qualquer um, mesmo sem cadastro

	module.exports = router;