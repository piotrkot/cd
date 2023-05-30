const jwt = require('jsonwebtoken');
const { logger } = require('./log.js');
const db = require('./db.js');

const authUser = (secret = process.env.JWT_SECRET) => (req) => {
  const header = req.get('Authorization');
  if (header) {
    const token = header.split('Bearer ').pop();
    const user = jwt.verify(token, secret);
    logger.info(`Authenticated: ${user.sub}`);
    return user.sub;
  }
  throw new Error('Unauthenticated request');
};

module.exports = { authUser };

module.exports.token = async (user, pass, secret = process.env.JWT_SECRET) => {
  const match = await db.sql`
    SELECT (passhash_s = crypt(${pass}, passhash_s)) AS passmatch, id_i id
    FROM users WHERE user_s = ${user}
  `;
  if (match.count > 0 && match[0].passmatch === true) {
    return jwt.sign({ sub: match[0].id }, secret);
  }
  throw new Error('Unauthorized request');
};

module.exports.secure = (secret = process.env.JWT_SECRET) => (fn) => (req, res) => {
  try {
    authUser(secret)(req);
    fn(req, res);
  } catch {
    res.status(401).json('Unauthorized request');
  }
};
