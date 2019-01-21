// TODO: check if the request is internal

module.exports = (req, res, next) => {
  if (req.headers['service_auth']) {
    return next();
  } else {
    return require('../responses/routeNotFound')(req, res, next);
  }
};
