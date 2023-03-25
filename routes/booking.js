const express = require('express');
const { addBooking, getBookings, deleteBooking, getAllBookingsByDate  } = require('../controllers/booking');
const router = express.Router({ mergeParams: true });
const { protect } = require('../middleware/auth');

router.route('/')
  .post(protect, addBooking)
  .get(protect, getBookings)
  .get(getBookings);
  

  router
  .route('/:id')
  .delete(protect, deleteBooking);

  router
  .route('/:date')
  .get(getAllBookingsByDate);
  
module.exports = router;