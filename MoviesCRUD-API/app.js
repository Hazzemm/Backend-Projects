require("dotenv").config();
const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const moviesRouter = require('./routes/moviesRouter');

const PORT = process.env.PORT || 3000;
const host = 'localhost';
const app = express();

app.use(express.urlencoded({ extended : true }));
app.use(express.json());

mongoose
    .connect(process.env.CONNECTION_STRING,{})
    .then(()=>{
        console.log("Connected to MongoDB");
    })
    .catch((e) => {
        console.error(`Error connecting to MongoDb ${e}`);
    });

const logging = (req,res,next)=>{
    fs.appendFile('log.txt',req.method + req.url + "\n",err => {
        if (err) {
            console.error(err);
        }
    });
        next();
    };

app.use(logging);

app.use('/movies',moviesRouter);

app.listen(PORT,host,()=>{
    console.log(`♣ Server running on ${host}, port: ${PORT} ♣`);
})

