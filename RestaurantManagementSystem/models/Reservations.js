const mongoose = require('mongoose');
const reservationSchema = mongoose.Schema({
    customerName: {
        type: String,
        required: true,
        trim: true
    },
    contactInfo: {
        type: String,
        required: true
    },
    tableNumber: {
        type: Number,
        required: true
    },
    numberOfPeople: {
        type: Number,
        required: true,
        min: 1  // Minimum of 1 person
    },
    reservationDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['confirmed', 'canceled', 'completed'],
        default: 'confirmed'  // Default status is confirmed
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
})

reservationSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Reservation',reservationSchema,'Reservation')