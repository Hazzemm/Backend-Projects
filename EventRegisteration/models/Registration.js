const mongoose = require('mongoose');

const RegistrationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
  dateRegistered: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Registration', RegistrationSchema, 'Registration');