const express = require('express');
const Order = require('../models/Orders')
const MenuItem = require('../models/MenuItems');
const Inventory = require('../models/Inventory');
const router = express.Router();

router.get('/',async (req,res)=>{
    try {
        const orders = await Order.find().populate('orderDetails.menuItemId', 'name price');
        return res.status(200).json({
            status: 'success',
            data: {
                message: "Orders Retrieved Successfully",
                orders
            }
        });
    } catch (err) {
        return res.status(500).json({
            status: 'error',
            data: {
                message: "Something went wrong while retrieving the orders.",
                error: err.message
            }
        });
    }
});
router.post('/order', async (req, res) => {
    const { tableNumber, orderDetails } = req.body;
    let totalPrice = 0;

    try {
        for (let order of orderDetails) {
            const menuItem = await MenuItem.findById(order.menuItemId).populate('components.componentId');
            if (!menuItem) {
                return res.status(404).json({ message: "Menu item not found" });
            }
            totalPrice += menuItem.price * order.quantity;
            for (let component of menuItem.components) {
                const inventoryItem = await Inventory.findById(component.componentId);
                const requiredQuantity = component.quantity * order.quantity;
                if (inventoryItem.unit === component.unit) {
                    if (inventoryItem.quantity < requiredQuantity) {
                        return res.status(400).json({
                            status:"fail",
                            data:{
                                message: `Not enough stock for ${inventoryItem.itemName}. Required: ${requiredQuantity} ${component.unit}, Available: ${inventoryItem.quantity} ${component.unit}`
                            }
                        })
                    }
                } else {
                    return res.status(400).json({ 
                        status:"error",
                        data:{
                        message: `Unit mismatch for ${inventoryItem.itemName}. Expected: ${component.unit}, Found: ${inventoryItem.unit}` 
                        }
                    });
                }
            }
            // Decreasing the inventory upon ordering 
            for (let component of menuItem.components) {
                const inventoryItem = await Inventory.findById(component.componentId);
                const requiredQuantity = component.quantity * order.quantity;
                inventoryItem.quantity -= requiredQuantity; 
                await inventoryItem.save();
            }
        }

        const order = new Order({ tableNumber, orderDetails, totalPrice });
        await order.save();

        res.status(200).json({
            staus:"success",
            data:{ 
                message: "Order placed successfully",
                order 
            }});
    } catch (err) {
        console.error(err);
        res.status(500).json({
            staus:"error",
            data:{ 
                message: "An error occurred while placing the order", 
                error: err.message 
        }});
    }
});
router.put('/:id',async (req,res)=>{
    try{
        const orderId = req.params.id;
        const updatedOrder = await Order.findByIdAndUpdate(orderId,{$set:{...req.body}},{new:true})
        if(!updatedOrder){
            return res.status(404).json({status:"fail",data:{message:"Order Not Found"}})
        }
        return res.status(200).json({
            status:"success",
            data:{
                message:"Order Updated Successfully",
                details:{
                    order:updatedOrder
                }
            }
        })
    }catch(err){
        return res.status(500).json({
            status: "error",
            data: {
                message: "Something went wrong while updating the order.",
                error: err.message
            }
        });
    }
});

module.exports = router;