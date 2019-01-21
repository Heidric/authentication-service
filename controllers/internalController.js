const db                  = require('../db');
const redis               = require('redis');
const internalServerError = require('../responses/internalServerError');

async function authenticate(req, res, next) {
  const client  = redis.createClient();
  const session = req.body.session;

  if (!session) {
    return res.status(400).json({ message: 'Session cannot be empty.' });
  }

  return client.get(session, async (error, result) => {
    if (error) {
      return internalServerError(res, error, true);
    }

    if (result != null) {
      const account = await db.Account.findOne({
        where: {
          username: result
        },
        raw: true
      });

      delete account.password;

      if (account) {
        client.set(session, account.username, 'EX', 7200);
        return res.json({
          message: 'Success.',
          account
        });
      }
    } else {
      return res.status(400).json({
        message: 'Provided session was not found.'
      });
    }
  });
}

module.exports = {
  authenticate
};
