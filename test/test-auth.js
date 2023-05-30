require('dotenv').config();
const { describe, it, before } = require('mocha');
const assert = require('assert');
const db = require('../db.js');
const auth = require('../auth.js');

describe('Authenticated request', () => {
  before(async () => {
    await db.sql.file('./db/tbl-teardown.sql');
    await db.sql.file('./db/tbl-setup.sql');
    await db.sql.file('./db/db-init.sql');
  });
  it('Should let in', async () => {
    const secret = 'secret';
    const user = 'user';
    const pass = 'pass';
    const token = await auth.token(user, pass, secret);
    const req = {
      get(name) {
        return (name === 'Authorization') ? `Bearer ${token}` : '';
      },
    };
    assert.strictEqual(auth.authUser(secret)(req, secret), 1);
  });
});
