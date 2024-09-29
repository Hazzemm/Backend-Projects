const express = require('express');
const MenuItem = require('../models/MenuItems')
const { verifyToken, adminOnly } = require('../middleware/auth');
const Order = require('../models/Orders')
const router = express.Router();

router.get('/sales',verifyToken,adminOnly,async (req,res)=>{
    try {
        const date = req.query.date;
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);
        const dayOrders = await Order.find({
            timestamp: {
                $gte: startOfDay,
                $lt: endOfDay
            }
        });

        let dayIncome = 0;
        dayOrders.forEach(order => {
            dayIncome += order.totalPrice
        });

        return res.status(200).json({
            status: 'success',
            data: {
                message: "Daily report retrieved successfully",
                dayIncome,
                dayOrders
            }
        });
    } catch (err) {
        return res.status(400).json({
            status: 'error',
            data: {
                message: err.message,
                details: err
            }
        });
    }
});
router.get('/inventory-consumption',verifyToken,adminOnly, async (req, res) => {
    try {
        const date = req.query.date;
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);
        
        const dayOrders = await Order.find({
            timestamp: {
                $gte: startOfDay,
                $lt: endOfDay
            }
        });

        const inventoryConsumption = {};

        for (const order of dayOrders) {
            for (const item of order.orderDetails) {
                const menuItem = await MenuItem.findById(item.menuItemId).populate('components');

                for (const component of menuItem.components) {
                    const componentId = component.componentId;
                    const quantityUsed = item.quantity * component.quantity;
                    
                    if (inventoryConsumption[componentId]) {
                        inventoryConsumption[componentId].quantity += quantityUsed;
                    } else {
                        inventoryConsumption[componentId] = {
                            itemName: component.itemName,
                            quantity: quantityUsed
                        };
                    }
                }
            }
        }
        return res.status(200).json({
            status: 'success',
            data: {
                message: "Inventory consumption report retrieved successfully",
                inventoryConsumption
            }
        });
    } catch (err) {
        return res.status(400).json({
            status: 'error',
            data: {
                message: err.message,
                details: err
            }
        });
    }
});

module.exports = router;