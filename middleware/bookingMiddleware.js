const Booking = require('../models/booking');

const bookingMiddleware = async (req, res, next) => {
  const { date, dogs } = req.body;
  
  const today = new Date();
  if (date <= today) {
    return res.status(400).json({ message: 'Invalid date' });
  }

  try {
    const count = await Booking.countDocuments({ date });
    if (count + dogs.length <= 10) {
      next();
    } else {
      res.status(400).json({ message: 'Booking not available' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = bookingMiddleware;