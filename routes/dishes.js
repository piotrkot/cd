const express = require('express');
const { logger } = require('../log.js');
const db = require('../db.js');

const router = express.Router();

router.post('/', async (req, res) => {
  logger.info(req.body);
  const inserted = await db.sql`
    INSERT INTO dishes(name_s, desc_s, price_n)
    VALUES (${req.body.name}, ${req.body.desc}, ${req.body.price})
    RETURNING id_i id, name_s name, desc_s desc, price_n price
  `;
  res.json(inserted);
});

router.delete('/:id', async (req, res) => {
  logger.info(req.params);
  const deleted = await db.sql`
    DELETE FROM dishes WHERE id_i = ${req.params.id}
    RETURNING id_i id
  `;
  res.json(deleted);
});

router.put('/:id', async (req, res) => {
  logger.info(req.body);
  logger.info(req.params);
  const updated = await db.sql`
    UPDATE dishes SET name_s = ${req.body.name},
     desc_s = ${req.body.desc}, price_n = ${req.body.price}
    WHERE id_i = ${req.params.id}
    RETURNING id_i id, name_s name, desc_s desc, price_n price
  `;
  res.json(updated);
});

router.get('/', async (req, res) => {
  logger.info(req.query);
  const textSearch = (query) => db.sql`
    AND tsv @@ to_tsquery('english', ${query})
    ORDER BY ts_rank(tsv, to_tsquery('english', ${query})) DESC
  `;
  const min = req.query.min ?? 0;
  const max = req.query.max ?? Number.MAX_VALUE;
  const selected = await db.sql`
    SELECT id_i id, name_s name, desc_s desc, price_n price
    FROM dishes
    WHERE price_n >= ${min} AND price_n <= ${max} ${
  req.query.query
    ? textSearch(req.query.query)
    : db.sql``
}
  `;
  res.json(selected);
});

module.exports = router;
