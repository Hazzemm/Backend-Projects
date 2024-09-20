require('dotenv').config();
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.CONNECTION_STRING)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Define routes
app.use('/api/user', require('./routes/user'));
app.use('/api/events', require('./routes/events'));
app.use('/api/registrations', require('./routes/registrations'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
