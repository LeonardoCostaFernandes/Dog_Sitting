const mongoose = require('mongoose');

const DogSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name for the dog']
  },
  breed: {
    type: String,
    required: [true, 'Please add a breed for the dog']
  },
  ano_de_nascimento: {
    type: Number,
    required: [true, 'Please add an age for the dog']
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }
});

module.exports = mongoose.model('Dog', DogSchema);