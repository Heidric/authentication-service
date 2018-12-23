module.exports = (res, error, internal = false) => {
  console.log("Something went wrong: \n", error);

  const response = {
    message: 'Unidentified server error'
  };

  if (internal || (process.env.NODE_ENV && process.env.NODE_ENV === 'develop') || !process.env.NODE_ENV) {
    response.error = error;
  }

  return res.status(500).json(response);
};
