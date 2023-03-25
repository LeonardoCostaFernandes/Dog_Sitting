const express = require('express');
const { addBooking, 
        getBookings,
        deleteBooking,
        getAllBookingsByDate, 
        getAllBookingsBetweenDates,
        updateBooking
        
      } = require('../controllers/booking');

const router = express.Router({ mergeParams: true });
const { protect } = require('../middleware/auth');

router.route('/')
  .post(protect, addBooking)
  .get(protect, getBookings)
  //.get(protect, getAllBookingsByDate )
  //.get(protect, getAllBookingsBetweenDates);

  

  router.route('/:id')
  .delete(protect, deleteBooking)
  .put(protect, updateBooking);
  

  
  router.route('/:dataInicial/:dataFinal')
  .get(protect, getAllBookingsBetweenDates);

  router.route('/:date')
  .get(protect, getAllBookingsByDate);

  
module.exports = router;