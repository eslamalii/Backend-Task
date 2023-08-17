const CustomError = require('../utils/customError');

const errorHandler = (err, req, res, next) => {
  if (err instanceof CustomError) {
    res.status(err.statusCode).send({ message: err.message });
  } else {
    res.status(500).send({ message: 'An unexpected error occurred' });
  }
};

module.exports = errorHandler

