const {validationResult} = require('express-validator');
const Course = require('../models/course.model')
const httpStatusText = require("../utils/httpStatusText");
const asyncWrapper = require('../middleware/asyncWrapper');
const appError = require('../utils/appError');

const getAllCourses = asyncWrapper( 
    async (req,res) => {
        const query = req.query;
        const limit = query.limit || 10;
        const page = query.page || 1;
        const skip = (page - 1) * limit;
        
        const courses = await Course.find({},{"__v":0}).limit(limit).skip(skip);
        res.json({status: httpStatusText.SUCCESS,data: {courses}});
    }
)

const getCourse = asyncWrapper(
    async (req,res,next) => {
        const course = await Course.findById(req.params.courseId)
        if(!course){
            const error = appError.create('course not found',404,httpStatusText.FAIL)
            return next(error);
        }
        return res.json({status: httpStatusText.SUCCESS,data: {course}});
    }
)

const addCourse = asyncWrapper(
    async (req,res,next) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            const error = appError.create(errors.array(),400,httpStatusText.FAIL);
            return next(error);
        }
        const newCourse = new Course(req.body);
        await newCourse.save();
        res.status(200).json({status: httpStatusText.SUCCESS,data: {course: newCourse}});
   }
)

const updateCourse = asyncWrapper(
    async (req,res,next) => {
        const courseId = req.params.courseId;
        const updatedCourse = await Course.findByIdAndUpdate(courseId,{$set:{...req.body}},{new:true});
        if (!updatedCourse) {
            const error = appError.create('course not found',404,httpStatusText.FAIL);
            return next(error);
            return res.status(404).json({status: httpStatusText.FAIL,data:{course: "course not found"}});
        }
        res.status(200).send({status: httpStatusText.SUCCESS,data: {course: updatedCourse}});
        
    }
)

const deleteCourse = asyncWrapper( 
    async (req,res,next) => {
        const courseId = req.params.courseId;
        const deletedCourse = await Course.findByIdAndDelete(courseId);
        if(!deletedCourse){
            const error = appError.create('course not found', 404, httpStatusText.FAIL);
            return next(error);
        }
        res.send({status: httpStatusText.SUCCESS,data: null});
    }
)
module.exports = {
    getAllCourses,
    getCourse,
    addCourse,
    updateCourse,
    deleteCourse
}