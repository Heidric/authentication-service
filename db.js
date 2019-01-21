const config    = require('./config');
const Sequelize = require('sequelize');
const db        = new Sequelize(config.database.dbName, config.database.login, config.database.password, {
  host:    config.database.host,
  dialect: 'postgres',

  define: {
    timestamps: true
  },

  pool: {
    max:     5,
    min:     0,
    acquire: 30000,
    idle:    10000
  },

  operatorsAliases: false,

  logging: process.env.NODE_ENV === 'develop'
});

const models = new Map([
  [ 'Account', 'account' ],
]);

models.forEach((value, key) => {
  module.exports[ key ] = db.import(`./models/${value}`);
});

module.exports.sequelize = db;
