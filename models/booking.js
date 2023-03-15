const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  dogs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Dog',
    required: true
  }]
});

module.exports = mongoose.model('Booking', bookingSchema);