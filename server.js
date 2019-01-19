const app = require('./app');
const db  = require('./db');

const port = process.env.PORT || 8080;

db.sequelize.sync()
  .then(async () => {
    app.listen(port, () => {
      console.log('Port ' + port + ' is listened by our server.');
    });
  });
