const mongoose = require('mongoose');
const menuItemSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['Appetizer', 'Main Course', 'Dessert', 'Beverage'],  // Example categories
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0  // Price cannot be negative
    },
    description: {
        type: String
    },
    availability: {
        type: Boolean,
        default: true  // Item is available by default
    },
    components: [
        {
            componentId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Inventory', // Reference to the inventory items
                required: true
            },
            quantity: {
                type: Number,
                required: true
            },
            unit: {
                type: String,
                required: true,
                enum: ['piece', 'kg', 'liter']
            }
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
})

menuItemSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('MenuItem',menuItemSchema,'Menu')