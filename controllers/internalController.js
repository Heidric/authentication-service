const db                  = require('../db');
const redis               = require('redis');
const client              = redis.createClient();
const internalServerError = require('../responses/internalServerError');

async function authenticate(req, res, next) {
  const session = req.body.session;

  return client.get(session, async (error, result) => {
    if (error) {
      return internalServerError(res, error, true);
    }

    if (result != null) {
      const account = await db.Account.findOne({
        where: {
          username: result
        }
      });

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
