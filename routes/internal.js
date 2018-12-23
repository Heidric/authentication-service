const router     = require('express').Router();
const controller = require('../controllers/internalController');

router
  .post('/authenticate', controller.authenticate);

module.exports = router;
