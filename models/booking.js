const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  id_dog: {
    type:  mongoose.Schema.ObjectId,
    required: [true, 'Please add at least one dog for the booking']
  },
  booking_status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  booking_day: {
    type: [Date],
    required: [true, 'Please add a booking day']
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  date_that_was_made_the_reservation: {
    type: Date,
    default: Date.now
  }
});

BookingSchema.index({ id_dog: 1, booking_day: 1 }, { unique: true });

module.exports = mongoose.model('Booking', BookingSchema);
