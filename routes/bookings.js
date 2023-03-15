const express = require('express');
const router = express.Router();
const Booking = require('../models/booking');
const bookingMiddleware = require('../middleware/bookingMiddleware');

router.post('/', async (req, res) => {
  const { date, dogs } = req.body;
  const booking = new Booking({ date, dogs });
  try {
    const newBooking = await booking.save();
    res.status(201).json(newBooking);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


router.get('/availability', bookingMiddleware, async (req, res) => {
 const { date } = req.query;
 try {
   const count = await Booking.countDocuments({ date });
   const availableSlots = 10 - count;
   res.json({ availableSlots });
 } catch (err) {
   res.status(500).json({ message: err.message });
 }
});

router.post('/book', bookingMiddleware, async (req, res) => {
 const { date, dogs } = req.body;
 const booking = new Booking({ date, dogs });
 try {
   const newBooking = await booking.save();
   res.status(201).json(newBooking);
 } catch (err) {
   res.status(400).json({ message: err.message });
 }
});

module.exports = router;