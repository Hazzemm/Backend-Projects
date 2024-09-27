const mongoose = require('mongoose');
const orderSchema = mongoose.Schema({
    tableNumber: {
        type: Number,
        required: true
    },
    orderDetails: [
        {
            menuItemId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'MenuItem',
            required: true
            },
            quantity: {
            type: Number,
            required: true,
            min: 1  
            },
            _id: false
        }
    ],
    orderStatus: {
        type: String,
        enum: ['pending', 'in-progress', 'completed'],
        default: 'pending'
    },
    totalPrice: {
        type: Number,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Order',orderSchema,'Order')