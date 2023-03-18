const mongoose = require('mongoose');

const CalendarSchema = new mongoose.Schema({
 name: {
    type: Date,
    required: [true, 'Please add a name for the slot']
  },
  
 slot: {
    type: Array,
    required: [true, 'add a date']
  }
});

module.exports = mongoose.model('Calendar', CalendarSchema);