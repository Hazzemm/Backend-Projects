require('dotenv').config();
const cors = require('cors');
const chalk = require('chalk');
const express = require('express');
const app = express();
const path = require('path');
app.use('/uploads',express.static(path.join(__dirname,'uploads')));

const port = process.env.PORT || 4000;
const host = 'localhost';
let coursesRouter = require('./routes/courses.route');
let usersRouter = require('./routes/users.route');
const httpStatusText = require("./utils/httpStatusText");
const appError = require('./utils/appError');

const mongoose = require('mongoose');
const uri = process.env.MONGO_URL;
mongoose
    .connect(uri)
    .then(() => {
        console.log(chalk.green('MongoDB server started'));
    })

app.use(cors());
app.use(express.json());
app.use(express.urlencoded());
app.use('/api/courses',coursesRouter); // /api/courses
app.use('/api/users',usersRouter); // /api/users 

// global middleware for not found routs
app.all('*',(req,res,next)=>{
    const error = appError.create('this resource isnot available', 404, httpStatusText.ERROR);
    return next(error)
})

// global error handler
app.use((error,req,res,next)=>{
    res.status(error.statusCode || 500).json({status: error.statusText || httpStatusText.ERROR, message: error.message, code: error.statusCode || 500, data: null});
})

app.listen(port,host,()=>{
    console.log(chalk.blueBright(`Server is running on port ${port} , ${host}`));
});