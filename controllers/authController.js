const db                  = require('../db');
const bcrypt              = require('bcrypt');
const config              = require('../config');
const uuid                = require('uuid/v1');
const redis               = require('redis');
const client              = redis.createClient();
const internalServerError = require('../responses/internalServerError');

async function register(req, res, next) {
  const accountData = req.body;

  const params = await checkParams(accountData);

  if (params.length !== 0) {
    return res.status(422).json({ params, message: 'Validation error. Check your data.' });
  }

  return db.Account.findOne({
    where: {
      username: accountData.username
    }
  })
    .then(async (account) => {
      if (account) {
        return res.status(400).json({ message: 'This username is already taken.' });
      }

      accountData.password = bcrypt.hashSync(accountData.password, 12);

      await db.Account.create(accountData);

      return res.json({
        message: 'Account was successfully created.'
      });
    })
    .catch((error) => {
      return internalServerError(res, error);
    });
}

async function login(req, res, next) {
  const accountData = req.body;

  const params = await checkParams(accountData);

  if (params.length !== 0) {
    return res.status(422).json({ params, message: 'Validation error. Check your data.' });
  }

  return db.Account.findOne({
    where: {
      username: accountData.username
    }
  })
    .then((account) => {
      if (!account) {
        return res.status(404).json({ message: 'Account not found' });
      }
      return bcrypt.compare(accountData.password, account.password)
        .then((correct) => {
          if (correct) {
            const session = uuid();

            client.set(session, account.username, 'EX', 7200);

            client.get(session, async (error, result) => {
              if (error) {
                throw error;
              }

              return res.json({
                message: 'Authentication was successful.',
                session
              });
            });
          } else {
            return res.status(400).json({
              message: 'Wrong username or password.'
            });
          }
        })
    })
    .catch((error) => {
      return internalServerError(res, error);
    });
}

module.exports = {
  register,
  login
};

async function checkParams(accountData) {
  let params = [];

  if (!accountData) {
    params.push({
      field: 'account',
      error: 'Account data cannot be empty'
    });
  }

  const mandatoryFields = [ 'username', 'password' ];

  for (const field of mandatoryFields) {
    if (!accountData[ field ]) {
      params.push({
        field,
        error: 'This field cannot be empty'
      });
    }
  }

  return params;
}
