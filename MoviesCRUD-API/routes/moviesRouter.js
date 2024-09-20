const express = require("express");
const app = express.Router();
const Movie = require("../schemas/movieSchema");

app.route('/')
    .get(async (req,res)=>{
    const movies = await Movie.find({});
    res.send(movies)    
    })
    .post((req,res)=>{
        const body = req.body;
        const newMovie = new Movie({
            title: body.title,
            genre: body.genre,
            rating: body.rating,
            releaseDate: body.releaseDate
        })
        newMovie.save();
        res.send(newMovie);
    });

app.route('/:id')
.put(async (req,res)=>{
    try{
    const id = req.params.id;
    const body = req.body;

        if(!id){
            res.send({error: true, message:"There is no Movie With This ID"});
            return;
        }
        const updatedMovie = await Movie.findOneAndUpdate(
            { _id: id },
            { ...body },
            { new: true });
        res.send(updatedMovie);
    }catch(err){
        res.send("This is not valid MovieID",err);
    }
    })
    .delete(async (req,res)=>{
    try{      
    const id = req.params.id;
    const movie = await Movie.findOneAndDelete(
        {_id : id} );
        if (!movie ) {
            res.send("No Movie With This ID")}
        else {
            res.send("Movie Deleted");
        }
    }catch(err){
        res.send(`This is not a valid MovieID ${err}`);
    }
    });

module.exports = app;