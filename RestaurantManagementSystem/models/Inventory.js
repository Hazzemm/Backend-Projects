const mongoose = require('mongoose');
const inventorySchema = mongoose.Schema({
    itemName: {
        type: String,
        required: true,
        trim: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 0  // Quantity cannot be negative
    },
    unit: {
        type: String,
        required: true,
        enum: ['piece', 'kg', 'liter']
    },
    threshold: {
        type: Number,
        default: 5  // Default threshold for low stock alerts
    },
    supplier: {
        type: String
    }
})

module.exports = mongoose.model('Inventory',inventorySchema,'Inventory')