const express = require('express');
const { logger } = require('../log.js');
const db = require('../db.js');
const auth = require('../auth.js');

const router = express.Router();

router.post('/:dishid', async (req, res) => {
  logger.info(req.params);
  logger.info(req.body);
  const user = auth.authUser()(req);
  const inserted = await db.sql`
    INSERT INTO ratings(vote_i, dishid_i, userid_i)
    VALUES (${req.body.vote}, ${req.params.dishid}, ${user})
    RETURNING vote_i vote, dishid_i dish
  `;
  res.json(inserted);
});

router.get('/', async (req, res) => {
  const selected = await db.sql`
    SELECT avg(vote_i) votes, dishid_i dish
    FROM ratings
    GROUP BY dishid_i
  `;
  res.json(selected);
});

module.exports = router;
