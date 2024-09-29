const express = require('express');
const Inventory = require('../models/Inventory');
const { verifyToken, adminOnly } = require('../middleware/auth');
const router = express.Router();

router.get('/',verifyToken, adminOnly,async (req,res)=>{
    try {
        const inventory = await Inventory.find();
        return res.status(200).json({
            status: 'success',
            data: {
                message: "Inventory Retrieved Successfully",
                inventory
            }
        });
    } catch (err) {
        return res.status(500).json({
            status: 'error',
            data: {
                message: "Something went wrong while retrieving inventory.",
                error: err.message
            }
        });
    }
});
router.post('/',verifyToken, adminOnly,(req,res)=>{
    try {
        const { itemName, quantity, unit, threshold, supplier } = req.body;
        if (!itemName || !quantity || !unit ) {
            return res.status(400).json({
                status: 'fail',
                data: {
                    message: 'All fields are required'
                }
            });
        }
        const inventory = new Inventory({
            itemName,
            quantity,
            unit,
            threshold,
            supplier 
        });
        inventory.save()
        return res.json({
            status: 'success',
            data: {
                message: "Inventory Added Successfully",
                inventory
            }
        })
    }catch (err) {
        return res.status(500).json({
            status: 'error',
            data: {
                message: 'Server error, please try again later',
                error: err.message
            }
        });
    }
});

module.exports = router;