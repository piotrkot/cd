require('dotenv').config();
const express = require('express');
const slowDown = require('express-slow-down');
const { logger } = require('./log.js');
const auth = require('./auth.js');
const dishes = require('./routes/dishes.js');
const ratings = require('./routes/ratings.js');

const app = express();
const port = process.env.APPPORT;

const speedLimiter = slowDown({
  windowMs: 5 * 60 * 1000, // 5 minutes
  delayAfter: 5, // allow 5 requests per 5 minutes, then add 500ms delays for each next request
  delayMs: 500,
});

app.use(speedLimiter);
app.use(express.urlencoded({ extended: true }));

app.post('/authenticate', async (req, res) => {
  logger.info(req.body);
  const token = await auth.token(req.body.user, req.body.pass);
  res.json(token);
});

app.use('/dishes', auth.secure()(dishes));
app.use('/ratings', auth.secure()(ratings));

app.listen(port, () => {
  logger.info(`The Magical listening on port ${port}`);
});
