const isInternal = require('./middleware/isInternal');
const express    = require('express');
const app        = express();

const bodyParser = require('body-parser');

app.use(bodyParser.json({ limit: '5mb' }));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(express.static('public'));

app.use('/api/v1/auth',                      require('./routes/auth'));

app.use('/api/v1/internal/auth', isInternal, require('./routes/internal'));

app.all('*',                                 require('./responses/routeNotFound'));

module.exports = app;
