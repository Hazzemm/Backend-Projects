require('dotenv').config();
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.use(cors());
app.use(express.json());

mongoose
    .connect(process.env.CONNECTION_STRING)
    .then(()=>console.log("Connected to MongoDB"))
    .catch(err => console.log(err))

app.use('/api/menu', require('./routes/menu'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/inventory', require('./routes/inventory'));
app.use('/api/reservations', require('./routes/reservations'));
app.use('/api/reports', require('./routes/reports'));
app.use('/api/user', require('./routes/user'));

const port = process.env.PORT || 3000;
app.listen(port,()=>{
    console.log(`Server running on port ${port}`)
})