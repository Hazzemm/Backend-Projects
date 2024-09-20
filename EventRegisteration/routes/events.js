const express = require('express');
const Event = require('../models/Event');
const { verifyToken, adminOnly } = require('../middleware/auth');
const router = express.Router();

// Get all events
router.get('/', async (req, res) => {
  const events = await Event.find();
  res.json(events);
});

// Create new event (Admin only)
router.post('/', verifyToken, adminOnly, async (req, res) => {
  const { title, description, date, capacity } = req.body;
  const event = new Event({ title, description, date, capacity });

  await event.save();
  res.json({staus:"success",data:{message:"Event added successfully",event}});
});

module.exports = router;