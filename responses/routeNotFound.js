module.exports = (req, res, next) => {
  console.log('Attempt to access nonexistent or internal route without proper authorization.');
  console.log(`Address requested: ${req.originalUrl}`);
  console.log(`Headers: ${JSON.stringify(req.headers)}`);

  return res.status(404).json({ message: `Route you're trying to access doesn't exist.` });
};
