const mongoose = require('mongoose');
const tableSchema = mongoose.Schema({
    tableNumber: {
        type: Number,
        required: true,
        unique: true  // Each table number should be unique
    },
    capacity: {
        type: Number,
        required: true,
        min: 1  // Minimum capacity of 1
    },
    status: {
        type: String,
        enum: ['available', 'occupied', 'reserved'],
        default: 'available'  // Default status is available
    },
    reservationId: {
        type: Schema.Types.ObjectId,
        ref: 'Reservation',
        default: null  // No reservation by default
    }
})

module.exports = mongoose.model('Table',tableSchema,'Table')