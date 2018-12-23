module.exports = (req, res, next) => {
  console.log('Attempt to access nonexistent or internal route without proper authorization.');

  return res.status(404).json({ message: `Route you're trying to access doesn't exist.` });
};
