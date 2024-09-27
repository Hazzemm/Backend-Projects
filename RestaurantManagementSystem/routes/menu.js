const express = require('express');
const MenuItem = require('../models/MenuItems');
const router = express.Router();

router.get('/', async (req,res)=>{
    try{
        const page = +req.query.page || 1;
        const limit = +req.query.limit || 10;
        const skip = (page - 1) * limit;
        const menuItems = await MenuItem.find().skip(skip).limit(limit);
        const totalPages = await MenuItem.countDocuments();
        res.status(200).json({
            status: 'success',
            data: {
                message: 'Menu Items retrieved successfully',
                details:{
                    items:menuItems,
                    page: page,
                    totalPages: Math.ceil(totalPages/limit)
                }
            }
        })
    }catch(err){
        return res.status(400).json({status:"error",data:{message:err.message,details:err}});
    }
});
router.post('/', async (req,res)=>{
    try {
        const {name,category,price,description,availability,components} = req.body;
        const menuItem = new MenuItem({
            name,
            category,
            price,
            description,
            availability,
            components
        });
        const existing = await MenuItem.findOne({name});
        if(existing) {
            return res.status(400).json({
                status:"fail",
                data:{
                    message:"Item Already Exists",
                    details:{
                        item:existing
                    }
                }
            });
        }
        await menuItem.save();
        return res.status(200).json({
            status: 'success',
            data:{
                message: "Item Added Successfully",
                details: {
                    item:menuItem
                }
            }
        });
    }catch(err){
        return res.status(400).json({status:"error",data:{message:err.message,details:err}});
    }
});
router.put('/:id', async (req,res)=>{
    try {
        const itemId = req.params.id;
        const updatedItem = await MenuItem.findByIdAndUpdate(itemId,{$set:{...req.body}},{new:true})
        if(!updatedItem){
            return res.status(404).json({status:"fail",data:{message:"Menu Item Not Found"}})
        }
        return res.status(200).json({
            status:"success",
            data:{
                message:"Menu Item Updated Successfully",
                details:{
                    item:updatedItem
                }
            }
        })
    }catch(err){
        return res.status(400).json({status:"error",data:{message:err.message,details:err}});
    }
});
router.delete('/:id', async (req,res)=>{
    try {
        const itemId = req.params.id;
        const deletedItem = await MenuItem.findByIdAndDelete(itemId)
        if(!deletedItem){
            return res.status(404).json({status:"fail",data:{message:"Menu Item Not Found"}})
        }
        return res.status(200).json({
            status:"success",
            data:{
                message:"Menu Item Deleted Successfully",
                details:{
                    item:deletedItem
                }
            }
        })
    }catch(err){
        return res.status(400).json({status:"error",data:{message:err.message,details:err}});
    }
});

module.exports = router;