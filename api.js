const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const port = 45891;

app.use(bodyParser.json());

const confessionsFile = 'confessions.json';
const ratingsFile = 'ratings.json';
const commentsFile = 'comments.json';

// Load data from backup saves from above
let confessions = [];
let ratings = {};
let comments = {};
let confessionIdCounter = 1;

if (fs.existsSync(confessionsFile)) {
    confessions = JSON.parse(fs.readFileSync(confessionsFile));
}
if (fs.existsSync(ratingsFile)) {
    ratings = JSON.parse(fs.readFileSync(ratingsFile));
}
if (fs.existsSync(commentsFile)) {
    comments = JSON.parse(fs.readFileSync(commentsFile));
}

// save data to file
function saveConfessionsToFile() {
    fs.writeFileSync(confessionsFile, JSON.stringify(confessions, null, 2));
}
function saveRatingsToFile() {
    fs.writeFileSync(ratingsFile, JSON.stringify(ratings, null, 2));
}
function saveCommentsToFile() {
    fs.writeFileSync(commentsFile, JSON.stringify(comments, null, 2));
}

// log the requests
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    if (Object.keys(req.body).length > 0) {
        console.log('Body:', JSON.stringify(req.body, null, 2));
    }
    if (Object.keys(req.query).length > 0) {
        console.log('Query:', JSON.stringify(req.query, null, 2));
    }
    next();
});

// GET confession
app.get('/getConfession', (req, res) => {
    if (confessions.length === 0) {
        console.log('No confessions available... yet');
        return res.status(404).json({ message: 'No confessions available... yet' });
    }
    const randomIndex = Math.floor(Math.random() * confessions.length);
    const confession = { ...confessions[randomIndex], id: confessionIdCounter++ };
    console.log('Confession retrieved:', confession);
    res.json(confession);
});

// GET ratings for a confession
app.get('/ratings', (req, res) => {
    const confessionId = parseInt(req.query.id, 10);
    if (!confessionId || !ratings[confessionId]) {
        console.log(`No ratings found for confession ${confessionId}`);
        return res.status(404).json({ message: 'No ratings found for the given confession ID.' });
    }
    console.log(`Ratings retrieved for confession ${confessionId}:`, ratings[confessionId]);
    res.json({ id: confessionId, ratings: ratings[confessionId] });
});

// GET comments for a confession
app.get('/getComments', (req, res) => {
    const confessionId = parseInt(req.query.id, 10);
    if (!confessionId || !comments[confessionId]) {
        console.log(`No comments found for confession ${confessionId}`);
        return res.status(404).json({ message: 'No comments found for the given confession ID.' });
    }
    console.log(`Comments retrieved for confession ${confessionId}:`, comments[confessionId]);
    res.json({ id: confessionId, comments: comments[confessionId] });
});

// POST a confession
app.post('/postConfession', (req, res) => {
    const { text } = req.body;
    if (!text) {
        console.log('No confession text sent.');
        return res.status(400).json({ message: 'No confession text sent.' });
    }
    const confession = { text };
    confessions.push(confession);
    console.log('Confession submitted:', confession);
    saveConfessionsToFile();
    res.json({ message: 'Confession submitted successfully!' });
});

// POST a rating
app.post('/postRatings', (req, res) => {
    const { id, rating } = req.body;
    if (!id || typeof rating !== 'number' || rating < 1 || rating > 5) {
        console.log('Invalid rating submission:', req.body);
        return res.status(400).json({ message: 'Invalid ID or rating. Rating must be between 1 and 5.' });
    }
    if (!ratings[id]) {
        ratings[id] = [];
    }
    ratings[id].push(rating);
    console.log(`Rating submitted for confession ${id}: ${rating}`);
    saveRatingsToFile();
    res.json({ message: 'Rating submitted successfully!' });
});

// POST a comment
app.post('/postComment', (req, res) => {
    const { id, comment } = req.body;
    if (!id || !comment || typeof comment !== 'string') {
        console.log('Invalid comment submission:', req.body);
        return res.status(400).json({ message: 'Invalid ID or comment text.' });
    }
    if (!comments[id]) {
        comments[id] = [];
    }
    comments[id].push(comment);
    console.log(`Comment sent for confession ${id}: ${comment}`);
    saveCommentsToFile();
    res.json({ message: 'Comment sent sucessfully!' });
});

// GET help
app.get('/help', (req, res) => {
    const helpMessage = {
        message: 'Welcome to the Confession API!',
        github: 'https://github.com/RadioactivePotato/confessions-api',
        endpoints: {
            '/getConfession': 'GET a confession.',
            '/ratings?id=<confessionId>': 'GET ratings for a specific confession by ID.',
            '/getComments?id=<confessionId>': 'GET comments for a confession.',
            '/postConfession': 'POST a new confession.',
            '/postRatings': 'POST a new rating for a confession.',
            '/postComment': 'POST a comment for a confession.'
        }
    };
    console.log('Professional help sent:', helpMessage);
    res.json(helpMessage);
});

// Start API
app.listen(port, () => {
    console.log(`API is running on http://localhost:${port}, try curl http://localhost:${port}/help`);
});
