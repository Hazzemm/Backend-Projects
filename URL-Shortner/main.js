require('dotenv').config();
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const { Url } = require('./schemas/urlSchema');
const app = express();
const validator = require('validator')
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose
    .connect(process.env.CONNECTION_STRING)
    .then(() => console.log("Connected To MongoDB"))
    .catch((err) => console.log("Error connecting to MongoDB:", err));
app.use('/public', express.static(`${process.cwd()}/public`));
app.get('/', function(req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
});
app.post("/shorten", async (req, res) => {
    try {
        const longUrl = req.body.url;
        if (!longUrl) {
            return res.status(400).json({ error: "URL is required" });
        }

        if (!validator.isURL(longUrl)) {
            return res.status(400).json({ error: "Invalid URL" });
        }

        let url = await Url.findOne({ longUrl });
        // Don't save the same longUrl again if it exists just return the urls
        if (url) {
            return res.json(await Url.find());
        }

        function genShortUrl() {
            const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$';
            let shortenedUrl = '';
            for (let i = 0; i < 6; i++) {
              shortenedUrl += characters.charAt(Math.floor(Math.random() * characters.length));
            }
            return shortenedUrl;
        }
        let shortUrl = genShortUrl();

        url = new Url({ longUrl, shortUrl });
        await url.save();

        res.json( await Url.find() );
    } catch (error) {
        console.error("Error processing request:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
app.get("/shorten/:shortUrl", async (req,res ) => {
    const shortUrl = req.params.shortUrl
    const url = await Url.findOne({ shortUrl });
    if (!url) {
        return res.status(404).json({ error: "URL not found" });
    }
    res.redirect(url.longUrl);
})
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
