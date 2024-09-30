const express = require('express');
const Reservation = require('../models/Reservations');
const { verifyToken } = require('../middleware/auth');
const router = express.Router();

router.get('/:id',async (req,res)=>{
    const reservationId = req.params.id;
    const reservation = await Reservation.findById(reservationId)
    return res.json({
        status:"success",
        data:{
            message:"Reservation retrieved successfully!",
            reservation
        }
    })
});
router.post('/',verifyToken,(req,res)=>{
    try {
        const { customerName, contactInfo, tableNumber, numberOfPeople, reservationDate } = req.body;
        if (!customerName || !contactInfo || !tableNumber || !numberOfPeople || !reservationDate ) {
            return res.status(400).json({
                status: 'fail',
                data: {
                    message: 'All fields are required'
                }
            });
        }
        const reservation = new Reservation({
            customerName,
            contactInfo,
            tableNumber,
            numberOfPeople,
            reservationDate 
        });
        reservation.save()
        return res.json({
            status: 'success',
            data: {
                message: "Reserved Successfully",
                reservation
            }
        })
    }catch (err) {
        return res.status(500).json({
            status: 'error',
            data: {
                message: 'Something went wronge while completing your reservation',
                error: err.message
            }
        });
    }
});
router.put('/:id',verifyToken,async(req,res)=>{
    try{
        const reservationId = req.params.id;
        const updatedReservation = await Reservation.findByIdAndUpdate(reservationId,{$set:{...req.body}},{new:true})
        if(!updatedItem){
            return res.status(404).json({status:"fail",data:{message:"Menu Item Not Found"}})
        }
        return res.status(200).json({
            status:"success",
            data:{
                message:"Reservation Details Updated Successfully",
                details:{
                    updatedReservation
                }
            }
        })
    }catch(err){
        return res.status(400).json({status:"error",data:{message:err.message,details:err}});
    }
})
module.exports = router;