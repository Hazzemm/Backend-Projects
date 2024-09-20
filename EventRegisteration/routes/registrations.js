const express = require('express');
const Registration = require('../models/Registration');
const Event = require('../models/Event');
const router = express.Router();

// Register for an event
router.post('/register', async (req, res) => {
  const { userId, eventId } = req.body;

  const event = await Event.findById(eventId);
  if (!event) return res.status(404).json({staus:"success",data:{message:"Event not Found"}});

  // Check if event is full
  if (event.registeredUsers.length >= event.capacity) {
    return res.status(400).json({staus:"success",data:{message:"Event is full"}});
  }

  event.registeredUsers.push(userId);
  await event.save();

  const registration = new Registration({ user: userId, event: eventId });
  await registration.save();

  res.json({staus:"success",data:{message:"Registered successfully"}});
});

module.exports = router;