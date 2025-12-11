const express = require('express');
const path = require('path');

const songsRouter = require('./routes/songs');
const logger = require('./middleware/logger');

const app = express();


app.use(express.json());


app.use(logger);

app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/songs', songsRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

module.exports = app;

