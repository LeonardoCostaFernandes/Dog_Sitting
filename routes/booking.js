const express = require('express');
const { addBooking, getBookings, deleteBooking  } = require('../controllers/booking');
const router = express.Router({ mergeParams: true });
const { protect } = require('../middleware/auth');

router.route('/')
  .post(protect, addBooking)
  .get(protect, getBookings)
  

  router
  .route('/:id')
  .delete(protect, deleteBooking);
module.exports = router;