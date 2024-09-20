const mongoose = require('mongoose')

const urlSchema = new mongoose.Schema({
    longUrl: {
        type: String,
        required: true
    },
    shortUrl: {
        type: String,
        required: true,
        unique: true
    },
    created_at: {
        type: Date,
        default: Date.now
    }
})

exports.Url = mongoose.model('Url',urlSchema);