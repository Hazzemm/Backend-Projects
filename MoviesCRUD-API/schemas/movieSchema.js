const { Schema } = require('mongoose');
const { model } = require('mongoose');

// Schema
const movieSchema = new Schema({
    title: {type: String, required: true},
    genre:{ type :String ,required:true },
    rating:{ type: Number, required: true },
    releaseDate: { type: Number, Default: undefined },
    publishedOnSite_at: { type: Date, default: new Date() }
});

// model
const Movie = model('movie',movieSchema);

module.exports = Movie;